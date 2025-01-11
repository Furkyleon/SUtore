from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from django.contrib.auth.models import BaseUserManager
from django.db.models import Sum
from datetime import timedelta
from django.utils import timezone
from django.db.models import F, Q
from decimal import Decimal
from django.core.validators import MaxValueValidator, MinValueValidator

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None,  **extra_fields):
        """Create and return a 'CustomUser' with an email and password."""
        if not email:
            raise ValueError('The Email field must be set')
        if not username:
            raise ValueError('The Username field must be set')
        

        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and return a superuser with an email, username, and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)
    
    def get_user_by_email(self, email):
        """Retrieve a user by their email address."""
        try:
            return self.get(email=email)
        except self.model.DoesNotExist:
            return None
        
    def get_user_by_username(self, username):
        """Retrieve a user by their username."""
        try:
            return self.get(username=username)
        except self.model.DoesNotExist:
            return None
        

class CustomUser(AbstractUser):
    address = models.CharField(max_length=255, blank=True, null=True)
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('product_manager', 'Product Manager'),
        ('sales_manager', 'Sales Manager'),
    ]
    tax_id = models.CharField(max_length=50, blank =True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    # You can add other fields such as address if needed
    objects = CustomUserManager()  # Assign the custom manager



class SalesManager:
    def init(self, user):
        """Initialize with a user object."""
        if not isinstance(user, CustomUser):
            raise ValueError("User must be an instance of CustomUser.")
        if user.role != 'sales_manager':
            raise PermissionError("The user is not authorized as a Sales Manager.")
        self.user = user

    def apply_discount(self, product, discount_percentage):
        """
        Apply a discount to a product.
        :param product: Product instance.
        :param discount_percentage: Discount percentage (0-100).
        """
        if discount_percentage < 0 or discount_percentage > 100:
            raise ValueError("Discount percentage must be between 0 and 100.")
        if not isinstance(product, Product):
            raise ValueError("Invalid product instance.")
        # Calculate discounted price
        original_price = product.price
        discounted_price = original_price * (1 - discount_percentage / 100)
        product.price = round(discounted_price, 2)
        product.save()
        return f"Discount applied. {product.name} is now priced at ${product.price} (Original: ${original_price})."

class ProductManager:
    def init(self, user):
        """Initialize with a user object."""
        if not isinstance(user, CustomUser):
            raise ValueError("User must be an instance of CustomUser.")
        if user.role != 'product_manager':
            raise PermissionError("The user is not authorized as a Product Manager.")
        self.user = user

    def add_product(self, product_data):
        """Add a new product."""
        product = Product(**product_data)
        product.save()
        return f"Product '{product.name}' added successfully."

    def remove_product(self, product_id):
        """Remove a product by ID."""
        try:
            product = Product.objects.get(id=product_id)
            product.delete()
            return f"Product '{product.name}' removed successfully."
        except Product.DoesNotExist:
            raise ValueError("Product not found.")

    def manage_stock(self, product_id, quantity):
        """Update stock for a product."""
        try:
            product = Product.objects.get(id=product_id)
            product.stock = quantity
            product.save()
            return f"Stock updated for product '{product.name}'. New stock: {product.stock}"
        except Product.DoesNotExist:
            raise ValueError("Product not found.")

    def approve_comment(self, review_id):
        """Approve a comment."""
        try:
            review = Review.objects.get(id=review_id)
            review.comment_status = 'Approved'
            review.save()
            return f"Comment for product '{review.product.name}' approved."
        except Review.DoesNotExist:
            raise ValueError("Review not found.")

    def disapprove_comment(self, review_id):
        """Disapprove a comment."""
        try:
            review = Review.objects.get(id=review_id)
            review.comment_status = 'Rejected'
            review.save()
            return f"Comment for product '{review.product.name}' disapproved."
        except Review.DoesNotExist:
            raise ValueError("Review not found.")

    
    

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def str(self):
        return self.name    
    
    
# A product should have the following properties at the very least: ID, name, model, serial
# number, description, quantity in stocks, price, warranty status, and distributor information.
class Product(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    model = models.CharField(max_length=100, blank=True, null=True)  # Model of the product
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='product')
    description = models.CharField(max_length=200)
    price = models.FloatField()
    discount = models.FloatField(default=0.0, null=True)  # Discount percentage (0-100)
    discount_price = models.FloatField(default=0, null=price)
    stock = models.IntegerField(default=0)
    popularity = models.IntegerField(default=0)  # Tracks popularity, based on views or purchases
    digital = models.BooleanField(default=False,null=True, blank=True)
    serial_number = models.CharField(max_length=100, unique=True, blank=True, null=True)  # Unique serial number
    warranty_status = models.CharField(max_length=50, blank=True, null=True)  # Warranty status (e.g., "1 year", "2 years")
    distributor_info = models.TextField(blank=True, null=True)  # Distributor details

    def str(self):
        return self.name
    
    @property
    def discounted_price(self):
        """Calculate and return the discounted price."""
        return self.price * (1 - self.discount / 100)
     
    
class OrderHistory(models.Model):
    ORDER_STATUS_CHOICES = [
        ('Processing', 'Processing'),
        ('In-transit', 'In-transit'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]
    customer = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name="order_history", 
        limit_choices_to={'role': 'customer'}
    )

    orders = models.ManyToManyField('Order', related_name="order_histories")  # Allows multiple orders per history

    status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES)
    update_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    def str(self):
        return f"History for {self.customer.username}: {self.status} on {self.update_date.strftime('%Y-%m-%d %H:%M:%S')}"



class Order(models.Model):
    customer = models.ForeignKey(
        CustomUser, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="orders",
        limit_choices_to={'role': 'customer'}
    )
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=50, choices=OrderHistory.ORDER_STATUS_CHOICES, default="Processing")

    def str(self):
        return f"Order {self.id} by {self.customer}"

    @property
    def get_total_cost(self):
        return sum(item.subtotal for item in self.order_items.all())
    
    @property
    def get_discount_total_cost(self):
        return sum(item.discount_subtotal for item in self.order_items.all())
    
    
    @classmethod
    def calculate_revenue(cls, start_date, end_date):
        """Calculate revenue from orders within the date range."""
        orders = cls.objects.filter(date_ordered__range=(start_date, end_date), complete=True)
        return sum(order.get_total_cost for order in orders)

    @classmethod
    def calculate_profit_or_loss(cls, start_date, end_date):
        """Calculate profit/loss in the given date range."""
        orders = cls.objects.filter(date_ordered__range=(start_date, end_date), complete=True)
        revenue = sum(order.get_total_cost for order in orders)
        cost = sum(
            item.product.price * item.quantity  # Assuming price is the cost price
            for order in orders
            for item in order.order_items.all()
        )
        return Decimal(revenue) - Decimal(cost)  # Positive for profit, negative for loss

    def generate_deliveries(self):
        """Generate delivery entries for all items in the order."""
        for item in self.order_items.all():
            Delivery.objects.create(
                order_item=item,
                customer=self.customer,
                delivery_address=self.customer.address,
            )


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True, related_name="order_items")
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_discount = models.DecimalField(max_digits=10, decimal_places=2, null=price)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_added = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    is_refunded = models.BooleanField(default=False, null=True)

    def str(self):
        return f"{self.quantity} of {self.product.name} for Order {self.order.id}"

    def can_review(self):
        return self.order.complete  # Only allows reviews if the order is complete

    def save(self, *args, **kwargs):
        self.subtotal = self.price * self.quantity  # Calculate the subtotal during save
        super().save(*args, **kwargs)
    
class Review(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(0, 6)]  # Allows ratings from 1 to 5

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        validators=[MinValueValidator(0), MaxValueValidator(5)]  # Enforce range validation
    )
    comment = models.TextField(blank=True, null=True)
    comment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending', null=True) 
    date_added = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"{self.user.username}'s review of {self.product.name} - Rating: {self.rating}"

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlisted_by")
    added_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Prevent duplicate wishlist entries

    def str(self):
        return f"Wishlist item for {self.user.username}: {self.product.name}"

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def str(self):
        return f"Notification for {self.user.username}: {self.message[:20]}"


class Invoice(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='invoices')
    date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    url = models.URLField(max_length=255, blank=True, null=True)  # Field to store the invoice URL
    discounted_total = models.DecimalField(max_digits=10, decimal_places=2)

    def str(self):
        return f"Invoice for Order {self.order.id} by {self.customer.username}"
    
    
class RefundRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    ]
    
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="refund_requests")
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name="refund_request")
    request_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    reason = models.TextField(blank=True, null=True)

    def str(self):
        return f"Refund request {self.id} by {self.customer.username}"

class Delivery(models.Model):
    order_item = models.OneToOneField(
        OrderItem,
        on_delete=models.CASCADE,
        related_name='delivery'
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='deliveries',
        limit_choices_to={'role': 'customer'}
    )
    delivery_address = models.CharField(max_length=255, null= True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def status(self):
        """Derive the delivery status from the associated order."""
        return self.order_item.order.status

    def calculate_total_price(self):
        """Calculate and update the total price for the delivery."""
        self.total_price = Decimal(self.order_item.quantity) * Decimal(self.order_item.product.price)
        self.save()

    def _str_(self):
        return f"Delivery {self.id} for {self.order_item.product.name} - {self.status}"