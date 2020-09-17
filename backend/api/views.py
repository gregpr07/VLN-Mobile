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


class NotesViewSet(SimpleViewSet):
    queryset = Notes.objects.all()
    serializer_class = NotesSerializer


class NoteViewSet(SimpleViewSet):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
