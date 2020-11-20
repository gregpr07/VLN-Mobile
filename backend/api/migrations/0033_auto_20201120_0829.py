# Generated by Django 3.1.2 on 2020-11-20 07:29

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_lectureview_left_timestamp'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lectureview',
            options={'ordering': ['-visited']},
        ),
        migrations.AddField(
            model_name='lectureview',
            name='visited',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='lectureview',
            unique_together=set(),
        ),
    ]
