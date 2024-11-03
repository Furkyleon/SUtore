from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings

from django.contrib.auth.models import BaseUserManager

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

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name    

#A product should have the following properties at the very least: ID, name, model, serial
#number, description, quantity in stocks, price, warranty status, and distribütör information.
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    digital = models.BooleanField(default=False,null=True, blank=True)
    category = models.CharField(max_length=200, null=True)  # Make sure to have this
    stock = models.IntegerField(default=0) 
    popularity = models.IntegerField(default=0)  # Tracks popularity, based on views or purchases
    model = models.CharField(max_length=100, blank=True, null=True)  # Model of the product
    serial_number = models.CharField(max_length=100, unique=True, blank=True, null=True)  # Unique serial number
    warranty_status = models.CharField(max_length=50, blank=True, null=True)  # Warranty status (e.g., "1 year", "2 years")
    distributor_info = models.TextField(blank=True, null=True)  # Distributor details
        
    def _str_(self):
        return self.name
