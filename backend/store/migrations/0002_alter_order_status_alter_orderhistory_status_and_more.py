# Generated by Django 4.2.16 on 2024-12-03 14:23

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('Processing', 'Processing'), ('In-transit', 'In-transit'), ('Delivered', 'Delivered')], default='Processing', max_length=50),
        ),
        migrations.AlterField(
            model_name='orderhistory',
            name='status',
            field=models.CharField(choices=[('Processing', 'Processing'), ('In-transit', 'In-transit'), ('Delivered', 'Delivered')], max_length=50),
        ),
        migrations.AlterField(
            model_name='review',
            name='rating',
            field=models.IntegerField(choices=[(0, '0'), (1, '1'), (2, '2'), (3, '3'), (4, '4'), (5, '5')], validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(5)]),
        ),
    ]
