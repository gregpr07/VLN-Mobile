from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from api.models import Lecture, Author, Event


@registry.register_document
class LectureDocument(Document):
    author = fields.ObjectField(properties={
        'name': fields.TextField(),
        'views': fields.IntegerField(),
        'id': fields.IntegerField(),
    })

    event = fields.ObjectField(properties={
        'title': fields.TextField(),
        'description': fields.TextField(),
    })

    class Index:
        # Name of the Elasticsearch index
        name = 'lectures'
        # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 2,
                    'number_of_replicas': 1}

    class Django:
        model = Lecture  # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'title',
            'description',
            'views',
            'published',
            'video',
            'thumbnail',
            'audio',
            'id'
        ]
        # Optional: to ensure the Car will be re-saved when Manufacturer or Ad is updated
        related_models = [Author, Event]

        # Ignore auto updating of Elasticsearch when a model is saved
        # or deleted:
        # ignore_signals = True

        # Don't perform an index refresh after every update (overrides global setting):
        # auto_refresh = False

        # Paginate the django queryset used to populate the index with the specified size
        # (by default it uses the database driver's default setting)
        # queryset_pagination = 5000

    def get_queryset(self):
        """Not mandatory but to improve performance we can select related in one sql request"""
        return super(LectureDocument, self).get_queryset().select_related(
            'author'
        )

    def get_instances_from_related(self, related_instance):
        """If related_models is set, define how to retrieve the Car instance(s) from the related model.
        The related_models option should be used with caution because it can lead in the index
        to the updating of a lot of items.
        """
        if isinstance(related_instance, Author):
            return related_instance.lectures_author.all()
        elif isinstance(related_instance, Event):
            return related_instance.lectures.all()


@registry.register_document
class AuthorDocument(Document):

    class Index:
        # Name of the Elasticsearch index
        name = 'authors'
        # See Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Author  # The model associated with this Document

        # The fields of the model you want to be indexed in Elasticsearch
        fields = [
            'views',
            'id',
            'name',
        ]
