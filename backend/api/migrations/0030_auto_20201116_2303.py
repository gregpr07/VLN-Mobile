# Generated by Django 3.1.2 on 2020-11-16 22:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_auto_20201031_0917'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='event',
            options={'ordering': ['-date', 'caption']},
        ),
    ]
