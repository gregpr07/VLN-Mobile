import os
from django.core.management.base import BaseCommand, CommandError

import sys

from sshtunnel import SSHTunnelForwarder
import psycopg2

import pandas as pd

from tqdm import tqdm

from api.models import Category, Author, Lecture, Event, Slide
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

cursor.execute("Select * FROM attachments_attachment LIMIT 0")
ATTACHMENTS_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_presentation LIMIT 0")
PRESENTATION_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_sync LIMIT 0")
SYNC_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_syncable LIMIT 0")
SYNCABLE_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_video LIMIT 0")
VIDEO_COLS = [desc[0] for desc in cursor.description]

cursor.execute("Select * FROM vl_contribution LIMIT 0")
AUTHOR_COLS = [desc[0] for desc in cursor.description]


class Command(BaseCommand):
    help = 'Sync database from VLN server'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Update/create everything in the database -> takes couple of hours (because of lecture updates)',
        )
        parser.add_argument(
            '--users',
            action='store_true',
            help='Update/create users -> super fast',
        )
        parser.add_argument(
            '--categories',
            action='store_true',
            help='Update/create categories -> super fast',
        )
        parser.add_argument(
            '--authors',
            action='store_true',
            help='Update/create authors -> super fast',
        )
        parser.add_argument(
            '--lectures',
            action='store_true',
            help='Update/create lectures -> insanely slow (couple of hours)',
        )
        parser.add_argument(
            '--events',
            action='store_true',
            help='Update/create events -> fast',
        )
        parser.add_argument(
            '--connectEvents',
            action='store_true',
            help='Connect lectures to existing events -> fast',
        )
        parser.add_argument(
            '--connectCategories',
            action='store_true',
            help='Connect categories to existing lectures -> fast',
        )
        parser.add_argument(
            '--getSlides',
            action='store_true',
            help='Get all the slides for all videos -> extremely slow!!',
        )

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

    #? FIXED ??
    def get_lecture_video(self, att_id, slug):
        lec_hash = None
        try:
            cursor.execute(
                f"SELECT * FROM attachments_attachment WHERE object_id = {att_id} AND type = 'v' AND ext = 'mp4' ORDER BY size"
            )
            lec_hash = cursor.fetchone()[ATTACHMENTS_COLS.index('hash')]
        except:
            lec_hash = None

        if not lec_hash:
            try:
                cursor.execute(
                    f"SELECT * FROM attachments_attachment WHERE object_id = {att_id} AND type = 'v.src' AND ext = 'mp4' ORDER BY size"
                )
                lec_hash = cursor.fetchone()[ATTACHMENTS_COLS.index('hash')]
            except:
                lec_hash = None

        """ except:
            raise NameError('No lecture found') """

        if lec_hash:
            cursor.execute(
                f"SELECT * FROM storage_file WHERE hash = '{lec_hash}' AND server_id = '8'")
            return self.makeurl(cursor.fetchone())

        else:
            cursor.execute(
                # only select hydro server
                f"SELECT * FROM storage_file WHERE ((path::TEXT LIKE '/mnt/hydro/video/scratch/{slug}_01%' AND path::TEXT LIKE '%_h264_%') OR LOWER(path)::TEXT LIKE LOWER('%{slug}_01.mp4%')) AND server_id = '8' ORDER BY size DESC")

            video = cursor.fetchone()

            return self.makeurl(video)

    #! Fixed ?
    def get_lecture_thumbnail(self, vid_id):
        
        cursor.execute(
            f"SELECT * FROM attachments_attachment WHERE object_id = {vid_id} AND ( type = 'i.thu' OR type = 'i.scr' ) AND ext = 'jpg' ORDER BY size"
        )

        lec_hash = cursor.fetchone()[ATTACHMENTS_COLS.index('hash')]


        cursor.execute(
            f"SELECT * FROM storage_file WHERE hash = '{lec_hash}' AND server_id = '8'")
        return self.makeurl(cursor.fetchone())

    #? 15k / 23k lectures are currently found
    def get_lectures(self):
        cursor.execute("Select * FROM vl_lecture LIMIT 0")
        LECTURE_COLS = [desc[0] for desc in cursor.description]

        cursor.execute(
            "SELECT * FROM vl_lecture WHERE (\"enabled\" = 'true') AND (\"public\" = 'true') AND (( type = 'vkn') OR ( type = 'vl') OR ( type = 'vdb') OR ( type = 'vdm') OR ( type = 'viv') OR ( type = 'vid') OR ( type = 'vop') OR ( type = 'vkn') OR ( type = 'vsm') OR ( type = 'vtt') OR ( type = 'vit') OR ( type = 'vtd') OR ( type = 'vpr') OR ( type = 'vtp') OR ( type = 'vpa') OR ( type = 'vps'))")

        added = 0
        already_there = 0
        errors = 0

        for lecture in tqdm(cursor.fetchall()):
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
                    cursor.execute(
                        f"SELECT * FROM vl_video WHERE lecture_id = {lec_id} AND part = '1'"
                    )
                    vid_id = cursor.fetchone()[VIDEO_COLS.index('id')]

                    video_url = self.get_lecture_video(vid_id,slug)

                    try:
                        author = self.get_lecture_author_id(lec_id)
                        thumbnail = self.get_lecture_thumbnail(vid_id)
                    except:
                        author = Author.objects.get(id=1)
                        thumbnail = None

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

    #? i guess all authors are there
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
                    id=aut_id, name=author[cols.index('name')], views=0, description=descriptions[aut_id])
        print('Added all authors')

    #? all categories are there
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

    #? all events have images!
    def getEventImage(self, evt_id):
        cursor.execute(
            f"SELECT * FROM attachments_attachment WHERE object_id = {evt_id} AND ((type = 'i.thu' AND path = 'thumbnail.jpg') OR type = 'i.bnr')"
        )
        thumb_hash = cursor.fetchone()[ATTACHMENTS_COLS.index('hash')]

        cursor.execute(
            f"SELECT * FROM storage_file WHERE hash = '{thumb_hash}' AND server_id = '8'")
        return self.makeurl(cursor.fetchone())

    #? all events are found
    def get_events(self):

        cursor.execute("Select * FROM vl_lecture LIMIT 0")
        cols = [desc[0] for desc in cursor.description]

        # get only the enabled events
        cursor.execute(
            "SELECT * FROM vl_lecture WHERE public = 'true' AND type = 'evt' AND enabled = 'true'")


        wo_image = 0

        print('Adding events')
        for event in tqdm(cursor.fetchall()):
            title = event[cols.index('title')]
            evt_id = event[cols.index('id')]
            description = event[cols.index('desc')]
            time = event[cols.index('time')]
            caption = event[cols.index('caption')]

            if not caption:
                caption = title

                #image = event[cols.index('thumb')]
            try:
                image = self.getEventImage(evt_id)

            except:
                wo_image += 1
                image = None

            try:
                Event.objects.get(id=evt_id)
            except:
                try:
                    Event.objects.create(id=evt_id, title=title, description=description,
                                         date=time, caption=caption, image=image)
                except:
                    pass

        print('Added all events','events with no image:',wo_image)

    def connect_events_lectures(self):
        cursor.execute("Select * FROM vl_ref LIMIT 0")
        cols = [desc[0] for desc in cursor.description]

        cursor.execute("SELECT * FROM vl_ref")
        vl_refs = {}
        for x in cursor.fetchall():
            vl_refs[x[cols.index('id')]] = x[cols.index('parent_id')]

        cursor.execute("Select * FROM vl_lecref LIMIT 0")
        cols = [desc[0] for desc in cursor.description]

        cursor.execute("SELECT * FROM vl_lecref")
        vl_lec_refs = {}
        for lec_ref in cursor.fetchall():
            ref_ptr_id = lec_ref[cols.index('ref_ptr_id')]
            vl_lec_refs[lec_ref[cols.index(
                'lecture_id')]] = vl_refs[ref_ptr_id]

        # print(vl_lec_refs[30518])

        self.stdout.write(self.style.SUCCESS(
            'Connecting lectures to events'))
        for lecture in tqdm(Lecture.objects.all()):
            try:
                lec_evt_id = vl_lec_refs[lecture.id]
                new = 0
                already = 0
                if not lecture.event:
                    try:
                        evt = Event.objects.get(id=lec_evt_id)
                        lecture.event = evt
                        lecture.save()
                        new += 1
                    except:
                        pass
                else:
                    already += 1
            except Exception as e:
                tqdm.write(str(e))
        print(f'Added {new}, already connected {already}')

    def connect_categories_lectures(self):
        cursor.execute("Select * FROM categories_member LIMIT 0")
        cols = [desc[0] for desc in cursor.description]


        connected = 0
        error = 0

        cursor.execute(
            "SELECT * FROM categories_member WHERE visible = 'true' ")

        self.stdout.write(self.style.SUCCESS(
            'Connecting categories to lectures'))

        for member in tqdm(cursor.fetchall()):
            lec_id = member[cols.index('lecture_id')]
            cat_id = member[cols.index('category_id')]

            try:
                lec = Lecture.objects.get(id=lec_id)

                if lec.categories.filter(id=cat_id).exists():
                    continue

                cat = Category.objects.get(id=cat_id)

                lec.categories.add(cat)

                tqdm.write(f'Linked {lec_id} and {cat}')

                connected += 1

            except Exception as e:
                error += 1
                pass

        self.stdout.write('Done connecting. '+self.style.SUCCESS(
            f'Connected {connected}. ')+self.style.ERROR(f'Errored {error}.'))

    def get_users(self,):
        self.stdout.write(self.style.SUCCESS('Adding users'))
        cursor.execute(
            "SELECT * FROM auth_user WHERE (\"is_active\" = 'true') AND (\"password\"::TEXT LIKE '%pbkdf2_sha256%')")
        users = cursor.fetchall()

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

        self.stdout.write(self.style.SUCCESS(
            f'Added {created} users and updated {updated} users'))

    def get_slides(self):
        self.stdout.write(self.style.SUCCESS('Getting slides'))

        for lec in tqdm(Lecture.objects.all()):
            
            try:
                cursor.execute(
                    f"SELECT * FROM vl_presentation WHERE lecture_id = '{lec.id}'"
                )
                presentation_id = cursor.fetchone()[PRESENTATION_COLS.index('id')]

                cursor.execute(
                    f"SELECT * FROM vl_syncable WHERE presentation_id = '{presentation_id}'"
                )


                #! COULD happen that if not all slides are added once, they never will be
                syncables = cursor.fetchall()
                if not len(lec.slides.all()): # != len(syncables):
                    for syncable in syncables:
                        syncable_id = syncable[PRESENTATION_COLS.index('id')]
                        title = syncable[SYNCABLE_COLS.index('title')][:200]


                        cursor.execute(
                            f"SELECT * FROM attachments_attachment WHERE object_id = {syncable_id} AND type = 'i.sld' AND ext = 'jpg' ORDER BY size"
                        )
                        img_hash = cursor.fetchone()[ATTACHMENTS_COLS.index('hash')]
                        cursor.execute(
                            f"SELECT * FROM storage_file WHERE hash = '{img_hash}' AND server_id = '8'")
                        image = self.makeurl(cursor.fetchone())


                        cursor.execute(
                            f"SELECT * FROM vl_sync where syncable_id = '{syncable_id}'"
                        )
                        timestamp = cursor.fetchone()[SYNC_COLS.index('time')]

                        Slide.objects.create(
                            id=syncable_id,
                            lecture=lec,
                            timestamp=timestamp,
                            image=image,
                            title=title
                        )
                    else:
                        tqdm.write('Already has all slides')

            except Exception as e:
                tqdm.write(str(e))


    def handle(self, *args, **options):

        if options['categories'] or options['all']:
            self.process_categories()

        if options['authors'] or options['all']:
            self.get_authors()

        if options['users'] or options['all']:
            self.get_users()

        if options['lectures'] or options['all']:
            self.get_lectures()

        if options['events'] or options['all']:
            self.get_events()

        if options['connectEvents'] or options['all']:
            self.connect_events_lectures()

        if options['connectCategories'] or options['all']:
            self.connect_categories_lectures()

        if options['getSlides'] or options['all']:
            self.get_slides()

        print('Done')

        """ lec_id = 11572
        
        cursor.execute(
            f"SELECT * FROM vl_video WHERE lecture_id = {lec_id} AND part = '1'"
        )
        vid_id = cursor.fetchone()[VIDEO_COLS.index('id')]
        print(self.get_lecture_video(vid_id, 'mitworld_lewin_wem'))
        print(self.get_lecture_thumbnail(vid_id)) """


        server.stop()