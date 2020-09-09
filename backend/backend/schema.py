import graphene
from users.schema import Query as user_query
from lectures.schema import Query as lecture_query


class Query(user_query, lecture_query):
    pass


schema = graphene.Schema(query=Query)
