# Generated by Django 4.2 on 2023-05-22 06:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField()),
                ('latitude', models.DecimalField(decimal_places=16, max_digits=20)),
                ('longitude', models.DecimalField(decimal_places=16, max_digits=20)),
                ('location', models.CharField(default='Nepal', max_length=500)),
                ('offering', models.JSONField(blank=True, null=True)),
                ('metalatitude', models.CharField(max_length=50)),
                ('metalongitude', models.CharField(max_length=50)),
                ('c_review', models.CharField(max_length=500, null=True)),
                ('slug', models.SlugField(blank=True, unique=True)),
                ('is_verified', models.BooleanField(default=False)),
                ('rating', models.DecimalField(decimal_places=2, max_digits=3)),
                ('email', models.EmailField(max_length=255, null=True)),
                ('contributor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.DecimalField(decimal_places=2, max_digits=3)),
                ('description', models.TextField()),
                ('review_date', models.DateTimeField(auto_now_add=True)),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='places.place')),
                ('reviewer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PlaceImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(null=True, upload_to='place_images/')),
                ('place', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='places.place')),
            ],
        ),
    ]
