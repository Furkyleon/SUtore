# accounts/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.store, name="store"),
    path('mainpage/', views.store, name="store"),
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
    path('products/price-interval/', views.get_products_by_price_interval, name='products_by_price_interval'),
]

    # path('request-password-reset/', views.request_password_reset, name='request-password-reset'),  # Request password reset
    # path('reset-password-confirm/<uidb64>/<token>/', views.reset_password_confirm, name='reset-password-confirm'),  # Reset password
