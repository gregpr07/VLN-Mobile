# https://blog.mimacom.com/autocomplete-elasticsearch-part1/


# pth = "/Users/greg/Documents/Programming/Projects/videolectures/VLN-Mobile/backend/db_sync_scripts/elastic.py"
# exec(open(pth).read())

from api.documents import LectureDocument, AuthorDocument
from elasticsearch_dsl import Search, Q

from elasticsearch_dsl.query import MoreLikeThis


inpt = input('Search query: ')

# .query('fuzzy', description=inpt)
s = LectureDocument.search().query(MoreLikeThis(
    like=my_text))  # 'fuzzy', description=inpt)

r = s.execute()

print(r.hits.total)

""" inpt1 = input("Search Author: ")

q = Q('bool',
      must=[Q('match', name=inpt1)],
      #should=[Q(...), Q(...)],
      # minimum_should_match=0.1
      )

s = AuthorDocument.search().query('match', name=inpt1)

r = s.execute()

print(r.hits)
print([a.name for a in r]) """
