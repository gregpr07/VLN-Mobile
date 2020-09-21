# from rest_framework import viewsets, permissions
from rest_framework import mixins, viewsets

from api.models import UserModel, Lecture, Note, Slide, Author, Event, Playlist
from api.serializers import UserModelSerializer, LectureSerializer, NoteSerializer, SlideSerializer, AuthorSerializer, \
    EventSerializer, PlaylistSerializer


# Custom ViewSet
class SimpleViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    pass


class UserModelViewSet(SimpleViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserModelSerializer


class AuthorViewSet(SimpleViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer


class SlideViewSet(SimpleViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer


class EventViewSet(SimpleViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class PlaylistViewSet(SimpleViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class NoteViewSet(SimpleViewSet):
    # permission_classes = [permissions.IsAuthenticated, ]
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
