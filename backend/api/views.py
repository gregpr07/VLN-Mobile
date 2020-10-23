from django.db.models import Count
from rest_framework import mixins, viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from api.models import Lecture, Note, Slide, Author, Event, Playlist, Category
from api.serializers import LectureSerializer, NoteSerializer, SlideSerializer, AuthorSerializer, \
    EventSerializer, PlaylistSerializer, CategorySerializer, SimpleAuthorSerializer, SimpleCategorySerializer, \
    SimpleLectureSerializer, SimpleEventSerializer


# Custom ViewSet
class SimpleViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):

    def get_serializer_class(self):
        if hasattr(self, 'action_serializers'):
            return self.action_serializers.get(self.action, self.serializer_class)

        return super(SimpleViewSet, self).get_serializer_class()

    pass


def list_mixin(obj, queryset, p_serializer):
    page = obj.paginate_queryset(queryset)
    if page is not None:
        serializer = p_serializer(page, many=True)
        return obj.get_paginated_response(serializer.data)

    serializer = p_serializer(queryset, many=True)
    return Response(serializer.data)


def simple_list_mixin(obj, queryset):
    return list_mixin(obj, queryset, obj.get_serializer)


class AuthorViewSet(SimpleViewSet):
    queryset = Author.objects.all()
    serializer_class = SimpleAuthorSerializer

    action_serializers = {
        'retrieve': AuthorSerializer,
        'list': SimpleAuthorSerializer,
    }

    @action(detail=True)
    def lectures(self, request, *args, **kwargs):
        queryset = self.get_object().get_lectures()
        return list_mixin(self, queryset, SimpleLectureSerializer)

    @action(detail=False)
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return simple_list_mixin(self, queryset)


class CategoryViewSet(SimpleViewSet):
    queryset = Category.objects.all()
    serializer_class = SimpleCategorySerializer

    @action(detail=True)
    def lectures(self, request, *args, **kwargs):
        queryset = self.get_object().get_lectures()
        return list_mixin(self, queryset, SimpleLectureSerializer)

    action_serializers = {
        'retrieve': CategorySerializer,
        'list': SimpleCategorySerializer,
    }


class LectureViewSet(SimpleViewSet):
    queryset = Lecture.objects.all()
    serializer_class = SimpleLectureSerializer

    action_serializers = {
        'retrieve': LectureSerializer,
        'list': SimpleLectureSerializer,
    }

    @action(detail=False)
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return simple_list_mixin(self, queryset)

    @action(detail=False)
    def most_starred(self, request, *args, **kwargs):
        queryset = self.queryset.annotate(count=Count("stargazers")).order_by("-count")
        return simple_list_mixin(self, queryset)

    @action(detail=False)
    def latest(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-published")
        return simple_list_mixin(self, queryset)


class SlideViewSet(SimpleViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def lecture(self, request, lecture_pk):
        queryset = Slide.objects.filter(lecture_id=lecture_pk)
        return simple_list_mixin(self, queryset)


class EventViewSet(SimpleViewSet):
    queryset = Event.objects.all()
    serializer_class = SimpleEventSerializer

    action_serializers = {
        'retrieve': EventSerializer,
        'list': SimpleEventSerializer,
    }


class PlaylistViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, ]
    queryset = Playlist.objects.all()
    serializer_class = PlaylistSerializer

    @action(detail=False)
    def most_viewed(self, request, *args, **kwargs):
        queryset = self.queryset.order_by("-views")
        return list_mixin(self, queryset)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied({
                "message": "You don't have the permission to delete this object.",
                "object_id": instance.id
            })

        super().perform_destroy(instance)


class NoteViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = NoteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    @action(detail=False, url_path='lecture/(?P<lecture_pk>[^/.]+)')
    def user(self, request, lecture_pk):
        queryset = Note.objects.filter(lecture_id=lecture_pk, user=request.user)

        return simple_list_mixin(self, queryset)


class StarredLecturesView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    @staticmethod
    def get(request):
        lectures = Lecture.objects.filter(stargazers=request.user)

        return Response({
            "lectures": SimpleLectureSerializer(lectures, many=True).data
        })


class StarredLecturesView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    @staticmethod
    def get(request):
        starred = Lecture.objects.filter(stargazers=request.user.usermodel).order_by("-views")
        return Response(SimpleLectureSerializer(starred, many=True).data)


class StarLectureView(APIView):
    permission_classes = [permissions.IsAuthenticated, ]

    @staticmethod
    def get(request, lecture_id):
        if not Lecture.objects.filter(id=lecture_id).exists():
            return Response({
                "detail": "Not found."
            })

        lecture = Lecture.objects.get(id=lecture_id)
        lecture.stargazers.add(request.user)

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
        lecture.stargazers.remove(request.user)

        return Response({
            "starred": "false"
        })
