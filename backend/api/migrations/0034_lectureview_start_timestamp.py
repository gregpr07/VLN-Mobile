# Generated by Django 3.1.2 on 2020-11-20 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_auto_20201120_0829'),
    ]

    operations = [
        migrations.AddField(
            model_name='lectureview',
            name='start_timestamp',
            field=models.IntegerField(default=0),
        ),
    ]