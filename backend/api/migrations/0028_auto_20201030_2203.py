# Generated by Django 3.1.2 on 2020-10-30 22:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0027_auto_20201030_2157'),
    ]

    operations = [
        migrations.AddField(
            model_name='slide',
            name='title',
            field=models.CharField(default='', max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='playlist',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]