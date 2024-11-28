# accounts/urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.store, name="store"),
    path('register/', views.register, name='register'),  # User registration
    path('login/', views.login, name='login'),    # User login
    path('products/add_product/', views.add_product, name='add_product'),
    path('products/delete_product/<str:serial_number>/', views.delete_product, name='delete_product'),  # Delete product
    path('products/get_all/', views.get_all_products, name='get_all_products'),
    path('categories/add/', views.add_category, name='add_category'),  # URL for adding a new category
    path('categories/get_all/', views.get_categories, name='get_categories'),  # New endpoint for retrieving categories
    path('products/category/<str:category_name>/', views.get_products_by_category, name='get_products_by_category'),  # New endpoint for retrieving products by category

    path('products/sort/price/asc/', views.get_products_sorted_by_price_asc, name='products_sorted_by_price_asc'),
    path('products/sort/price/desc/', views.get_products_sorted_by_price_desc, name='products_sorted_by_price_desc'),
    path('products/category/<str:category_name>/sort/price/asc/', views.get_products_by_category_sorted_by_price_asc, name='products_by_category_sorted_by_price_asc'),
    path('products/category/<str:category_name>/sort/price/desc/', views.get_products_by_category_sorted_by_price_desc, name='products_by_category_sorted_by_price_desc'),
    path('products/sort/popularity/asc/', views.get_products_sorted_by_popularity_asc, name='get_products_sorted_by_popularity_asc'),
    path('products/sort/popularity/desc/', views.get_products_sorted_by_popularity_desc, name='get_products_sorted_by_popularity_desc'),
    path('products/category/<str:category_name>/sort/popularity/asc/', views.get_products_by_category_sorted_by_popularity_asc, name='get_products_by_category_sorted_by_popularity_asc'),
    path('products/category/<str:category_name>/sort/popularity/desc/', views.get_products_by_category_sorted_by_popularity_desc, name='get_products_by_category_sorted_by_popularity_desc'),
    path('products/search_products/', views.search_products, name='search_products'),

    path('products/search/', views.get_products_by_name, name='get_products_by_name'),
    path('products/price-interval/', views.get_products_by_price_interval, name='products_by_price_interval'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),  # Endpoint for adding an item to the cart
    path('cart/assign_to_user/', views.assign_user_to_order, name='assign_user_to_order'),  # Endpoint for assigning an order to a user
    path('cart/get-subtotal/', views.get_subtotal, name='get_subtotal'),  # Endpoint for calculating subtotal
    path('order/items/', views.get_order_items, name='get_order_items'),  # Endpoint for order items
    path('order/', views.get_order, name='get_order'),  # Endpoint for order details
    path('order/history/', views.order_history, name='order_history'),  # URL for viewing order history
    path('checkout/', views.checkout, name='checkout'),                 # URL for completing the checkout process
    path('products/<int:product_id>/add_review/', views.add_review, name='add_review'),
    path('products/<int:product_id>/get_reviews/', views.get_reviews_by_product, name='get_reviews_by_product'),
    #path('wishlist/', views.get_wishlist, name='get_wishlist'),
    #path('wishlist/add/', views.add_to_wishlist, name='add_to_wishlist'),
    #path('wishlist/remove/', views.remove_from_wishlist, name='remove_from_wishlist'),
    #path('notifications/', views.get_notifications, name='get_notifications'),
    #path('notifications/mark-read/', views.mark_notifications_as_read, name='mark_notifications_as_read'),
    path('apply-discount/', views.apply_discount, name='apply_discount'),
    
]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    #path('request-password-reset/', views.request_password_reset, name='request-password-reset'),  # Request password reset
    #path('reset-password-confirm/<uidb64>/<token>/', views.reset_password_confirm, name='reset-password-confirm'),  # Reset password

"""

# Customer Profile
class CustomerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="customer_profile")
    address = models.CharField(max_length=255, null=False)
    phone_number = PhoneNumberField()
    tax_id = models.CharField(max_length=50, blank =True, null=True)
    # Role specification to denote this is a customer
    is_customer = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username}'s Customer Profile"

# Sales Manager Profile
class SalesManagerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="sales_manager_profile")

    def __str__(self):
        return f"{self.user.username}'s Sales Manager Profile"

# Product Manager Profile
class ProductManagerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="product_manager_profile")
    managed_categories = models.CharField(max_length=255)  # Could be a ManyToMany if categories are models

    def __str__(self):
        return f"{self.user.username}'s Product Manager Profile"
    

class DeliveryList(models.Model):
    delivery_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="deliveries")
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.TextField()
    delivery_date = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Delivery {self.delivery_id} for {self.customer.username}"

    def mark_as_completed(self):
        #Mark this delivery as completed.
        self.is_completed = True
        self.save()
    

class PaymentInformation(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    card_token = models.CharField(max_length=255)  # Token from payment processor
    card_last4 = models.CharField(max_length=4)  # Last 4 digits only
    card_expiry_month = models.PositiveSmallIntegerField()
    card_expiry_year = models.PositiveSmallIntegerField()
    card_brand = models.CharField(max_length=20)  # e.g., Visa, Mastercard

    def __str__(self):
        return f"{self.card_brand} ending in {self.card_last4}"



class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]  # For a 1-5 star rating system; change to 1-10 for that range

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # or use your Customer model here
    rating = models.IntegerField(choices=RATING_CHOICES)  # Rating out of 5 or 10
    comment = models.TextField()
    approved = models.BooleanField(default=False)  # Manager approval before visible
    date_created = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Review by {self.user} on {self.product.name} - {self.rating} stars"
      
    




class ShippingAddress(models.Model):
	customer = models.ForeignKey(CustomerProfile, on_delete=models.SET_NULL, null=True)
	order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
	address = models.CharField(max_length=200, null=False)
	city = models.CharField(max_length=200, null=False)
	state = models.CharField(max_length=200, null=False)
	zipcode = models.CharField(max_length=200, null=False)
	date_added = models.DateTimeField(auto_now_add=True)

	def _str_(self):
		return self.address
  
  
  """