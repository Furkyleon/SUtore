# Generated by Django 5.1.3 on 2024-12-21 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='delivery_address',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
