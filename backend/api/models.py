from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.db import models


class UserModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f'{self.name + " " + self.last_name}\'s profile'


class Author(models.Model):
    user_model = models.OneToOneField(UserModel, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True, upload_to="image/author")

    views = models.IntegerField()

    def __str__(self):
        return f'{self.user_model.name + " " + self.user_model.last_name}\'s author'


class Category(models.Model):
    name = models.CharField(max_length=150)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True, upload_to="image/category")

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Lecture(models.Model):
    title = models.CharField(max_length=100)

    description = models.TextField(max_length=1000, blank=True)

    views = models.IntegerField()  # ! to je treba narest da sam skalkulera nekak
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name='lectures_author')

    published = models.DateField()

    thumbnail = models.URLField()

    video = models.URLField()
    audio = models.URLField()

    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.title


class Slide(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='slides')
    timestamp = models.IntegerField()
    image = models.URLField(null=True)

    class Meta:
        ordering = ['lecture', 'timestamp']

    def __str__(self):
        return str(self.lecture.title) + ' at ' + str(self.timestamp)


class Event(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1028)  # size!
    image = models.ImageField(null=True, blank=True, upload_to="image/event")

    # lecture order, manytomany
    lectures = ArrayField(models.IntegerField(), null=True, blank=True)

    # categories, authors, videos

    def __str__(self):
        return self.title


class Playlist(models.Model):
    title = models.CharField(max_length=100)

    views = models.IntegerField()
    user = models.ForeignKey(
        UserModel, on_delete=models.CASCADE, related_name='playlist_author')

    published = models.DateField()

    lectures = ArrayField(models.IntegerField(), null=True, blank=True)

    def __str__(self):
        return self.title


class Note(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='notes')
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)

    text = models.TextField(max_length=1000)  # ! rethink the size
    timestamp = models.IntegerField()

    class Meta:
        ordering = ['lecture', 'user', 'timestamp']

    def __str__(self):
        return str(self.user.user.username) + ' in ' + str(self.lecture.title) + ' at ' + str(self.timestamp)
