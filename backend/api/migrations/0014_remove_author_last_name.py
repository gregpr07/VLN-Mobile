# Generated by Django 3.1.1 on 2020-10-03 08:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_auto_20201003_0827'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='author',
            name='last_name',
        ),
    ]
