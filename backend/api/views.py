from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import UserModel, Lecture


class UserList(APIView):

    @staticmethod
    def get(request):
        user_models = UserModel.objects.all()

        return Response({
            'user_count': user_models.count(),
            'users': [
                {
                    'id': user_model.id,
                    'name': user_model.name,
                    'last_name': user_model.last_name,
                } for user_model in user_models
            ]
        })


class UserInfo(APIView):

    @staticmethod
    def get(request, user_id):

        if not UserModel.objects.filter(id=user_id).exists():
            raise NotFound(detail="Requested UserModel could not be found.", code=404)

        user_model = UserModel.objects.get(id=user_id)

        return Response({
            'id': user_model.id,
            'name': user_model.name,
            'last_name': user_model.last_name,
        })


class LectureList(APIView):

    @staticmethod
    def get(request):
        lectures = Lecture.objects.all()

        return Response({
            'lecture_count': lectures.count(),
            'lectures': [
                {
                    'id': lecture.id,
                    'title': lecture.title,
                    'views': lecture.views,
                    'author': lecture.author.id,
                    'published': lecture.published,
                    'video': lecture.video,
                    'audio': lecture.audio,
                } for lecture in lectures
            ]
        })


class LectureInfo(APIView):

    @staticmethod
    def get(request, lecture_id):

        if not Lecture.objects.filter(id=lecture_id).exists():
            raise NotFound(detail="Requested Lecture could not be found.", code=404)

        lecture = Lecture.objects.get(id=lecture_id)

        return Response({
            'id': lecture.id,
            'title': lecture.title,
            'views': lecture.views,
            'author': lecture.author.id,
            'published': lecture.published,
            'video': lecture.video,
            'audio': lecture.audio,
        })

