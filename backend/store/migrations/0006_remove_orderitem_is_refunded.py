# Generated by Django 5.1.3 on 2025-01-11 19:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0005_orderitem_is_refunded'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orderitem',
            name='is_refunded',
        ),
    ]
