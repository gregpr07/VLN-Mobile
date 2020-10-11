from django.db.models import Count
from rest_framework import mixins, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api.models import UserModel, Lecture, Note, Slide, Author, Event, Playlist, Category
from api.serializers import UserModelSerializer, LectureSerializer, NoteSerializer, SlideSerializer, AuthorSerializer, \
    EventSerializer, PlaylistSerializer, CategorySerializer


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
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return list_mixin(self, queryset)


class CategoryViewSet(SimpleViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer

    @action(detail=False)
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return list_mixin(self, queryset)

    @action(detail=False)
    def most_starred(self, request, *args, **kwargs):
        queryset = self.queryset.annotate(count=Count("stargazers")).order_by("-count")
        return list_mixin(self, queryset)


class SlideViewSet(SimpleViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def lecture(self, request, lecture_pk):
        queryset = Slide.objects.filter(lecture_id=lecture_pk)
        return list_mixin(self, queryset)


class EventViewSet(SimpleViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class PlaylistViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    @action(detail=False)
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return list_mixin(self, queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.usermodel)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user.usermodel)

    def perform_destroy(self, instance):
        if instance.user != self.request.user.usermodel:
            raise PermissionDenied({
                "message": "You don't have the permission to delete this object.",
                "object_id": instance.id
            })

        super().perform_destroy(instance)


class NoteViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.usermodel)

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user.usermodel)

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def user(self, request, lecture_pk):
        user_model = UserModel.objects.get(user=self.request.user)
        queryset = Note.objects.filter(lecture_id=lecture_pk, user=user_model)

        return list_mixin(self, queryset)


class StarLectureView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    @staticmethod
    def get(request, lecture_id):
        if not Lecture.objects.filter(id=lecture_id).exists():
            return Response({
                "detail": "Not found."
            })

        lecture = Lecture.objects.get(id=lecture_id)
        lecture.stargazers.add(request.user.usermodel)

        return Response({
            "starred": "true"
        })


class UnstarLectureView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    @staticmethod
    def get(request, lecture_id):
        if not Lecture.objects.filter(id=lecture_id).exists():
            return Response({
                "detail": "Not found."
            })

        lecture = Lecture.objects.get(id=lecture_id)
        lecture.stargazers.remove(request.user.usermodel)

        return Response({
            "starred": "false"
        })
