# Generated by Django 5.1.3 on 2025-01-11 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_remove_orderitem_is_refunded'),
    ]

    operations = [
        migrations.AddField(
            model_name='refundrequest',
            name='refund_amount',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
