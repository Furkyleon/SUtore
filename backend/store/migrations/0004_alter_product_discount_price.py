# Generated by Django 5.1.3 on 2024-12-07 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='discount_price',
            field=models.FloatField(default=0, null=models.FloatField()),
        ),
    ]
