import os
from django.core.management.base import BaseCommand, CommandError

from sshtunnel import SSHTunnelForwarder
import psycopg2

import pandas as pd

from tqdm import tqdm

from api.models import Category, Author, Lecture
from django.contrib.auth.models import User


from dotenv import load_dotenv
load_dotenv()

REMOTE_HOST = os.getenv("REMOTE_HOST")
REMOTE_USERNAME = os.getenv("REMOTE_USERNAME")
REMOTE_PASSWORD = os.getenv("REMOTE_PASSWORD")

PRODUCTION_DB_HOST = os.getenv("PRODUCTION_DB_HOST")
PRODUCTION_DB_NAME = os.getenv("PRODUCTION_DB_NAME")
PRODUCTION_DB_USER = os.getenv("PRODUCTION_DB_USER")
PRODUCTION_DB_PASSWORD = os.getenv("PRODUCTION_DB_PASSWORD")

PORT = 5555
conn_string = f"host='{PRODUCTION_DB_HOST}' port='{PORT}' dbname='{PRODUCTION_DB_NAME}' user='{PRODUCTION_DB_USER}' password='{PRODUCTION_DB_PASSWORD}'"

server = SSHTunnelForwarder((REMOTE_HOST, 22),
                            ssh_username=REMOTE_USERNAME,
                            ssh_password=REMOTE_PASSWORD,
                            remote_bind_address=(
    'localhost', 5432),
    local_bind_address=('localhost', PORT))

server.start()

print('connected to: ' + str(server.local_bind_port))

conn = psycopg2.connect(conn_string)

cursor = conn.cursor()

cursor.execute("Select * FROM storage_volume LIMIT 0")
storage_volume_cols = [desc[0] for desc in cursor.description]


cursor.execute(
    "SELECT * FROM storage_volume WHERE \"server_id\" = '8'")


storage_volumes = {}
for vol in cursor.fetchall():
    storage_volumes[vol[storage_volume_cols.index(
        'id')]] = vol[storage_volume_cols.index('path')]

# GET COLUMNS OF STORAGE SERVER -> AVOID STATICALLY TYPED INDEXES (IF THEY CHANGE)
cursor.execute("Select * FROM storage_server LIMIT 0")
STORAGE_SERVER_COLS = [desc[0] for desc in cursor.description]

# get server host link (have to manually add http://)
cursor.execute("SELECT * FROM storage_server WHERE \"id\" = '8'")
SERVER_HOST = 'http://' + cursor.fetchone()[STORAGE_SERVER_COLS.index('host')]

cursor.execute("Select * FROM storage_file LIMIT 0")
STORAGE_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_contribution LIMIT 0")
AUTHOR_COLS = [desc[0] for desc in cursor.description]


class Command(BaseCommand):
    help = 'Sync database from VLN server'

    def add_arguments(self, parser):
        pass

    def ToInt(self, num):
        try:
            return int(num)
        except:
            return False

    def get_lecture_author_id(self, lecture_id):
        query = f'SELECT * FROM vl_contribution WHERE ("lecture_id" = \'{lecture_id}\') AND ("type" = \'a\')'

        cursor.execute(query)

        author_id = cursor.fetchone()[AUTHOR_COLS.index('contributor_id')]

        return Author.objects.get(id=author_id)

    def makeurl(self, video):

        url = SERVER_HOST + '/' + \
            storage_volumes[video[STORAGE_COLS.index('volume_id')]] + '/' + \
            str(video[STORAGE_COLS.index('dir')]) + \
            '/' + video[STORAGE_COLS.index('hash')] + \
            '.' + video[STORAGE_COLS.index('ext')]

        return url

    def get_lecture_video(self, slug):

        cursor.execute(
            # only select hydro server
            f"SELECT * FROM storage_file WHERE ((path::TEXT LIKE '/mnt/hydro/video/scratch/{slug}_01%' AND path::TEXT LIKE '%_h264_%') OR LOWER(path)::TEXT LIKE LOWER('%{slug}_01.mp4%')) AND server_id = '8' ORDER BY size DESC")

        video = cursor.fetchone()

        return self.makeurl(video)

    def get_lecture_thumbnail(self, slug):
        """ try: """
        cursor.execute(
            f"SELECT * FROM storage_file WHERE path::TEXT LIKE '%{slug}%' AND ext::TEXT LIKE 'jpg' AND server_id = '8' ORDER BY size")
        img = cursor.fetchone()

        return self.makeurl(img)
        """ except:
        return '' """

    def get_lectures(self):
        cursor.execute("Select * FROM vl_lecture LIMIT 0")
        LECTURE_COLS = [desc[0] for desc in cursor.description]

        cursor.execute(
            "SELECT * FROM vl_lecture WHERE (\"enabled\" = 'true') AND (\"type\" = 'vl') AND (\"public\" = 'true')")
        lectures = cursor.fetchall()

        added = 0
        already_there = 0
        errors = 0

        for lecture in tqdm(lectures):
            lec_id = lecture[0]

            try:
                Lecture.objects.get(id=lec_id)
                already_there += 1
            except:
                slug = lecture[LECTURE_COLS.index('slug')]
                title = lecture[LECTURE_COLS.index('title')]
                description = lecture[LECTURE_COLS.index('desc')]
                published = lecture[LECTURE_COLS.index('pub_date')]
                views = lecture[LECTURE_COLS.index('view_ctr')]

                try:

                    video_url = self.get_lecture_video(slug)

                    thumbnail = self.get_lecture_thumbnail(slug)

                    try:
                        author = self.get_lecture_author_id(lec_id)
                    except:
                        author = Author.objects.get(id=1)

                    author.views += views
                    author.save()

                    Lecture.objects.create(id=lec_id, title=title, description=description,
                                           author=author, video=video_url, published=published,
                                           thumbnail=thumbnail, views=views, audio='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
                                           )

                    added += 1

                except Exception as e:
                    errors += 1
                    tqdm.write(
                        f'Error at: {slug}. Currently {errors} errors. \n{e}')
                    pass

        print(
            f'Added {added} lectures and updated {already_there} lectures; {errors} errors.')

    def get_authors(self):
        cursor.execute("SELECT * FROM vl_author")

        descriptions = {}
        for aut in cursor.fetchall():
            descriptions[aut[-1]] = aut[5][:1000]

        cursor.execute("SELECT * FROM vl_contributor WHERE \"type\" = 'P'")
        authors = cursor.fetchall()

        cursor.execute("Select * FROM vl_contributor LIMIT 0")
        cols = [desc[0] for desc in cursor.description]

        try:
            Author.objects.get(id=1)
        except:
            Author.objects.update_or_create(
                id=1, name='none', views=0)

        print('Adding authors')
        for author in tqdm(authors):
            aut_id = author[cols.index('id')]
            # print(author)
            try:
                Author.objects.get(id=aut_id)
            except:
                Author.objects.create(
                    id=aut_id, name=author[cols.index('name')], views=0, description=descriptions[author[aut_id]])
        print('Added all authors')

    def process_categories(self):
        cursor.execute("SELECT * FROM categories_category")
        categories = cursor.fetchall()

        df = pd.DataFrame(categories)

        cursor.execute("Select * FROM categories_category LIMIT 0")

        cols = [desc[0] for desc in cursor.description]

        # ? sort by url_path -> can create straight away
        df = df.sort_values(cols.index('url_path'))

        print('Adding categories')
        for index, cat in tqdm(df.iterrows()):
            # schema as seen on production_DB
            parent_id = self.ToInt(cat[cols.index('parent_id')])
            parent = None
            if parent_id:
                parent = Category.objects.get(id=parent_id)
            Category.objects.update_or_create(
                id=cat[cols.index('id')], name=cat[cols.index('name')], parent=parent)
        print('Added all categories')

        return True

    def get_users(self,):
        cursor.execute(
            "SELECT * FROM auth_user WHERE (\"is_active\" = 'true') AND (\"password\"::TEXT LIKE '%pbkdf2_sha256%')")
        users = cursor.fetchall()

        print('Adding users')
        updated = 0
        created = 0

        cursor.execute("Select * FROM auth_user LIMIT 0")

        cols = [desc[0] for desc in cursor.description]

        for user in tqdm(users):
            # print(author)

            user_id = user[cols.index('id')]

            password = user[cols.index('password')]

            try:
                userObject = User.objects.get(id=user_id)
                if userObject.password != password:
                    userObject.password = password

                    updated += 1
                    userObject.save()
            except:
                User.objects.create(id=user_id, username=user[cols.index('username')], first_name=user[cols.index('first_name')],
                                    last_name=user[cols.index(
                                        'last_name')], email=user[cols.index('email')],
                                    password=password, is_staff=user[cols.index(
                                        'is_staff')], is_active=user[cols.index('is_active')],
                                    is_superuser=user[cols.index('is_superuser')])
                created += 1

        # first_name=user[2], last_name=user[3], email = user[4], last_login=user[9], date_joined=user[10]

        print(f'Added {created} users and updated {updated} users')

    def handle(self, *args, **options):

        self.process_categories()
        self.get_authors()
        self.get_users()

        self.get_lectures()

        # print('test')

        """lec = 'eswc09_munoz_ess'
        print(self.get_lecture_video(lec))
        print(self.get_lecture_thumbnail(lec))"""

        server.stop()
