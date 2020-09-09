from graphene_django import DjangoObjectType
import graphene
from .models import UserModel


class User(DjangoObjectType):
    class Meta:
        model = UserModel


class Query(graphene.ObjectType):
    users = graphene.List(User)

    def resolve_users(self, info, id=graphene.Int(required=False)):
        return UserModel.objects.get(id=id)


schema = graphene.Schema(query=Query)
