# Generated by Django 5.1.2 on 2024-11-02 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0003_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='category',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
