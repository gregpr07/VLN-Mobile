from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save


class UserModel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True)
    last_name = models.CharField(max_length=100, null=True)

    def __str__(self):
        return f'{self.name}\'s profile'
