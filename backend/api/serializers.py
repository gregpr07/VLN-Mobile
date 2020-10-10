from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import UserModel, Lecture, Slide, Note, Author, Event, Playlist


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
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class LectureSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()

    def to_representation(self, instance):
        request = self.context['request']
        user = request.user

        serialized_data = super().to_representation(instance)

        if user.is_authenticated:
            serialized_data["starred"] = user.usermodel in instance.stargazers.all()

        return serialized_data

    class Meta:
        model = Lecture
        fields = '__all__'


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        serialized_data = super().to_representation(instance)
        serialized_data["categories"] = instance.get_categories()
        serialized_data["authors"] = instance.get_authors()

        return serialized_data

    class Meta:
        model = Event
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
