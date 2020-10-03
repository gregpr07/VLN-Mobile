from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse

from .es_calls import authorCall, lectureCall

# Create your views here.


class Search(APIView):
    def get(self, request, query):
        try:
            authors = authorCall(query)
            lectures = lectureCall(query)
            ret = {
                'authors': authors,
                'lectures': lectures
            }
            return Response(ret)

        except Exception as e:
            print(e)
            return HttpResponse(e, status=500)
