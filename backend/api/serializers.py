from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Lecture, Slide, Note, Author, Event, Playlist, Category


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        None,
                                        validated_data['password'])
        return user


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(
            "Unable to log in with provided credentials.")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name')


class AuthorSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        serialized_data = super().to_representation(instance)
        serialized_data["categories"] = SimpleCategorySerializer(
            instance.get_categories(), many=True).data
        # serialized_data["lectures"] = SimpleLectureSerializer(instance.get_lectures(), many=True,
        #                                                       context={'request': self.context['request']}).data

        return serialized_data

    class Meta:
        model = Author
        fields = ('id', 'name', 'description', 'image', 'views')


class SimpleAuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'image')


class CategorySerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        serialized_data = super().to_representation(instance)
        serialized_data["children"] = SimpleCategorySerializer(
            instance.get_children(), many=True, read_only=True).data
        serialized_data["authors"] = SimpleAuthorSerializer(instance.get_authors(), many=True,
                                                            context={'request': self.context['request']}).data
        # serialized_data["lectures"] = SimpleLectureSerializer(instance.get_lectures(), many=True,
        #                                                       context={'request': self.context['request']}).data

        return serialized_data

    class Meta:
        model = Category
        fields = '__all__'


class SimpleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name')


class EventSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        serialized_data = super().to_representation(instance)
        serialized_data["lectures"] = SimpleLectureSerializer(instance.get_lectures(), many=True).data

        categories = []
        for category in instance.get_categories():
            categories.append(SimpleCategorySerializer(Category.objects.get(id=category)).data)
        serialized_data["categories"] = categories

        authors = []
        for author in instance.get_authors():
            authors.append(SimpleAuthorSerializer(Author.objects.get(id=author)).data)
        serialized_data["authors"] = authors

        return serialized_data

    class Meta:
        model = Event
        fields = '__all__'


class SimpleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'image', 'caption')
        
class CaptionEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id','caption')


class LectureSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer()
    event = SimpleEventSerializer()
    categories = SimpleCategorySerializer(many=True, read_only=True)

    def to_representation(self, instance):
        request = self.context['request']
        user = request.user

        serialized_data = super().to_representation(instance)
        serialized_data["published"] = instance.published.strftime("%b %d, %Y")
        serialized_data["stargazer_count"] = instance.stargazers.all().count()

        if user.is_authenticated:
            serialized_data["starred"] = user in instance.stargazers.all()

        return serialized_data

    class Meta:
        model = Lecture
        fields = ('id', 'author', 'title', 'description', 'views', 'published', 'thumbnail',
                  'video', 'audio', 'categories', 'event')


class SimpleLectureSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer()
    event = CaptionEventSerializer()

    class Meta:
        model = Lecture
        fields = ('id', 'title', 'thumbnail', 'author', 'views','event')


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['lecture', 'text', 'timestamp']
