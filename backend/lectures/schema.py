from graphene_django import DjangoObjectType
import graphene
from .models import Lecture, Notes, Note


class NotesType(DjangoObjectType):
    class Meta:
        model = Notes


class NoteType(DjangoObjectType):
    class Meta:
        model = Note


class LectureType(DjangoObjectType):
    class Meta:
        model = Lecture

    allnotes = graphene.List(NoteType)

    def resolve_notes(self, info):
        return self.notes.all()


class Query(graphene.ObjectType):
    lecture = graphene.Field(LectureType, id=graphene.String(required=True))

    def resolve_lecture(self, info, id):
        return Lecture.objects.get(id=1)


schema = graphene.Schema(query=Query)
