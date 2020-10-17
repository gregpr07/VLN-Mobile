from esearch.documents import LectureDocument, AuthorDocument
from elasticsearch_dsl import Search, Q

from elasticsearch_dsl.query import MoreLikeThis

PAGINATE_SIZE = 20


def authorCall(query, page=0):
    q = Q('bool',
          must=[Q('match', name=query)],
          #should=[Q(...), Q(...)],
          # minimum_should_match=0.1
          )

    s = AuthorDocument.search().query(
        q)[page*PAGINATE_SIZE:(page+1)*PAGINATE_SIZE]
    resp = s.execute()
    print(f'Found {resp.hits.total.value} authors for query: "{query}"')

    return formatAuthorResp(resp)


def formatAuthorResp(resp):
    results = []
    for hit in resp:
        obj = {
            'name': hit.name,
            'views': hit.views,
            'id': hit.id
        }
        results.append(obj)
    return results


def lectureCall(query, page=0):
    q = Q('bool',

          should=[Q('match', title=query),
                  Q('match', description=query),
                  Q('match', author__name=query),
                  Q('match', event__title=query)
                  ],
          #must=[Q('match', author__name=query)],
          minimum_should_match=1
          )

    s = LectureDocument.search().query(
        q)[page*PAGINATE_SIZE:(page+1)*PAGINATE_SIZE]
    resp = s.execute()
    print(f'Found {resp.hits.total.value} lectures for query: "{query}"')
    print(len(resp))

    return formatLectureResp(resp)


def formatLectureResp(resp):
    results = []
    for hit in resp:
        obj = {
            'title': hit.title,
            # 'description': hit.description,
            'views': hit.views,
            'thumbnail': hit.thumbnail,
            'author': hit.author.name,
            'id': hit.id,
            'event': hit.event.title
        }
        results.append(obj)
    return results
