from graphene_django import DjangoObjectType
import graphene
from .models import Lecture, Notes, Note


class NotesQL(DjangoObjectType):
    class Meta:
        model = Notes


class NoteQL(DjangoObjectType):
    class Meta:
        model = Note


class LectureQL(DjangoObjectType):
    class Meta:
        model = Lecture


class Query(graphene.ObjectType):
    lectures = graphene.List(LectureQL)
    notes = graphene.List(NotesQL)

    def resolve_lectures(self, info):
        return Lecture.objects.all()

    def resolve_notes(self, info):
        Notes.objects.filter(lecture__id=graphene.String(required=True))


schema = graphene.Schema(query=Query)
