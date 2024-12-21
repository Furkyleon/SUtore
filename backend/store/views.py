from django.shortcuts import render
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
#from .models import Product
from .serializers import *
from django.core.mail import send_mail
from django.conf import settings
#from django.utils.encoding import force_bytes, force_text
from django.contrib.auth.tokens import default_token_generator as token_generator
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from decimal import Decimal
from io import BytesIO
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import pdfkit
from .models import CustomUser
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q,Avg
from django.db import transaction
from django.utils.dateparse import parse_datetime
from datetime import datetime, timedelta
from django.utils.timezone import now
import base64
from django.http import JsonResponse
from matplotlib.ticker import MaxNLocator  # For adjusting x-ticks
import os
from matplotlib.ticker import MaxNLocator  # For adjusting x-ticks
import matplotlib.pyplot as plt

# bu alttakilere bakılacak
# @login_required
# @permission_required('accounts.add_product', raise_exception=True)
def store(request):
     context = {}
     return render(request, 'store.html', context)

from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
@csrf_exempt  # Exempt from CSRF verification
@api_view(['POST'])
def register(request):
    # Extract required fields from the request data
    username = request.data.get('username')
    email = request.data.get('email')
    address = request.data.get('address')
    password = request.data.get('password')
    tax_id = request.data.get('tax_id')  # New field
    role = request.data.get('role', 'customer')  # Default role is "customer"

    # Validate required fields
    if not username or not email or not password:
        return Response({'error': 'Username, email, and password are required.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Check if the username or email already exists
    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if CustomUser.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Hash the password before storing it
    hashed_password = make_password(password)

    # Create the new CustomUser instance
    user = CustomUser.objects.create(
        username=username,
        email=email,
        password=hashed_password,
        address=address,
        tax_id=tax_id,  # Include tax ID
        role=role  # Include role
    )

    # Optionally, generate a token for the user here if using token authentication
    # from rest_framework.authtoken.models import Token
    # token, created = Token.objects.get_or_create(user=user)

    # Send the user data in response
    return Response({
        # 'token': token.key,  # Uncomment if using tokens
        'user': {
            'username': user.username,
            'email': user.email,
            'address': user.address,
            'tax_id': user.tax_id,
            'role': user.role
        }
    }, status=status.HTTP_201_CREATED)




@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Validate input
    if not username or not password:
        return Response({'error': 'Username and password are required.'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    # Retrieve the user by username
    try:
        user = CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid username or password.'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

    # Check if the provided password matches the stored hashed password
    if not check_password(password, user.password):
        return Response({'error': 'Invalid username or password.'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

    # Optionally, generate a token for the authenticated user
    # from rest_framework.authtoken.models import Token
    # token, created = Token.objects.get_or_create(user=user)

    return Response({
        # 'token': token.key,  # Uncomment if using tokens
        'user': {
            'username': user.username,
            'email': user.email,
            'address': user.address,
            'tax_id': user.tax_id,
            'role': user.role
        }
    }, status=status.HTTP_200_OK)
 
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Require user authentication
def add_product(request):
    """API for product managers to add a product."""
    if request.user.role != 'product_manager':
        return Response(
            {"error": "Only product managers can add new products."},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        product = serializer.save()
        product.discount_price = product.price * (1 - product.discount / 100)
        product.save()

        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, product_id):
    """API for product managers to remove a product."""
    if request.user.role != 'product_manager':
        return Response({"error": "Only product managers can remove products."}, status=status.HTTP_403_FORBIDDEN)
    try:
        # Retrieve the product by serial_number
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Delete the product
    product.delete()

    # Return a success response
    return Response({'message': 'Product deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_all_products(request):
    # Query all products from the database
    products = Product.objects.all()
    
    # Serialize the products data
    serializer = ProductSerializer(products, many=True)
    
    # Return the serialized data in the response
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_category(request):
    """API for product managers to add a new product category."""
    if request.user.role != 'product_manager':
        return Response({"error": "Only product managers can add categories."}, status=status.HTTP_403_FORBIDDEN)
    serializer = CategorySerializer(data=request.data) 
    if serializer.is_valid():
        category = serializer.save()
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_category(request, category_name):
    """API for product managers to delete a product category."""
    if request.user.role != 'product_manager':
        return Response({"error": "Only product managers can delete categories."}, status=status.HTTP_403_FORBIDDEN)

    try:
        category = Category.objects.get(name=category_name)
        category.delete()
        return Response({"message": f"Category '{category_name}' deleted successfully."}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_categories(request):
    """Retrieve all categories."""
    categories = Category.objects.all()  # Get all categories
    serializer = CategorySerializer(categories, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_category(request, category_name):
    """Retrieve products by category name."""
    # Check if the category exists in the Category model
    if not Category.objects.filter(name=category_name).exists():
        return Response({'error': 'Category does not exist.'}, status=status.HTTP_404_NOT_FOUND)

    # Filter products by category
    products = Product.objects.filter(category=category_name)

    if not products.exists():
        # Return error if no products found in the category
        return Response({'error': 'No products found in this category.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    
    # Return serialized data
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_products_sorted_by_price_asc(request):
    """Retrieve products sorted by price in ascending order."""
    products = Product.objects.all().order_by('price')  # Order by price ascending

    if not products.exists():
        return Response({'error': 'No products found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_sorted_by_price_desc(request):
    """Retrieve products sorted by price in descending order."""
    products = Product.objects.all().order_by('-price')  # Order by price descending

    if not products.exists():
        return Response({'error': 'No products found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_category_sorted_by_price_asc(request, category_name):
    """Retrieve products by category name sorted by price in ascending order."""
    products = Product.objects.filter(category=category_name).order_by('price')  # Filter and order

    if not products.exists():
        return Response({'error': 'No products found for this category.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_category_sorted_by_price_desc(request, category_name):
    """Retrieve products by category name sorted by price in descending order."""
    products = Product.objects.filter(category=category_name).order_by('-price')  # Filter and order

    if not products.exists():
        return Response({'error': 'No products found for this category.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_price_interval(request):
    """Retrieve products within a specified price interval."""
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')

    # Validate input
    if min_price is None or max_price is None:
        return Response({'error': 'Both min_price and max_price parameters are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        min_price = float(min_price)
        max_price = float(max_price)
    except ValueError:
        return Response({'error': 'Both min_price and max_price must be valid numbers.'}, status=status.HTTP_400_BAD_REQUEST)

    # Filter products by price interval
    products = Product.objects.filter(price_gte=min_price, price_lte=max_price)

    if not products.exists():
        return Response({'error': 'No products found in this price range.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_sorted_by_popularity_asc(request):
    """Retrieve products sorted by price in ascending order."""
    products = Product.objects.all().order_by('popularity')  # Order by price ascending

    if not products.exists():
        return Response({'error': 'No products found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_category_sorted_by_popularity_asc(request, category_name):
    """Retrieve products by category name sorted by price in descending order."""
    products = Product.objects.filter(category=category_name).order_by('popularity')  # Filter and order

    if not products.exists():
        return Response({'error': 'No products found for this category.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_sorted_by_popularity_desc(request):
    """Retrieve products sorted by price in ascending order."""
    products = Product.objects.all().order_by('-popularity')  # Order by price ascending

    if not products.exists():
        return Response({'error': 'No products found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def get_products_by_category_sorted_by_popularity_desc(request, category_name):
    """Retrieve products by category name sorted by price in descending order."""
    products = Product.objects.filter(category=category_name).order_by('-popularity')  # Filter and order

    if not products.exists():
        return Response({'error': 'No products found for this category.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['GET'])
def search_products(request):
    search_term = request.data.get('search', '')  # Search term (name or description)
    category_id = request.data.get('category', None)  # Category ID to filter by

    if not search_term:
        return Response({"error": "Search term is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Start with the base query: filtering by name or description containing the search term
    products = Product.objects.filter(
        Q(nameicontains=search_term) | Q(descriptionicontains=search_term)
    )

    # If category is provided, filter by the category as well
    if category_id:
        # Validate if the category exists
        try:
            products = products.filter(category=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)

    # Serialize the filtered products
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_products_by_name(request):
    """Retrieve products by their name."""
    search_query = request.query_params.get('name')
    
    # Validate input
    if not search_query:
        return Response({'error': 'The "name" parameter is required.'}, status=status.HTTP_400_BAD_REQUEST)

    # Filter products by name (case-insensitive search)
    products = Product.objects.filter(name__icontains=search_query)
    
    if not products.exists():
        return Response({'error': 'No products found with this name.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


@api_view(['POST'])
def add_to_cart(request):
    # Extract data from the request
    serial_number = request.data.get('serial_number')
    quantity = request.data.get('quantity')
    order_id = request.data.get('order_id')  # Optional for unauthenticated users

    if not serial_number or not quantity:
        return Response({"error": "Serial number and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        quantity = int(quantity)
    except ValueError:
        return Response({"error": "Quantity must be a valid integer."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate that the product exists
    product = get_object_or_404(Product, serial_number=serial_number)
    price = product.price
    discount_price = product.discount_price

    # Stock check
    if product.stock < quantity :
        return Response({"error": f"Only {product.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)


    if request.user.is_authenticated:
        # Handle authenticated users
        order, created = Order.objects.get_or_create(
            customer=request.user,
            complete=False  # Ensure it's an active cart
        )
    else:
                # Handle unauthenticated users
        if order_id:
            try:
                # Try to fetch the existing order
                order = Order.objects.get(id=order_id, complete=False)
            except Order.DoesNotExist:
                return Response({"error": "Invalid order ID or order is already complete."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Create a new order for unauthenticated users
            order = Order.objects.create(complete=False)


    # Create or update the OrderItem
    order_item, created = OrderItem.objects.get_or_create(
        order=order,
        product=product,
        defaults={'quantity': quantity, 'price': price}
    )

    if not created:  # Update quantity and subtotal if item already exists
        if order_item.quantity + quantity > product.stock:
            return Response({"error": f"Only {product.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)
        
        if order_item.quantity + quantity ==0:
            order_item.delete()
            return Response({"error": f"Order_item deleted."}, status=status.HTTP_400_BAD_REQUEST)
        
        
        order_item.quantity += quantity
        order_item.subtotal = price * order_item.quantity
        order_item.discount_subtotal = discount_price * order_item.quantity
        order_item.save()
    else:
        # Set subtotal for a new item
        order_item.subtotal = price * order_item.quantity
        order_item.discount_subtotal = discount_price * order_item.quantity
        order_item.save()

    # Optionally return the order ID and order item details
    serializer = OrderItemSerializer(order_item)
    return Response({"order_id": order.id, "order_item": serializer.data}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def update_cart_item(request):
    """
    Updates the quantity of a cart item or deletes it if the quantity becomes zero.
    Ensures stock always remains 0 or a positive number.
    """
    try:
        # Extract data from the request
        item_id = request.data.get('item_id')
        quantity_change = request.data.get('quantity_change')

        # Validate the input
        if not item_id or quantity_change is None:
            return Response({"error": "Item ID and quantity change are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Find the OrderItem
        try:
            order_item = OrderItem.objects.get(id=item_id)
        except OrderItem.DoesNotExist:
            return Response({"error": "Order item not found."}, status=status.HTTP_404_NOT_FOUND)

        # Calculate the new quantity
        new_quantity = order_item.quantity + int(quantity_change)

        # Validate the stock of the product
        product = order_item.product
        if new_quantity > product.stock:
            return Response({"error": f"Only {product.stock} items are available in stock."}, status=status.HTTP_400_BAD_REQUEST)

        # If the quantity becomes zero or less, delete the item
        if new_quantity <= 0:
            order_item.delete()
            return Response({"message": "Item removed from cart."}, status=status.HTTP_200_OK)

        # Update the quantity and subtotal
        order_item.quantity = new_quantity
        order_item.subtotal = new_quantity * product.price
        order_item.discount_subtotal = new_quantity * product.discount_price
        order_item.save()

        # Return the updated order item
        return Response({
            "id": order_item.id,
            "quantity": order_item.quantity,
            "subtotal": order_item.subtotal,
            "discount_subtotal": order_item.discount_subtotal,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def delete_cart_item(request):
    """
    Deletes a specific item from the cart.
    """
    try:
        # Extract item_id from the request
        item_id = request.data.get('item_id')

        # Validate input
        if not item_id:
            return Response({"error": "Item ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Find and delete the OrderItem
        try:
            order_item = OrderItem.objects.get(id=item_id)
            order_item.delete()
            return Response({"message": "Item successfully removed from cart."}, status=status.HTTP_200_OK)
        except OrderItem.DoesNotExist:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def assign_user_to_order(request):
    order_id = request.data.get('order_id')  # Order ID to be updated
     # User ID to associate with the order

    if not order_id:
        return Response({"error": "order_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate order existence
    try:
        order = Order.objects.get(id=order_id, complete=False)  # Ensure it's an active order
    except Order.DoesNotExist:
        return Response({"error": "Order does not exist or is already complete."}, status=status.HTTP_400_BAD_REQUEST)
    
    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    # Associate the user with the order
    order.customer = request.user
    order.save()

    return Response({
        "message": "User successfully assigned to the order.",
        "order_id": order.id,
        "user_username": request.user.username
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_order_items(request, order_id):
    if not request.user.is_authenticated:
        try:
           
            order = Order.objects.get(id=order_id)
            order_items = order.order_items.all()
            serializer = OrderItemSerializer(order_items, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"error": "No active order found."}, status=status.HTTP_404_NOT_FOUND)

    # Retrieve the active order for the customer
    try:
        order = Order.objects.get(customer=request.user)
        order_items = order.order_items.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({"error": "No active order found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_subtotal(request):
    """
    API to calculate and return the subtotal of all products in an active order's order items,
    using Product's get_subtotal method.
    """
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication credentials were not provided."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        # Retrieve the active order for the logged-in customer
        order = Order.objects.get(customer=request.user, complete=False)
        
        # Calculate subtotals for all order items using Product's get_subtotal method
        order_items = order.order_items.all()
        subtotals = []
        total_subtotal = 0.0

        for item in order_items:
            if item.product is not None:
                subtotal = (item.product.price * (1 - (item.product.discount/100)) * item.quantity)
                subtotals.append({
                    "product_name": item.product.name,
                    "quantity": item.quantity,
                    "price_per_item": item.product.price,
                    "subtotal": subtotal
                })
                total_subtotal += subtotal

        return Response(
            {"order_subtotal": total_subtotal, "details": subtotals},
            status=status.HTTP_200_OK
        )
    except Order.DoesNotExist:
        return Response(
            {"error": "No active order found."},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def get_order(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the active order for the customer
    try:
        order = Order.objects.get(customer=request.user, complete=False)
        
        serializer = OrderSerializer(order)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({"error": "No active order found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def order_history(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        # Retrieve order history for the user
        order_history = OrderHistory.objects.get(customer=request.user)
        orders = order_history.orders.filter(complete=True)

        # Structure each order to show only item IDs within the order
        data = []
        for order in orders:
            order_data = {
                "order_id": order.id,
                "customer": order.customer.id,
                "date_ordered": order.date_ordered,
                "complete": order.complete,
                "transaction_id": order.transaction_id,
                "status": order.status,
                "items": [{
                        "id": item.product.id,
                        "product": item.product.name,
                        "quantity": item.quantity,
                        "price": str(item.price),
                        "subtotal": str(item.subtotal),
                        "date_added": item.date_added
                    }
                    for item in order.order_items.all()
                ]
            }
            data.append(order_data)

        return Response(data, status=status.HTTP_200_OK)
    except OrderHistory.DoesNotExist:
        return Response({"error": "No order history found."}, status=status.HTTP_404_NOT_FOUND)

 

@api_view(['POST'])
def checkout(request):
    order_id = request.data.get('order_id')

    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    if not order_id:
        return Response({"error": "No order_id provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Find the active order for the user by ID
        order = Order.objects.get(id=order_id, customer=request.user)
    except Order.DoesNotExist:
        return Response({"error": "Processing order not found."}, status=status.HTTP_404_NOT_FOUND)

    if order.complete:
        return Response({"error": "Order already checkouted."}, status=status.HTTP_404_NOT_FOUND)
    
    # Mark the order as complete
    order.complete = True
    order.status = 'Processing'
    order.date_ordered = datetime.now()
    order.save()

    # Increase the popularity of products in the order
    order_items = order.order_items.all()  # Get all OrderItems related to the Order
    for order_item in order_items:
        product = order_item.product
        product.popularity = F('popularity') + order_item.quantity  # Use F expressions to avoid race conditions
        product.save()

    # Calculate the total amount for the order
    total_amount = 0.0
    discount_total_amount = 0.0
    for item in order.order_items.all():
        total_amount += float(item.subtotal)
        discount_total_amount += float(item.discount_subtotal)
        # Decrease product stock based on quantity in the order
        product = item.product
        product.stock -= item.quantity
        product.save()

    # Create an invoice
    invoice = Invoice.objects.create(
        order=order,
        customer=request.user,
        total_amount=total_amount,
        discounted_total=discount_total_amount
    )

    # Add it to the order history (if not already added)
    order_history, created = OrderHistory.objects.get_or_create(customer=request.user)
    order_history.orders.add(order)
    order_history.update_date = datetime.now()
    order_history.total_amount = Decimal(order_history.total_amount) + Decimal(total_amount)
    order_history.discount_total_amount = Decimal(order_history.discount_total_amount) + Decimal(discount_total_amount)
    order_history.save()

    # Create delivery entries for each order item
    for item in order_items:
        Delivery.objects.create(
            order_item=item,
            customer=request.user,
            delivery_address=request.user.address,
            total_price=item.discount_subtotal
        )

    # Step 1: Render the email body template (order confirmation)
    html_message = render_to_string('order_confirmation.html', {'order': order})
    plain_text_content = strip_tags(html_message)  # Generate plain text from HTML
    
    # Send the email
    email = EmailMessage(
        subject=f"Invoice for Order #{order.id}",
        body=plain_text_content,  # Plain text version of the email
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[order.customer.email],
    )
    
    # Attach the HTML message for email clients that support HTML
    email.content_subtype = "html"
    email.body = html_message
    
    # Step 2: Render the invoice template for the PDF
    invoice_html_content = render_to_string('invoice_template.html', {'order': order})
    
    # Path to save the generated PDF (you can adjust this path as needed)
    pdf_file_path = f'invoice_order_{order.id}.pdf'

    # Generate the PDF and save it to the file
    pdfkit.from_string(invoice_html_content, pdf_file_path)

    # Open the generated PDF file and convert it to base64
    with open(pdf_file_path, 'rb') as f:
        pdf_data = f.read()
        pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')  # Base64 encode and convert to string

    # Send the email with the PDF attached (optional)
    try:
        email.attach(f'Invoice_Order_{order.id}.pdf', pdf_data, 'application/pdf')
        email.send()

        # Return a JSON response with the base64 encoded PDF
        return JsonResponse({
            "message": "Order completed successfully, and invoice has been sent.",
            "invoice_pdf": pdf_base64  # Base64 encoded PDF in the response
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    product = Product.objects.get(id=product_id)
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    # Check if the user has purchased this product in a completed order
    purchased_items = OrderItem.objects.filter(order__customer=request.user, order__complete=True, product=product)
    if not purchased_items.exists():
        return Response({"error": "You can only review products you've purchased."}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if the user has already reviewed this product
    existing_review = Review.objects.filter(user=request.user, product=product).first()
    if existing_review:
        return Response({"error": "You can only leave one review per product."}, status=status.HTTP_400_BAD_REQUEST)

    if comment == "":
        review = Review.objects.create(user=request.user, product=product, rating=rating, comment=comment,comment_status="Approved")
    # Save the review
    else:
        review = Review.objects.create(user=request.user, product=product, rating=rating, comment=comment)
    
    serializer = ReviewSerializer(review)
   
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_reviews_by_product(request, product_id):
    # Check if the product exists
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Filter reviews by product
    reviews = Review.objects.filter(product=product, comment_status= "Approved")
    
    # Serialize the reviews
    serializer = ReviewSerializer(reviews, many=True)

    # Add username to each review in the response data
    response_data = []
    for review in serializer.data:
        user = CustomUser.objects.get(id=review['user'])  # Get the user instance by ID
        review['username'] = user.username  # Add the username to the serialized data
        response_data.append(review)
    
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_rating_by_product(request, product_id):
    # Check if the product exists
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Filter reviews for the product
    all_reviews = Review.objects.filter(product=product)

    # Log all reviews and their ratings for debugging
    print("All Reviews:", all_reviews)
    ratings = [review.rating for review in all_reviews]
    print("Ratings (All Reviews):", ratings)

    # Calculate the average rating from approved reviews
    average_rating = all_reviews.aggregate(average=Avg('rating'))['average']
    average_rating = average_rating if average_rating is not None else 0  # Handle no approved reviews case

    # Include the average rating and reviews in the response
    response_data = {
        "average_rating": average_rating
    }
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
def update_review_comment_status(request, review_id, new_status):
    """
    Update the comment status of a specific review to either 'Approved' or 'Rejected'.
    """
    
    if new_status not in ['Approved', 'Rejected']:
        return Response({"error": "Invalid status. Valid options are 'Approved' or 'Rejected'."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if the review exists
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return Response({"error": "Review not found."}, status=status.HTTP_404_NOT_FOUND)
    
    # Update the comment status
    review.comment_status = new_status
    review.save()

    return Response({"message": f"Comment status updated to {new_status} successfully."}, status=status.HTTP_200_OK)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    #Retrieve the current user's wishlist.
    wishlist_items = Wishlist.objects.filter(user=request.user)
    if not wishlist_items.exists():
        return Response({'message': 'Your wishlist is empty.'}, status=status.HTTP_200_OK)

    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    #Add a product to the user's wishlist.
    product_id = request.data.get('product_id')  # Extract product_id from JSON body

    if not product_id:
        return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        product = Product.objects.get(id=product_id)
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)

        if created:
            return Response({'message': 'Product added to wishlist.'}, status=status.HTTP_201_CREATED)
        return Response({'message': 'Product is already in wishlist.'}, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request):
    #Remove a product from the user's wishlist.
    product_id = request.data.get('product_id')  # Extract product_id from the request body

    if not product_id:
        return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        wishlist_item = Wishlist.objects.get(user=request.user, product_id=product_id)
        wishlist_item.delete()
        return Response({'message': 'Product removed from wishlist.'}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Product not found in your wishlist.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    
    notifications = Notification.objects.filter(user=request.user, is_read=False)
    response_data = [
        {
            'id': notification.id,
            'message': notification.message,
            'created_at': notification.created_at,
            'is_read': notification.is_read,
        }
        for notification in notifications
    ]
    return Response(response_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_as_read(request):
    
    notification_ids = request.data.get('notification_ids', [])
    if not notification_ids:
        return Response({'error': 'No notification IDs provided'}, status=400)

    Notification.objects.filter(id__in=notification_ids, user=request.user).update(is_read=True)
    return Response({'message': 'Notifications marked as read.'})


@api_view(['POST'])
def apply_discount(request):
    user = request.user

    # Ensure the user is a Sales Manager
    if not isinstance(user, CustomUser) or user.role != 'sales_manager':
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Validate the request payload
    serial_number = request.data.get('serial_number')
    discount_percentage = request.data.get('discount_percentage')

    if not serial_number or discount_percentage is None:
        return Response(
            {"error": "Both 'serial_number' and 'discount_percentage' are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        discount_percentage = float(discount_percentage)
        if discount_percentage < 0 or discount_percentage > 100:
            return Response(
                {"error": "Discount percentage must be between 0 and 100."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except ValueError:
        return Response(
            {"error": "Discount percentage must be a valid number."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Fetch the product using the serial number
    try:
        product = Product.objects.get(serial_number=serial_number)
        product.discount = discount_percentage
    except Product.DoesNotExist:
        return Response(
            {"error": "Product with the given serial number not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    original_price = product.price
    discount_price = original_price * (1 - discount_percentage / 100)
    product.discount_price = discount_price
    product.save()

    # Notify all users with this product in their wishlist
    wishlist_entries = Wishlist.objects.filter(product=product).select_related('user')
    
    if not wishlist_entries.exists():
        return Response(
            {"error": "No users found with this product in their wishlist."},
            status=status.HTTP_404_NOT_FOUND
        )

    for entry in wishlist_entries:
        if entry.user.email:  # Ensure email exists before sending
            try:
                # Manually construct the product URL (assuming the base URL is 'http://123234234/products/')
                product_url = f'http://127.0.0.1:8000/product/{product.id}'

                # Render the email content (HTML)
                html_message = render_to_string('discount_notification.html', {
                    'user': entry.user,
                    'username': entry.user.username,
                    'product': product,
                    'discount_percentage': discount_percentage,
                    'product_url': product_url,  # Add the product link to context
                })
                plain_text_content = strip_tags(html_message)  # Generate plain text from HTML
                
                email = EmailMessage(
                    subject=f"Discount Alert for '{product.name}'!",
                    body=plain_text_content,  # Plain text version of the email
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[entry.user.email],
                )
                
                # Attach HTML message for email clients that support HTML
                email.content_subtype = "html"
                email.body = html_message

                # Send the email
                email.send(fail_silently=False)

            except Exception as e:
                print(f"Could not send email to {entry.user.email}: {e}")


    # Send success response
    return Response(
        {
            "message": f"Discount applied successfully to '{product.name}'. Notifications sent to wishlist users.",
            "serial_number": product.serial_number,
            "product_name": product.name,
            "original_price": original_price,
            "discounted_price": discount_price,
            "discount_percentage": discount_percentage,
        },
        status=status.HTTP_200_OK
    )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_product_stock(request):
    """
    Endpoint for a product manager to update a product's stock.
    Sends notifications to users who added the product to their wishlist
    if the stock is updated from 0 to a positive number.
    """
    # Ensure only product managers can access this
    if not request.user.role == 'product_manager':
        return Response({'error': 'You are not authorized to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    # Extract product id and stock value
    product_id = request.data.get('product_id')
    new_stock = request.data.get('new_stock')

    if not product_id or new_stock is None:
        return Response({'error': 'Product ID and new stock must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the product
        product = Product.objects.get(id=product_id)
        product.stock = int(new_stock)  # Update the stock value
        product.save()


        return Response({'message': f"Stock updated for product '{product.name}'."}, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid stock value.'}, status=status.HTTP_400_BAD_REQUEST)






@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_invoices(request):
    """
    API endpoint for sales managers to view all invoices within a given date range,
    calculate discounted revenue, and return a chart based on discounted revenue only.
    Only accessible by users with role 'sales_manager'.
    """
    user = request.user

    # Ensure the user is a Sales Manager
    if user.role != 'sales_manager':
        return Response(
            {"error": "You do not have permission to view this data."},
            status=status.HTTP_403_FORBIDDEN
        )

    # Extract query parameters for date range
    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')

    # Validate presence of both parameters
    if not start_date or not end_date:
        return Response(
            {"error": "Both 'start_date' and 'end_date' parameters are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Parse the dates safely
    try:
        start_date = parse_datetime(start_date)
        end_date = parse_datetime(end_date)
        
        if not start_date or not end_date:
            raise ValueError("Invalid date format provided.")

        # Ensure that the date range is valid
        if start_date > end_date:
            return Response(
                {"error": "'start_date' cannot be later than 'end_date'."},
                status=status.HTTP_400_BAD_REQUEST
            )
    except ValueError as e:
        return Response(
            {"error": f"Invalid date format: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Fetch invoices in the date range
    invoices = Invoice.objects.filter(date__range=(start_date, end_date))

    if not invoices.exists():
        return Response(
            {"message": "No invoices found in the given date range."},
            status=status.HTTP_200_OK
        )

    # Calculate total discounted revenue
    total_discounted_revenue = invoices.aggregate(Sum('discounted_total'))['discounted_total__sum'] or 0

    # Prepare data for chart (monthly breakdown of discounted revenue)
    discounted_revenue_per_month = []
    months = []

    # Generate discounted revenue per month within the given date range
    current_date = start_date
    while current_date <= end_date:
        # Define the start and end of the current month
        month_start = datetime(current_date.year, current_date.month, 1)
        month_end = datetime(current_date.year, current_date.month + 1, 1) if current_date.month < 12 else datetime(current_date.year + 1, 1, 1)
        
        # Ensure the month_end doesn't exceed the given end_date
        if month_end > end_date:
            month_end = end_date

        # Calculate the revenue for this month
        monthly_discounted_revenue = Invoice.objects.filter(date__range=(month_start, month_end)).aggregate(Sum('discounted_total'))['discounted_total__sum'] or 0
        
        # Append the result
        discounted_revenue_per_month.append(monthly_discounted_revenue)
        months.append(month_start.strftime('%b %Y'))  # Format month as "Short Month Year" (e.g., "Jan 2024")
        
        # Move to the next month
        if current_date.month == 12:
            current_date = datetime(current_date.year + 1, 1, 1)
        else:
            current_date = datetime(current_date.year, current_date.month + 1, 1)

    # Get the maximum revenue value to set as the max y-axis limit
    max_revenue = max(discounted_revenue_per_month) if discounted_revenue_per_month else 0

    # Generate a plot (chart) of discounted revenue (only one line for revenue)
    fig, ax = plt.subplots()
    ax.plot(months, discounted_revenue_per_month, label="Discounted Revenue", color='green')


    ax.set_xlabel('Month', fontsize=10)  # Adjust font size of x-axis label
    ax.set_ylabel('Discounted Revenue', fontsize=10)  # Adjust font size of y-axis label
    ax.set_title(f'Monthly Discounted Revenue from {start_date.strftime("%B %d, %Y")} to {end_date.strftime("%B %d, %Y")}', fontsize=12)
    ax.legend(fontsize=10)


    # Set the y-axis limit: Min is 0, max is the max revenue value
    ax.set_ylim(0, float(max_revenue) * 1.1)  # Giving a bit of space above max value

    # Adjust x-tick labels to prevent overlap (rotate them)
    plt.xticks(rotation=45, ha='right')  # Rotate the labels by 45 degrees and align them to the right

    # Optionally, adjust x-ticks to a reasonable number
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))  # Adjust to show all months without too much overlap

    # Define the path where to save the image
    chart_dir = os.path.join(settings.MEDIA_ROOT, 'charts')  # Assuming you are using Django's MEDIA_ROOT
    if not os.path.exists(chart_dir):
        os.makedirs(chart_dir)

    chart_filename = f"discounted_revenue_{start_date.strftime('%Y%m%d')}_{end_date.strftime('%Y%m%d')}.png"
    chart_path = os.path.join(chart_dir, chart_filename)

    # Save the plot to the file system
     # Save the plot to the file system with bbox_inches='tight' to ensure everything is visible
    plt.savefig(chart_path, format='png', bbox_inches='tight')
    plt.close(fig)
    # You can generate the chart URL for the frontend
    chart_url = f"{settings.MEDIA_URL}charts/{chart_filename}"

    # Return the response with revenue data and chart URL
    return Response(
        {
            "total_discounted_revenue": total_discounted_revenue,
            "chart_url": chart_url,  # URL to the saved chart image
            "monthly_data": {
                "months": months,
                "discounted_revenue": discounted_revenue_per_month
            }
        },
        status=status.HTTP_200_OK
    )
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_refund(request):
    """
    Customer can request a refund for a purchased product within 30 days.
    """
    user = request.user
    # Ensure the user is a Customer
    if user.role != 'customer':
        return Response(
            {"error": "You do not have permission to view this data."},
            status=status.HTTP_403_FORBIDDEN)
    
    
    order_item_id = request.data.get("order_item_id")
    reason = request.data.get("reason", "")
    
    # Ensure order_item_id is provided
    if not order_item_id:
        return Response({"error": "Order item ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the order item
    
        order_item = OrderItem.objects.get(id=order_item_id)
        
        # Check if the order status is 'Delivered'
        if order_item.order.status != 'Delivered':
            return Response(
                {"error": "Refunds are only allowed for delivered items."},
                status=status.HTTP_400_BAD_REQUEST
        )
        
        
        # Check if the order item is less than 30 days old
        if now() - order_item.order.date_ordered > timedelta(days=30):
            return Response({"error": "Refunds are only allowed within 30 days of purchase."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if a refund request has already been created for this order item
        if RefundRequest.objects.filter(order_item=order_item).exists():
            return Response(
                {"error": "A refund request already exists for this order item."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        # Create refund request
        refund_request = RefundRequest.objects.create(
            customer=user,
            order_item=order_item,
            reason=reason
        )

        return Response(
            {"message": "Refund request submitted successfully.", "refund_request_id": refund_request.id},
            status=status.HTTP_201_CREATED
        )
    except OrderItem.DoesNotExist:
        return Response({"error": "Order item not found or you don't have permission to refund this product."}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_refund_request(request):
    """
    Sales Manager can approve/reject refund requests.
    """
    user = request.user
    if user.role != "sales_manager":
        return Response({"error": "You don't have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)

    refund_request_id = request.data.get("refund_request_id")
    decision = request.data.get("decision")  # Accept/Reject

    # Ensure the refund_request_id and decision are provided
    if not refund_request_id or decision not in ['Approved', 'Rejected']:
        return Response({"error": "Invalid request. Ensure refund_request_id and decision are provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        refund_request = RefundRequest.objects.get(id=refund_request_id)

        if refund_request.status != 'Pending':
            return Response({"error": "This refund request has already been reviewed."}, status=status.HTTP_400_BAD_REQUEST)

        # Update the status
        refund_request.status = decision
        refund_request.save()

        if decision == 'Approved':
            # Refund logic
            order_item = refund_request.order_item
            product = order_item.product

            # Adjust product stock
            product.stock += order_item.quantity
            product.save()

            # Simulate refund logic here (e.g., refund the amount to customer's payment gateway)
            refund_amount = order_item.discount_subtotal
            
            # Add logic to refund the amount to customer's payment system, if needed.

            return Response(
            {
                "message": "Refund approved, stock updated, and refund amount processed.",
                "refund_amount": str(refund_amount),
                "product": order_item.product.name,
                "quantity_returned": order_item.quantity,
            },
            status=status.HTTP_200_OK,
        )
        else:
            return Response({"message": "Refund rejected."}, status=status.HTTP_200_OK)

    except RefundRequest.DoesNotExist:
        return Response({"error": "Refund request not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_refund_requests(request):
    user = request.user

    # Ensure the user is a sales manager
    if not user.role == 'sales_manager':
        return Response(
            {"error": "You do not have permission to view refund requests."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Retrieve only pending refund requests
    pending_requests = RefundRequest.objects.filter(status='Pending')

    # Serialize the data
    serializer = RefundRequestSerializer(pending_requests, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    """Cancel an order for the authenticated user."""
    try:
        # Fetch the order
        order = Order.objects.get(id=order_id, customer=request.user)
        
        if order.status != 'Processing':
            if order.status == 'Cancelled':
                return Response(
                {"error": "This order is already cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            ) 
            else:
                return Response(
                    {"error": "Completed orders cannot be cancelled."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Mark the order as cancelled
        order.status = 'Cancelled'
        order.save()

        return Response(
            {"message": f"Order {order.id} has been cancelled successfully."},
            status=status.HTTP_200_OK
        )
    except Order.DoesNotExist:
        return Response(
            {"error": "Order not found or does not belong to you."},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def manage_stock(request, product_id):
    """API for product managers to update product stock."""
    if request.user.role != 'product_manager':
        return Response({"error": "Only product managers can manage stock."}, status=status.HTTP_403_FORBIDDEN)

    try:
        product = Product.objects.get(id=product_id)
        new_stock = request.data.get('stock')
        if new_stock is None or not isinstance(new_stock, int):
            return Response({"error": "Invalid stock value."}, status=status.HTTP_400_BAD_REQUEST)

        product.stock = new_stock
        product.save()
        return Response({"message": f"Stock updated for product '{product.name}'. New stock: {product.stock}"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_deliveries(request):
    """
    Retrieve all deliveries. Only accessible by Product Managers.
    """
    if request.user.role != 'product_manager':
        return Response({"error": "Only product managers can access delivery data."}, status=status.HTTP_403_FORBIDDEN)

    # Fetch all deliveries
    deliveries = Delivery.objects.all()

    if not deliveries.exists():
        return Response({"message": "No deliveries found."}, status=status.HTTP_200_OK)

    # Serialize the deliveries
    serialized_deliveries = []
    for delivery in deliveries:
        serialized_deliveries.append({
            "delivery_id": delivery.id,
            "customer_id": delivery.customer.id,
            "customer_username": delivery.customer.username,
            "product_id": delivery.order_item.product.id,
            "product_name": delivery.order_item.product.name,
            "quantity": delivery.order_item.quantity,
            "total_price": float(delivery.total_price),
            "delivery_address": delivery.delivery_address,
            "status": delivery.status,
            "created_at": delivery.created_at,
            "updated_at": delivery.updated_at,
        })

    return Response(serialized_deliveries, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_revenue(request):
    """
    Calculate revenue and profit/loss within a given date range.
    """
    if request.user.role != 'sales_manager':
        return Response({"error": "Only sales managers can calculate revenue and profit."}, status=status.HTTP_403_FORBIDDEN)

    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')

    """if not start_date or not end_date:
        return Response({"error": "Both start_date and end_date are required."}, status=status.HTTP_400_BAD_REQUEST)"""

    try:
        start_date = parse_datetime(start_date)
        end_date = parse_datetime(end_date)



        if not start_date or not end_date:
            raise ValueError("Invalid date format.")
        if start_date > end_date:
            return Response({"error": "start_date cannot be later than end_date."}, status=status.HTTP_400_BAD_REQUEST)

    except ValueError:
        return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

    # Calculate revenue and profit/loss
    orders = Order.objects.filter(date_ordered__range=(start_date, end_date), complete=True).exclude(status= 'Cancelled')
    revenue = sum(
        item.discount_subtotal
        for order in orders
        for item in order.order_items.all()
    )

    return Response(
        {
            "revenue": revenue,
            "start_date" : start_date,
            "end_date" : end_date,
        },
        status=status.HTTP_200_OK
    )
    
    
    
@api_view(['POST'])
def update_user_fields(request):
    """
    API endpoint to allow users to update their fields like email, username, address, tax_id, etc.
    """

    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get the user object
    user = request.user

    address = request.data.get('address')
    tax_id = request.data.get('tax_id')

    if address is not None:  # Check for empty strings as valid value
        user.address = address
    
    if tax_id is not None:  # Check for empty strings as valid value
        user.tax_id = tax_id
    

    # Save the updated user object
    user.save()

    # Return response
    return Response({
        "message": "User details updated successfully.",
        "user": {
            "address": user.address,
            "tax_id": user.tax_id,
            
        }
    }, status=status.HTTP_200_OK)
    
    
    
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def update_delivery_status(request, delivery_id):
    """
    API endpoint to update the delivery status and address for a specific delivery.
    Only accessible by product managers.
    """
    # Check if the user is a product manager
    if request.user.role != 'product_manager':
        return Response({"error": "You are not authorized to update this delivery status."}, status=status.HTTP_403_FORBIDDEN)
    
    # Check if the delivery exists
    try:
        delivery = Delivery.objects.get(id=delivery_id)
    except Delivery.DoesNotExist:
        return Response({"error": "Delivery not found."}, status=status.HTTP_404_NOT_FOUND)

    # Get the status and delivery address from the request
    new_status = request.data.get('status', None)
    new_delivery_address = request.data.get('delivery_address', None)

    # Update the delivery address if provided
    if new_delivery_address:
        delivery.delivery_address = new_delivery_address

    # If a new status is provided, update the order status
    if new_status:
        if new_status not in ['In-transit', 'Delivered', 'Processing', 'Cancelled']:
            return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the order status (you can customize this part depending on your logic)
        delivery.order_item.order.status = new_status
        delivery.order_item.order.save()

    # Save the updated delivery object
    delivery.updated_at = timezone.now()  # Update the timestamp for the modification
    delivery.save()

    # Return the updated delivery information
    return Response({
        "message": "Delivery updated successfully.",
        "delivery": {
            "id": delivery.id,
            "order_item": delivery.order_item.id,
            "customer": delivery.customer.username,
            "delivery_address": delivery.delivery_address,
            "total_price": str(delivery.total_price),
            "status": delivery.status,
            "created_at": delivery.created_at,
            "updated_at": delivery.updated_at,
        }
    }, status=status.HTTP_200_OK)