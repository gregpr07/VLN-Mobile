from django.contrib.auth.models import User
from django.db import models

# todo: where user left off


class UserModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f'{self.name + " " + self.last_name}\'s profile'


class Author(models.Model):
    user_model = models.OneToOneField(UserModel, on_delete=models.CASCADE)

    views = models.IntegerField()


class Lecture(models.Model):
    title = models.CharField(max_length=100)

    views = models.IntegerField()  # ! to je treba narest da sam skalkulera nekak
    author = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='lectures_author')

    published = models.DateField()

    video = models.URLField()
    audio = models.URLField()

    def __str__(self):
        return self.title


class Slide(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='slides')
    timestamp = models.IntegerField()
    image = models.URLField(null=True)

    # for each lecture each user can have multiple notes


class Event(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1028)  # size!

    # TODO: array of lectures


class Playlist(models.Model):
    title = models.CharField(max_length=100)

    views = models.IntegerField()
    author = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='playlist_author')

    published = models.DateField()

    # TODO: array of lectures


class Notes(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='notes')
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.name}\'s notes of {self.lecture.title}'

# each note has multiple notes


class Note(models.Model):
    text = models.TextField(max_length=1000)  # ! rethink the size
    timestamp = models.IntegerField()
    parent_notes = models.ForeignKey(
        Notes, on_delete=models.CASCADE, related_name='notes')
