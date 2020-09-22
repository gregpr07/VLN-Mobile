from rest_framework import mixins, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import UserModel, Lecture, Note, Slide, Author, Event, Playlist
from api.serializers import UserModelSerializer, LectureSerializer, NoteSerializer, SlideSerializer, AuthorSerializer, \
    EventSerializer, PlaylistSerializer


# Custom ViewSet
class SimpleViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    pass


def list_mixin(obj, queryset):
    page = obj.paginate_queryset(queryset)
    if page is not None:
        serializer = obj.get_serializer(page, many=True)
        return obj.get_paginated_response(serializer.data)

    serializer = obj.get_serializer(queryset, many=True)
    return Response(serializer.data)


class UserModelViewSet(SimpleViewSet):
    queryset = UserModel.objects.all()
    serializer_class = UserModelSerializer


class AuthorViewSet(SimpleViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    @action(detail=False)
    def top(self, request, *args, **kwargs):
        queryset = Author.objects.order_by("-views")
        return list_mixin(self, queryset)


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer


class SlideViewSet(SimpleViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def lecture(self, request, lecture_pk):
        queryset = Slide.objects.filter(lecture_id=lecture_pk)
        list_mixin(self, queryset)


class EventViewSet(SimpleViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class PlaylistViewSet(SimpleViewSet):
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer


class NoteViewSet(SimpleViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def get_queryset(self):
        user_model = UserModel.objects.get(user=self.request.user)
        return Note.objects.filter(user=user_model)

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def user(self, request, lecture_pk):
        user_model = UserModel.objects.get(user=self.request.user)
        queryset = Note.objects.filter(lecture_id=lecture_pk, user=user_model)

        return list_mixin(self, queryset)
