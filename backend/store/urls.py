# accounts/urls.py
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.store, name="store"),

    # Login and Register
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),

    # Product and Category
    path('products/get_all/', views.get_all_products, name='get_all_products'),
    path('categories/add/', views.add_category, name='add_category'),
    path('categories/delete/<str:category_name>/', views.delete_category, name='delete_category'),
    path('categories/get_all/', views.get_categories, name='get_categories'),
    path('products/category/<str:category_name>/', views.get_products_by_category, name='get_products_by_category'),

    # Wishlist and Notification
    path('wishlist/', views.get_wishlist, name='get_wishlist'),
    path('wishlist/add/', views.add_to_wishlist, name='add_to_wishlist'),
    path('wishlist/remove/', views.remove_from_wishlist, name='remove_from_wishlist'),
    path('notifications/', views.get_notifications, name='get_notifications'),
    path('notifications/mark-read/', views.mark_notifications_as_read, name='mark_notifications_as_read'),

    # Shopping Cart
    path('cart/add/', views.add_to_cart, name='add_to_cart'), 
    path('cart/assign_to_user/', views.assign_user_to_order, name='assign_user_to_order'), 
    path('cart/get-subtotal/', views.get_subtotal, name='get_subtotal'), 
    path('cart/update/', views.update_cart_item, name='update_cart_item'),
    path('cart/delete/', views.delete_cart_item, name='delete_cart_item'),

    # Payment and Order History
    path('checkout/', views.checkout, name='checkout'),
    path('order/items/<int:order_id>/', views.get_order_items, name='get_order_items'),
    path('order/', views.get_order, name='get_order'),
    path('order/history/', views.order_history, name='order_history'),
    path('request-refund/', views.request_refund, name="request_refund"),
    path('order/cancel/<int:order_id>/', views.cancel_order, name='cancel_order'),

    # Reviews
    path('products/<int:product_id>/add_review/', views.add_review, name='add_review'),
    path('products/<int:product_id>/get_reviews/', views.get_reviews_by_product, name='get_reviews_by_product'),
    path('products/<int:product_id>/get_rating/', views.get_rating_by_product, name='get_rating_by_product'),

    # Sales Manager
    path('sales-manager/apply-discount/', views.apply_discount, name='apply_discount'),
    path('sales-manager/view-invoices/', views.view_invoices, name="view-invoices"),
    path('sales-manager/pending-refund-requests/', views.get_pending_refund_requests, name='pending-refund-requests'),
    path('sales-manager/review-refund-request/', views.review_refund_request, name="review_refund_request"),
    # revenue calculation
    
    # Product Manager
    path('products/add_product/', views.add_product, name='add_product'),
    path('products/delete_product/<int:product_id>/', views.delete_product, name='delete_product'), 
    path('categories/add/', views.add_category, name='add_category'),
    # delete category api needed
    path('product-manager/update-product-stock/', views.update_product_stock, name='update_product_stock'),
    path('products/manage-stock/<int:product_id>/', views.manage_stock, name='manage_stock'),
    path('reviews/<int:review_id>/approve/', views.update_review_comment_status, name='approve-review'),
    # disapprove comment api can be added ?
    
    # Sort and Search api's
    path('products/sort/price/asc/', views.get_products_sorted_by_price_asc, name='products_sorted_by_price_asc'),
    path('products/sort/price/desc/', views.get_products_sorted_by_price_desc, name='products_sorted_by_price_desc'),
    path('products/sort/popularity/asc/', views.get_products_sorted_by_popularity_asc, name='get_products_sorted_by_popularity_asc'),
    path('products/sort/popularity/desc/', views.get_products_sorted_by_popularity_desc, name='get_products_sorted_by_popularity_desc'),
    
    path('products/category/<str:category_name>/sort/price/asc/', views.get_products_by_category_sorted_by_price_asc, name='products_by_category_sorted_by_price_asc'),
    path('products/category/<str:category_name>/sort/price/desc/', views.get_products_by_category_sorted_by_price_desc, name='products_by_category_sorted_by_price_desc'),
    path('products/category/<str:category_name>/sort/popularity/asc/', views.get_products_by_category_sorted_by_popularity_asc, name='get_products_by_category_sorted_by_popularity_asc'),
    path('products/category/<str:category_name>/sort/popularity/desc/', views.get_products_by_category_sorted_by_popularity_desc, name='get_products_by_category_sorted_by_popularity_desc'),
    path('deliveries/', views.get_all_deliveries, name='get_all_deliveries'),

]   + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
