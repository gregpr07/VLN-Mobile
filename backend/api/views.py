# from rest_framework import viewsets, permissions

from api.models import UserModel, Lecture, Note, Slide
from api.serializers import UserModelSerializer, LectureSerializer, NoteSerializer, SlideSerializer
from api.viewsets import SimpleViewSet


class UserModelViewSet(SimpleViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserModelSerializer


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer


class SlideViewSet(SimpleViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer


class NoteViewSet(SimpleViewSet):
    # permission_classes = [permissions.IsAuthenticated, ]
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
