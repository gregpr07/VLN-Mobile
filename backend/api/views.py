from api.models import UserModel, Lecture
from api.serializers import UserModelSerializer, LectureSerializer
from api.viewsets import SimpleViewSet


class UserModelViewSet(SimpleViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserModelSerializer


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
