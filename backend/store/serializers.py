# accounts/serializers.py
from rest_framework import serializers
from .models import *

"""
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '_all_'  # Alternatively, specify fields as a list, e.g., ['productID', 'name', 'price']
"""      
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',  # Optionally include the ID
            'username',
            'email',
            'first_name',
            'last_name',
            'address',
            'tax_id',
            'role',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',            
            'name',
            'price',
            'digital',
            'discount',
            'stock',
            'popularity',
            'model',
            'serial_number',
            'warranty_status',
            'distributor_info',
            'category',
            'discount_price',
            'description',
            'image',
        ]
        
    def validate_price(self, value):
        """Check that the price is not negative."""
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")
        return value

    def validate_stock(self, value):
        """Check that the stock quantity is not negative."""
        if value < 0:
            raise serializers.ValidationError("Stock quantity cannot be negative.")
        return value
    
    def validate_serial_number(self, value):
        """Ensure that the serial number is unique."""
        if Product.objects.filter(serial_number=value).exists():
            raise serializers.ValidationError("Serial number must be unique.")
        return value
    
    def validate_category(self, value):
        """Ensure that the category exists in the database."""
        if not Category.objects.filter(name=value).exists():
            raise serializers.ValidationError("Category does not exist.")
        return value

    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
        
class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price', 'subtotal', 'date_added']
        
    def validate(self, data):
        if data['quantity'] > data['product'].stock:
            raise serializers.ValidationError("Ordered quantity exceeds available stock.")
        return data
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='order_items')  # Ensure `source` matches related_name in OrderItem model

    class Meta:
        model = Order
        fields = ['id', 'customer', 'date_ordered', 'complete', 'transaction_id', 'status', 'items']  # Ensure `items` is included here

class OrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHistory
        fields = ['id', 'customer', 'status', 'update_date', 'notes', 'total_amount']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'comment_status', 'date_added']

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'added_date']
        read_only_fields = ['user', 'added_date']