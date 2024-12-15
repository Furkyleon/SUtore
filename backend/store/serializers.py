# accounts/serializers.py
from rest_framework import serializers
from .models import *


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
    category = serializers.CharField(write_only=True)  # Accept category name as input
    category_name = serializers.StringRelatedField(source='category', read_only=True)  # Return category name in respons
    class Meta:
        model = Product
        fields = [
                    'id', 'name', 'image', 'model', 'category', 'category_name', 'description',
                    'price', 'discount', 'discount_price', 'stock', 'popularity',
                    'digital', 'serial_number', 'warranty_status', 'distributor_info'
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
        """Validate the category name and resolve it to a Category instance."""
        try:
            return Category.objects.get(name=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"Category '{value}' does not exist.")

    def create(self, validated_data):
        """Override create to handle category as a resolved object."""
        category = validated_data.pop('category')  # This will be the resolved Category instance
        product = Product.objects.create(category=category, **validated_data)
        return product

    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
        
class OrderItemSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'product', 'quantity', 'price', 'subtotal', 'date_added', 'discount_subtotal']
        
    def validate(self, data):
        if data['quantity'] > data['product'].stock:
            raise serializers.ValidationError("Ordered quantity exceeds available stock.")
        return data
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='order_items')  # Ensure source matches related_name in OrderItem model

    class Meta:
        model = Order
        fields = ['id', 'customer', 'date_ordered', 'complete', 'transaction_id', 'status', 'items']  # Ensure items is included here

class OrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHistory
        fields = ['id', 'customer', 'status', 'update_date', 'notes', 'total_amount', 'discount_total_amount']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'comment', 'comment_status', 'date_added']

class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'added_date']
        read_only_fields = ['user', 'added_date']
        
        
class InvoiceSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField()  # Show customer's username or string representation
    order = serializers.PrimaryKeyRelatedField(read_only=True)  # Reference the order by its ID

    class Meta:
        model = Invoice
        fields = [
            'id',
            'order',
            'customer',
            'total_amount',
            'discounted_total',
            'date'
        ]
        read_only_fields = ['id', 'date', 'total_amount', 'discounted_total']
        
        
class RefundRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for RefundRequest model.
    """

    # Make customer and order_item read-only fields
    customer = serializers.StringRelatedField(read_only=True)
    order_item = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = RefundRequest
        fields = [
            'id',
            'customer',
            'order_item',
            'request_date',
            'status',
            'reason',
        ]
        read_only_fields = ['id', 'customer', 'order_item', 'request_date']

    def validate(self, data):
        """
        Custom validation logic for refund requests.
        Ensures refunds are only requested within a 30-day window.
        """
        user = self.context.get("request").user  # Get the current user making the request
        order_item = data.get('order_item')

        if not order_item:
            raise serializers.ValidationError({"error": "Order item is required for refund requests."})

        # Check if the item can be refunded based on the purchase date
        if order_item.order.date_ordered and (timezone.now() - order_item.order.date_ordered > timedelta(days=30)):
            raise serializers.ValidationError({"error": "Refunds can only be requested within 30 days of purchase."})

        return data

class DeliverySerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='order_item.product.name', read_only=True)
    quantity = serializers.IntegerField(source='order_item.quantity', read_only=True)
    status = serializers.CharField(source='status', read_only=True)
    class Meta:
        model = Delivery
        fields = ['id', 'customer', 'product_name', 'quantity', 'delivery_address', 'status', 'total_price', 'created_at', 'updated_at']