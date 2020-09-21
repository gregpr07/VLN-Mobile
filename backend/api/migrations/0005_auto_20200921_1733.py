# Generated by Django 3.1.1 on 2020-09-21 15:33

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_playlist_lectures'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='lectures',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lectures_author', to='api.author'),
        ),
    ]
