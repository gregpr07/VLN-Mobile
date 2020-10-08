# coding: utf-8
from api.models import Lecture, Author
from django.utils.timezone import now
import json
from tqdm import tqdm

data = json.loads(open(input('location of json file (crawled)')).read())


authors = {}
for lec in tqdm(data):
    try:
        aut = lec['authors'][0]
        newviews = lec['view_ctr']

        if aut in authors:
            authors[aut] += newviews
        else:
            authors[aut] = newviews

    except Exception as e:
        print(e)

for aut in authors:
    Author.objects.update_or_create(name='aut', views=authors[aut])
