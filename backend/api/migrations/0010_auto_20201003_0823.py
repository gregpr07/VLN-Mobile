# Generated by Django 3.1.1 on 2020-10-03 08:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20201002_0751'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='last_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='author',
            name='name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='author',
            name='user_model',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.usermodel'),
        ),
    ]
