from rest_framework import viewsets, permissions

from api.models import UserModel, Lecture, Note, Notes, Slide
from api.serializers import UserModelSerializer, LectureSerializer, NoteSerializer, NotesSerializer, SlideSerializer
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


class NotesViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NotesSerializer

    def get_queryset(self):
        return Notes.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class NoteViewSet(SimpleViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
