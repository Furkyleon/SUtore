# accounts/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '_all_'  # Alternatively, specify fields as a list, e.g., ['productID', 'name', 'price']