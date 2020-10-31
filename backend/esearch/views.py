from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse

from .es_calls import *


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


class SearchEvents(APIView):
    def get(self, request, query, page):
        try:
            lectures = eventCall(query, page=page)
            ret = {
                'page': page,
                'events': lectures
            }
            return Response(ret)

        except Exception as e:
            print(e)
            return HttpResponse(e, status=500)

class SearchCategories(APIView):
    def get(self, request, query, page):
        try:
            categories = categoryCall(query, page=page)
            ret = {
                'page': page,
                'categories': categories
            }
            return Response(ret)

        except Exception as e:
            print(e)
            return HttpResponse(e, status=500)

