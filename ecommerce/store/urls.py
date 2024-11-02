

# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.store, name="store"),
    path('products/', views.product_list, name='product-list'),          # For listing and creating products
    path('products/<int:pk>/', views.product_detail, name='product-detail'),  # For retrieving, updating, and deleting a single product
    path('register/', views.register, name='register'),  # User registration
    path('login/', views.login, name='login'),    # User login
]


