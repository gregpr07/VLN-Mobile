from esearch.documents import LectureDocument, AuthorDocument
from elasticsearch_dsl import Search, Q

from elasticsearch_dsl.query import MoreLikeThis


def authorCall(query):
    q = Q('bool',
          must=[Q('match', name=query)],
          #should=[Q(...), Q(...)],
          # minimum_should_match=0.1
          )

    s = AuthorDocument.search().query(q)
    resp = s.execute()
    print(f'Found {resp.hits.total} authors for query: "{query}"')

    return formatAuthorResp(resp)


def formatAuthorResp(resp):
    results = []
    for hit in resp:
        obj = {
            'name': hit.name,
            'views': hit.views
        }
        results.append(obj)
    return results


def lectureCall(query):
    q = Q('bool',
          should=[Q("multi_match", query=query,
                    fields=['title', 'description', 'author__name'])],
          #should=[Q(...), Q(...)],
          # minimum_should_match=0.1
          )

    s = LectureDocument.search().query(q)
    resp = s.execute()
    print(f'Found {resp.hits.total} lectures for query: "{query}"')

    return formatLectureResp(resp)


def formatLectureResp(resp):
    results = []
    for hit in resp:
        obj = {
            'title': hit.title,
            'description': hit.description,
            'views': hit.views
        }
        results.append(obj)
    return results
