from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse

from .es_calls import authorCall, lectureCall

# Create your views here.


class SearchAuthors(APIView):
    def get(self, request, query, page):
        try:
            authors = authorCall(query, page=page)
            ret = {
                'page': page,
                'authors': authors,
            }
            return Response(ret)

        except Exception as e:
            print(e)
            return HttpResponse(e, status=500)


class SearchLectures(APIView):
    def get(self, request, query, page):
        try:
            lectures = lectureCall(query, page=page)
            ret = {
                'page': page,
                'lectures': lectures
            }
            return Response(ret)

        except Exception as e:
            print(e)
            return HttpResponse(e, status=500)
