# Generated by Django 3.1.2 on 2020-10-17 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_auto_20201017_1158'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='thumbnail',
            field=models.URLField(blank=True, null=True),
        ),
    ]
