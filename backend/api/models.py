from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
from django.db import models


class Author(models.Model):
    user_model = models.ForeignKey(
        User, on_delete=models.SET_NULL, blank=True, null=True)

    name = models.CharField(max_length=100, null=True)
    # last_name = models.CharField(max_length=100, null=True)
    description = models.TextField(max_length=1000, blank=True, null=True)

    image = models.ImageField(null=True, blank=True, upload_to="image/author")

    views = models.IntegerField()

    def get_lectures(self):
        return Lecture.objects.filter(author=self).all()

    def get_categories(self):
        categories = set()

        for lecture in Lecture.objects.filter(author=self).all():
            for category in lecture.categories.all():
                if category not in categories:
                    categories.add(category)

        return categories

    def __str__(self):
        return f'{self.name}'


class Category(models.Model):
    name = models.CharField(max_length=150)
    parent = models.ForeignKey(
        'self', null=True, blank=True, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True,
                              upload_to="image/category")

    def get_children(self):
        return Category.objects.filter(parent=self).all()

    def get_authors(self):  # this works, but should be improved
        authors = set()

        for lecture in Lecture.objects.filter(categories=self):
            if lecture.author not in authors:
                authors.add(lecture.author)

        return authors

    def get_lectures(self):
        return Lecture.objects.filter(categories=self).all()

    class Meta:
        verbose_name_plural = "categories"

    def __str__(self):
        return self.name


class Event(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=2048)  # size!
    #image = models.ImageField(null=True, blank=True, upload_to="image/event")
    image = models.URLField(null=True, blank=True)
    date = models.DateTimeField(null=True, blank=True)
    caption = models.CharField(max_length=256, null=True, blank=True)

    lectures_order = ArrayField(models.IntegerField(), null=True, blank=True)

    def get_categories(self):  # this works, but should be improved
        category_id_set = set()

        for lecture in self.lectures.all():
            for category in lecture.categories.all():
                if category.id not in category_id_set:
                    category_id_set.add(category.id)

        return category_id_set

    def get_authors(self):  # this works, but should be improved
        author_id_set = set()

        for lecture in self.lectures.all():
            if lecture.author.id not in author_id_set:
                author_id_set.add(lecture.author.id)

        return author_id_set

    def __str__(self):
        return self.title


class Lecture(models.Model):
    title = models.CharField(max_length=500)

    description = models.TextField(max_length=5000, blank=True)

    views = models.IntegerField()  # ! to je treba narest da sam skalkulera nekak
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name='lectures_author')

    published = models.DateField()

    thumbnail = models.URLField(blank=True, null=True,)

    video = models.URLField()
    audio = models.URLField()

    categories = models.ManyToManyField(to=Category, blank=True)

    stargazers = models.ManyToManyField(to=User, blank=True)

    event = models.ForeignKey(
        Event, blank=True, null=True, related_name='lectures', on_delete=models.SET_NULL)

    def get_events(self):
        return Event.objects.filter(lectures=self)

    def __str__(self):
        return self.title


class Slide(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='slides')
    timestamp = models.IntegerField()
    image = models.URLField(null=True)
    title = models.CharField(max_length=200)

    class Meta:
        ordering = ['lecture', 'timestamp']

    def __str__(self):
        return str(self.lecture.title) + ' at ' + str(self.timestamp)


class Playlist(models.Model):
    title = models.CharField(max_length=100)

    views = models.IntegerField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='playlist_author')

    published = models.DateField()

    lectures = ArrayField(models.IntegerField(), null=True, blank=True)

    def __str__(self):
        return self.title


class Note(models.Model):
    lecture = models.ForeignKey(
        Lecture, on_delete=models.CASCADE, related_name='notes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    text = models.TextField(max_length=1000)  # ! rethink the size
    timestamp = models.IntegerField()

    class Meta:
        ordering = ['lecture', 'user', 'timestamp']

    def __str__(self):
        return str(self.user.username) + ' in ' + str(self.lecture.title) + ' at ' + str(self.timestamp)
