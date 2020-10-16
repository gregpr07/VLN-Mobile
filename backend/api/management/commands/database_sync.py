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

cursor.execute(
    "SELECT * FROM storage_volume WHERE \"server_id\" = '8'")

storage_volumes = {}
for vol in cursor.fetchall():
    storage_volumes[vol[0]] = vol[2]

cursor.execute("SELECT * FROM storage_server WHERE \"id\" = '8'")

server_host = cursor.fetchone()[2]


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

        author_id = cursor.fetchone()[1]

        return Author.objects.get(id=author_id)

    def makeurl(self, video):
        url = 'http://' + server_host + '/' + \
            storage_volumes[video[-2]] + '/' + \
            str(video[-4]) + '/' + video[2] + '.' + video[-3]

        return url

    def get_lecture_video(self, slug):

        cursor.execute(
            f"SELECT * FROM storage_file WHERE \"path\"::TEXT LIKE '%{slug}_01_1280x720_h264%'")
        video = cursor.fetchone()

        return self.makeurl(video)

    def get_lecture_thumbnail(self, slug):

        cursor.execute(
            f"SELECT * FROM storage_file WHERE \"path\"::TEXT LIKE '%{slug}_01.ss%'")
        img = cursor.fetchone()

        return self.makeurl(img)

    def get_lectures(self):
        cursor.execute(
            "SELECT * FROM vl_lecture WHERE (\"enabled\" = 'true') AND (\"type\" = 'vl') AND (\"public\" = 'true')")
        lectures = cursor.fetchall()

        added = 0
        already_there = 0

        for lecture in tqdm(lectures):
            lec_id = lecture[0]

            try:
                Lecture.objects.get(id=lec_id)
                already_there += 1
            except:
                slug = lecture[1]
                title = lecture[2]
                description = lecture[8]
                published = lecture[24]

                try:

                    video_url = self.get_lecture_video(slug)

                    thumbnail = self.get_lecture_thumbnail(slug)

                    author = self.get_lecture_author_id(lec_id)

                    Lecture.objects.create(id=lec_id, title=title, description=description,
                                           author=author, video=video_url, published=published,
                                           thumbnail=thumbnail, views=666, audio='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
                                           )

                    added += 1

                except Exception as e:
                    pass
        print(f'Added {added} lectures and updated {already_there} lectures')

    def get_authors(self):
        cursor.execute("SELECT * FROM vl_author")

        descriptions = {}
        for aut in cursor.fetchall():
            descriptions[aut[-1]] = aut[5][:1000]

        cursor.execute("SELECT * FROM vl_contributor WHERE \"type\" = 'P'")
        authors = cursor.fetchall()

        print('Adding authors')
        for author in tqdm(authors):
            # print(author)
            try:
                Author.objects.get(id=author[0])
            except:
                Author.objects.create(
                    id=author[0], name=author[2], views=0, description=descriptions[author[0]])
        print('Added all authors')

    def process_categories(self):
        cursor.execute("SELECT * FROM categories_category")
        categories = cursor.fetchall()

        df = pd.DataFrame(categories)

        # ? sort by url_path -> can create straight away
        df = df.sort_values(4)

        print('Adding categories')
        for index, cat in tqdm(df.iterrows()):
            # schema as seen on production_DB
            parent_id = self.ToInt(cat[2])
            parent = None
            if parent_id:
                parent = Category.objects.get(id=parent_id)
            Category.objects.update_or_create(
                id=cat[0], name=cat[1], parent=parent)
        print('Added all categories')

        return True

    def get_users(self,):
        cursor.execute(
            "SELECT * FROM auth_user WHERE (\"is_active\" = 'true') AND (\"password\"::TEXT LIKE '%pbkdf2_sha256%')")
        users = cursor.fetchall()

        print('Adding users')
        updated = 0
        created = 0

        for user in tqdm(users):
            # print(author)

            try:
                userObject = User.objects.get(id=user[0])
                if userObject.password != user[5]:
                    userObject.password = user[5]

                    updated += 1
                    userObject.save()
            except:
                User.objects.create(id=user[0], username=user[1], first_name=user[2], last_name=user[3], email=user[4], password=user[5], is_staff=user[6], is_active=user[7],
                                    is_superuser=user[8])
                created += 1

        # first_name=user[2], last_name=user[3], email = user[4], last_login=user[9], date_joined=user[10]

        print(f'Added {created} users and updated {updated} users')

    def handle(self, *args, **options):

        self.process_categories()
        self.get_authors()
        self.get_users()

        self.get_lectures()

        # print('test')

        server.stop()
