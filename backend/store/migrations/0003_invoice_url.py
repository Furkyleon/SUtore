# Generated by Django 5.1.4 on 2024-12-22 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_alter_delivery_delivery_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice',
            name='url',
            field=models.URLField(blank=True, max_length=255, null=True),
        ),
    ]
