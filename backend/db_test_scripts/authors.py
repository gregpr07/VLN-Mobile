# coding: utf-8
from api.models import Lecture, Author
from django.utils.timezone import now
import json
data = json.loads(open(
    "/Users/greg/Documents/Programming/Projects/videolectures/research/data/lectures_categories.json").read())


authors = {}
for lec in data:
    try:
        aut = lec['authors'][0]
        newviews = lec['view_ctr']

        if aut in authors:
            authors[aut] += newviews
        else:
            authors[aut] = newviews

    except Exception as e:
        print(e)


authors
len(authors)
authors['Erik Novak']
