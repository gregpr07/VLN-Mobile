import os
from django.core.management.base import BaseCommand, CommandError

from sshtunnel import SSHTunnelForwarder
import psycopg2

import pandas as pd

from tqdm import tqdm

from api.models import Category

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


class Command(BaseCommand):
    help = 'Sync database from VLN server'

    def add_arguments(self, parser):
        pass

    def ToInt(self, num):
        try:
            return int(num)
        except:
            return False

    def process_categories(self):

        # execute our Query
        cursor.execute("SELECT * FROM categories_category")

        categories = cursor.fetchall()

        df = pd.DataFrame(categories)

        # ? sort by url_path -> can create straight away
        df = df.sort_values(4)

        for index, cat in tqdm(df.iterrows()):
            # schema as seen on production_DB
            parent_id = self.ToInt(cat[2])
            parent = None
            if parent_id:
                parent = Category.objects.get(id=parent_id)
            Category.objects.update_or_create(
                id=cat[0], name=cat[1], parent=parent)

        print('Done adding categories')

        return True

    def handle(self, *args, **options):

        self.process_categories()

        server.stop()
