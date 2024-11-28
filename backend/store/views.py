from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
#from .models import Product
from .serializers import *
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
#from django.utils.encoding import force_bytes, force_text
from django.contrib.auth.tokens import default_token_generator as token_generator
from django.db import models
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from decimal import Decimal
from .utils import send_order_confirmation_email 
from io import BytesIO
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import pdfkit
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# bu alttakilere bakılacak
# @login_required
# @permission_required('accounts.add_product', raise_exception=True)
def store(request):
     context = {}
     return render(request, 'store.html', context)

@csrf_exempt  # Exempt from CSRF verification
@api_view(['POST'])
def register(request):
    # Extract required fields from the request data
    username = request.data.get('username')
    email = request.data.get('email')
    address = request.data.get('address')
    password = request.data.get('password')
    tax_id = request.data.get('tax_id')  # New field
    role = request.data.get('role', 'customer')  # New field with default role

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

    # Create the new CustomUser instance
    user = CustomUser.objects.create_user(
        username=username,
        email=email,
        password=password,
        address=address,
        tax_id=tax_id,  # Include tax ID
        role=role  # Include role
    )

    # Optionally, you can create a token for the user here if using token authentication
    # from rest_framework.authtoken.models import Token
    # token, created = Token.objects.get_or_create(user=user)

    # Send the user data in response
    return Response({
        # 'token': token.key,  # Uncomment if using tokens
        'user': {
            'username': user.username,
            'email': user.email,
            'address': user.address,
            'tax_id': user.tax_id,  # Include tax ID in response
            'role': user.role  # Include role in response
        }
    }, status=status.HTTP_201_CREATED)
    


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    # Use the custom manager to retrieve the user by email
    user = CustomUser.objects.get_user_by_username(username)

    if user is None:
        return Response({'error': 'Invalid username.'}, 
                        status=status.HTTP_401_UNAUTHORIZED)
        
    if not user.check_password(password):
        return Response({'error': 'Invalid password.'}, 
                        status=status.HTTP_401_UNAUTHORIZED)

        # Send the user data in response
    return Response({
        # 'token': token.key,  # Uncomment if using tokens
        'user': {
            'username': user.username,
            'email': user.email,
            'address': user.address,
            'tax_id': user.tax_id,  # Include tax ID in response
            'role': user.role  # Include role in response
        }
    }, status=status.HTTP_201_CREATED)
    
    
    
@api_view(['POST'])
def add_product(request):
    # Use the ProductSerializer to validate and save the incoming data
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        # Save the product to the database
        product = serializer.save()
        
        # Return the created product data in the response
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
    
    # Return errors if the serializer is not valid
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
#@permission_classes([IsAuthenticated])
def delete_product(request, serial_number):
    
    try:
        # Retrieve the product by serial_number
        product = Product.objects.get(serial_number=serial_number)
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
def add_category(request):
    
    serializer = CategorySerializer(data=request.data) 
    if serializer.is_valid():
        category = serializer.save()
        return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    products = Product.objects.filter(price__gte=min_price, price__lte=max_price)

    if not products.exists():
        return Response({'error': 'No products found in this price range.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)  # Serialize the queryset
    return Response(serializer.data, status=status.HTTP_200_OK)  # Return serialized data


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
        if quantity <= 0:
            return Response({"error": "Quantity must be a positive integer."}, status=status.HTTP_400_BAD_REQUEST)
    except ValueError:
        return Response({"error": "Quantity must be a valid integer."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate that the product exists
    product = get_object_or_404(Product, serial_number=serial_number)
    price = product.price

    # Stock check
    if product.stock < quantity:
        return Response({"error": f"Only {product.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)

    # Determine if the user is authenticated
    if not request.user.is_authenticated:
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
    else:
        # Handle authenticated users
        order, created = Order.objects.get_or_create(
            customer=request.user,
            complete=False  # Ensure it's an active cart
        )

    # Create or update the OrderItem
    order_item, created = OrderItem.objects.get_or_create(
        order=order,
        product=product,
        defaults={'quantity': quantity, 'price': price}
    )

    if not created:  # Update quantity and subtotal if item already exists
        if order_item.quantity + quantity > product.stock:
            return Response({"error": f"Only {product.stock} items available in stock."}, status=status.HTTP_400_BAD_REQUEST)
        
        order_item.quantity += quantity
        order_item.subtotal = price * order_item.quantity
        order_item.save()
    else:
        # Set subtotal for a new item
        order_item.subtotal = price * order_item.quantity
        order_item.save()

    # Optionally return the order ID and order item details
    serializer = OrderItemSerializer(order_item)
    return Response({"order_id": order.id, "order_item": serializer.data}, status=status.HTTP_201_CREATED)

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
def get_order_items(request):
    if not request.user.is_authenticated:
        return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

    # Retrieve the active order for the customer
    try:
        order = Order.objects.get(customer=request.user, complete=False)
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
        return Response({"error": "Pending order not found."}, status=status.HTTP_404_NOT_FOUND)

    # Mark the order as complete
    order.complete = True
    order.status = 'In Progress'
    order.save()

    # Calculate the total amount for the order
    total_amount = 0
    for item in order.order_items.all():
        total_amount += Decimal(str(item.subtotal))
        
        # Decrease product stock based on quantity in the order
        product = item.product
        product.stock -= item.quantity
        product.save()

    # Add it to the order history (if not already added)
    order_history, created = OrderHistory.objects.get_or_create(customer=request.user)
    order_history.orders.add(order)
    order_history.total_amount += total_amount  # Ensure total_amount is set
    order_history.save()

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
    # Open the generated PDF file and attach it
    with open(pdf_file_path, 'rb') as f:
        email.attach(f'Invoice_Order_{order.id}.pdf', f.read(), 'application/pdf')

    # Send the email
    try:
        email.send()
        return Response({"message": "Order completed successfully, and invoice has been sent."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):
    product = Product.objects.get(id=product_id)
    rating = request.data.get('rating')
    comment = request.data.get('comment')
    comment_status = request.data.get('comment_status')

    # Check if the user has purchased this product in a completed order
    purchased_items = OrderItem.objects.filter(order__customer=request.user, order__complete=True, product=product)
    if not purchased_items.exists():
        return Response({"error": "You can only review products you've purchased."}, status=status.HTTP_403_FORBIDDEN)

    # Save the review
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
    reviews = Review.objects.filter(product=product)
    
    # Serialize the reviews
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    """Retrieve the current user's wishlist."""
    wishlist_items = Wishlist.objects.filter(user=request.user)
    if not wishlist_items.exists():
        return Response({'message': 'Your wishlist is empty.'}, status=status.HTTP_200_OK)

    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    """Add a product to the user's wishlist."""
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
    """Remove a product from the user's wishlist."""
    product_id = request.data.get('product_id')  # Extract product_id from the request body

    if not product_id:
        return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        wishlist_item = Wishlist.objects.get(user=request.user, product_id=product_id)
        wishlist_item.delete()
        return Response({'message': 'Product removed from wishlist.'}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Product not found in your wishlist.'}, status=status.HTTP_404_NOT_FOUND)

"""
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    Get notifications for the logged-in user.
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
    Mark notifications as read.
    notification_ids = request.data.get('notification_ids', [])
    if not notification_ids:
        return Response({'error': 'No notification IDs provided'}, status=400)

    Notification.objects.filter(id__in=notification_ids, user=request.user).update(is_read=True)
    return Response({'message': 'Notifications marked as read.'})
"""

@api_view(['POST'])
def apply_discount(request):
    """
    API endpoint to allow a Sales Manager to apply a discount to a product using the product's serial number.
    """
    user = request.user

    """
    # Ensure the user is a Sales Manager
    if not isinstance(user, CustomUser) or user.role != 'sales_manager':
        return Response(
            {"error": "You do not have permission to perform this action."},
            status=status.HTTP_403_FORBIDDEN
        )
    """
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

    return Response(
        {
            "message": f"Discount applied. {product.name} is now priced at ${product.price} (Original: ${original_price}).",
            "serial_number": product.serial_number,
            "product_name": product.name,
            "original_price": original_price,
            "discounted_price": product.discount_price,
            "price": product.price
        },
        status=status.HTTP_200_OK
    )
