# Generated by Django 4.2 on 2023-05-18 20:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('places', '0002_review'),
    ]

    operations = [
        migrations.RenameField(
            model_name='review',
            old_name='comment',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='review',
            old_name='created_at',
            new_name='review_date',
        ),
        migrations.RenameField(
            model_name='review',
            old_name='user',
            new_name='reviewer',
        ),
        migrations.AlterField(
            model_name='review',
            name='place',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='places.place'),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.DecimalField(decimal_places=2, max_digits=3),
        ),
    ]
