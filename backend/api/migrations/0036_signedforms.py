# Generated by Django 3.1.5 on 2021-07-27 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_auto_20201120_0853'),
    ]

    operations = [
        migrations.CreateModel(
            name='SignedForm',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=500)),
                ('institution', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=100)),
                ('roomNumber', models.CharField(max_length=50)),
                ('date', models.DateField()),
                ('cc_license', models.BooleanField(default=True)),
                ('signature', models.ImageField(upload_to='')),
            ],
        ),
    ]
