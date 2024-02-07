# Generated by Django 5.0.1 on 2024-01-29 15:45

import users.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='profilePicture',
            field=models.ImageField(blank=True, default='pokemon.png', upload_to=users.models.generateUniqueImageID),
        ),
    ]
