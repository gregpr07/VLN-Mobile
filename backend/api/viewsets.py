from rest_framework import mixins, viewsets


class SimpleViewSet(mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    viewsets.GenericViewSet):
    pass
