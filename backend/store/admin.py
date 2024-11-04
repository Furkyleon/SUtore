from django.contrib import admin

# Register your models here.

from .models import *

# admin.site.register(CustomerProfile)
admin.site.register(CustomUser)
admin.site.register(Product)
admin.site.register(Category)
"""
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Review)
admin.site.register(DeliveryList)
admin.site.register(OrderHistory)
admin.site.register(PaymentInformation)
admin.site.register(ProductManagerProfile)
admin.site.register(SalesManagerProfile)
"""


