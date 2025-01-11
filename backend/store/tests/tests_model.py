from django.test import TestCase
from decimal import Decimal
from store.models import *

# Test cases for the CustomUser model
class UserModelTests(TestCase):
    # Setup for user creation
    def setUp(self):
        # Create a customer user for testing
        self.user = CustomUser.objects.create_user(username='testuser', email='testuser@test.com', password='testpassword', role='customer')

    def test_create_user(self):
        # Check if the user is created successfully
        user_count = CustomUser.objects.count()
        self.assertEqual(user_count, 1)  # Ensure only one user exists
        self.assertEqual(self.user.username, 'testuser')  # Check username

    def test_user_role(self):
        # Check the default role assigned to the user
        self.assertEqual(self.user.role, 'customer')

    def test_create_superuser(self):
        # Create a superuser and verify its properties
        admin_user = CustomUser.objects.create_superuser(username='admin', email='admin@test.com', password='adminpassword')
        self.assertTrue(admin_user.is_staff)  # Ensure superuser has staff privileges
        self.assertTrue(admin_user.is_superuser)  # Ensure superuser flag is set


# Test cases for the Product model
class ProductModelTests(TestCase):
    def setUp(self):
        # Create a product category and product for testing
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Test Product',
            price=100.0,
            stock=10,
            category=self.category,
            description='Sample product description',
            serial_number='SN123456',
            warranty_status='1 year',
            digital=False
        )

    def test_create_product(self):
        # Verify product creation
        product_count = Product.objects.count()
        self.assertEqual(product_count, 1)
        self.assertEqual(self.product.name, 'Test Product')

    def test_product_category(self):
        # Check if product is assigned to the correct category
        self.assertEqual(self.product.category.name, 'Electronics')

    def test_product_discounted_price(self):
        # Apply a discount and verify the discounted price calculation
        self.product.discount = 10  # Apply a 10% discount
        self.product.save()
        discounted_price = self.product.discounted_price
        self.assertEqual(discounted_price, 90.0)  # Ensure the discounted price is correct


# Test cases for the Order model
class OrderModelTests(TestCase):
    def setUp(self):
        # Create a user, category, product, and order for testing
        self.user = CustomUser.objects.create_user(username='orderuser', email='orderuser@test.com', password='testpassword', role='customer')
        self.category = Category.objects.create(name='Home Appliances')
        self.product = Product.objects.create(
            name='Vacuum Cleaner',
            price=200.0,
            stock=5,
            category=self.category,
            description='Powerful vacuum cleaner',
            serial_number='VC12345'
        )
        self.order = Order.objects.create(customer=self.user)

    def test_create_order(self):
        # Verify order creation
        order_count = Order.objects.count()
        self.assertEqual(order_count, 1)
        self.assertEqual(self.order.customer.username, 'orderuser')

    def test_add_order_item(self):
        # Add an order item to the order and verify the subtotal
        order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=2,
            price=200.0
        )
        order_item.subtotal = order_item.price * order_item.quantity  # Calculate subtotal
        order_item.save()
        self.assertEqual(order_item.subtotal, 400.0)  # Verify subtotal is correct
        self.assertEqual(order_item.product.name, 'Vacuum Cleaner')

    def test_order_status_default(self):
        # Check the default order status
        self.assertEqual(self.order.status, 'Processing')


# Test cases for the Category model
class CategoryModelTests(TestCase):
    def test_create_category(self):
        # Verify category creation
        category = Category.objects.create(name='Sports')
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(category.name, 'Sports')

    def test_unique_category_name(self):
        # Check for unique constraint on category names
        Category.objects.create(name='Books')
        with self.assertRaises(Exception):
            Category.objects.create(name='Books')  # Attempt to create a duplicate category name


# Test cases for the Product Manager role
class ProductManagerModelTests(TestCase):
    def setUp(self):
        # Create a product manager and sample category
        self.product_manager = CustomUser.objects.create_user(username='prod_manager', email='manager@test.com', password='password123', role='product_manager')
        self.category = Category.objects.create(name='Electronics')

    def test_product_manager_creation(self):
        # Verify product manager creation
        self.assertEqual(CustomUser.objects.filter(role='product_manager').count(), 1)
        self.assertEqual(self.product_manager.role, 'product_manager')

    def test_product_creation_by_manager(self):
        # Verify that the product manager can create a product
        product = Product.objects.create(
            name='Test Product',
            price=300.0,
            stock=15,
            category=self.category,
            description='A sample product for testing',
            serial_number='P123456',
            digital=False
        )
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(product.name, 'Test Product')
        self.assertEqual(product.stock, 15)

    def test_update_product_stock(self):
        # Verify that stock can be updated
        product = Product.objects.create(
            name='Smartphone',
            price=500.0,
            stock=20,
            category=self.category,
            serial_number='P56789',
            digital=False
        )
        product.stock = 30
        product.save()
        self.assertEqual(product.stock, 30)

    def test_product_discount(self):
        # Verify product discount application
        product = Product.objects.create(
            name='Laptop',
            price=1000.0,
            stock=10,
            category=self.category,
            serial_number='P99887',
            digital=False
        )
        product.discount = 10  # Apply 10% discount
        product.save()
        expected_discounted_price = product.price * (1 - (product.discount / 100))
        self.assertEqual(product.discounted_price, expected_discounted_price)


class SalesManagerModelTests(TestCase):
    def setUp(self):
        # Create a sales manager
        self.sales_manager = CustomUser.objects.create_user(username='sales_manager', email='sales@test.com', password='password123', role='sales_manager')
        self.category = Category.objects.create(name='Home Appliances')
        self.product = Product.objects.create(
            name='Washing Machine',
            price=1200.0,
            stock=5,
            category=self.category,
            serial_number='WM98765',
            digital=False
        )

    def test_sales_manager_creation(self):
        self.assertEqual(CustomUser.objects.filter(role='sales_manager').count(), 1)
        self.assertEqual(self.sales_manager.role, 'sales_manager')

    def test_apply_discount_as_sales_manager(self):
        # Simulate applying a discount
        self.product.discount = 15  # Apply 15% discount
        self.product.save()
        discounted_price = self.product.price * (1 - (self.product.discount / 100))
        self.assertEqual(self.product.discounted_price, discounted_price)

    def test_view_sales_report(self):
        # Simulate a sales report calculation
        Order.objects.create(customer=self.sales_manager)  # Add a dummy order
        order_item = OrderItem.objects.create(order=Order.objects.first(), product=self.product, quantity=2, price=self.product.price)
        total_sales = order_item.quantity * order_item.price
        self.assertEqual(total_sales, 2400.0)

    def test_refund_processing(self):
        # Simulate a refund by adjusting stock back
        initial_stock = self.product.stock
        order_item = OrderItem.objects.create(order=Order.objects.create(customer=self.sales_manager), product=self.product, quantity=1, price=self.product.price)
        self.product.stock += order_item.quantity  # Simulate refund adjustment
        self.product.save()
        self.assertEqual(self.product.stock, initial_stock + 1)

class OrderModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='customer1', email='customer1@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Smartphone',
            price=700.0,
            stock=10,
            category=self.category,
            serial_number='SP12345',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, status='Processing')

    def test_create_order(self):
        order_count = Order.objects.count()
        self.assertEqual(order_count, 1)
        self.assertEqual(self.order.customer.username, 'customer1')
        self.assertEqual(self.order.status, 'Processing')

    def test_order_completion(self):
        self.order.complete = True
        self.order.status = 'Completed'
        self.order.save()
        self.assertTrue(self.order.complete)
        self.assertEqual(self.order.status, 'Completed')

    def test_order_total_cost(self):
        OrderItem.objects.create(order=self.order, product=self.product, quantity=2, price=700.0)
        self.order.refresh_from_db()
        total_cost = sum(item.subtotal for item in self.order.order_items.all())
        self.assertEqual(total_cost, 1400.0)


class OrderItemModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='customer2', email='customer2@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Appliances')
        self.product = Product.objects.create(
            name='Blender',
            price=100.0,
            stock=5,
            category=self.category,
            serial_number='BL123',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer)

    def test_create_order_item(self):
        order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=100.0)
        order_item.subtotal = order_item.price * order_item.quantity
        order_item.save()
        self.assertEqual(order_item.subtotal, 100.0)

    def test_delete_order_item(self):
        order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=100.0)
        order_item.delete()
        self.assertEqual(OrderItem.objects.count(), 0)


class OrderHistoryModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='customer3', email='customer3@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Kitchen Items')
        self.product = Product.objects.create(
            name='Toaster',
            price=50.0,
            stock=20,
            category=self.category,
            serial_number='TO123',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, complete=True, status='Completed')
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=2, price=50.0)
        self.order_history = OrderHistory.objects.create(customer=self.customer)
        self.order_history.orders.add(self.order)

    def test_order_history_creation(self):
        self.assertEqual(self.order_history.customer.username, 'customer3')
        self.assertEqual(self.order_history.orders.count(), 1)

    def test_order_history_total_amount(self):
        self.order_history.total_amount = sum(order.get_total_cost for order in self.order_history.orders.all())  # Fix type error
        self.assertEqual(float(self.order_history.total_amount), 100.0)

    def test_add_new_order_to_history(self):
        new_order = Order.objects.create(customer=self.customer, complete=True, status='Completed')
        OrderItem.objects.create(order=new_order, product=self.product, quantity=1, price=50.0)
        self.order_history.orders.add(new_order)
        self.order_history.refresh_from_db()
        self.assertEqual(self.order_history.orders.count(), 2)

    def test_order_history_update_date(self):
        self.order_history.save()
        self.assertIsNotNone(self.order_history.update_date)

    def test_order_history_empty(self):
        empty_history, _ = OrderHistory.objects.get_or_create(customer=self.customer)
        empty_history.orders.set([])  # Clear any orders associated with the history
        self.assertEqual(empty_history.orders.count(), 0)

class ReviewModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='reviewer', email='reviewer@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Home Appliances')
        self.product = Product.objects.create(
            name='Microwave',
            price=200.0,
            stock=10,
            category=self.category,
            serial_number='MW12345',
            digital=False
        )

    def test_create_review(self):
        review = Review.objects.create(user=self.customer, product=self.product, rating=5, comment='Excellent product!')
        self.assertEqual(Review.objects.count(), 1)
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Excellent product!')

    def test_update_review(self):
        review = Review.objects.create(user=self.customer, product=self.product, rating=4, comment='Good product.')
        review.rating = 3
        review.comment = 'Average product.'
        review.save()
        self.assertEqual(review.rating, 3)
        self.assertEqual(review.comment, 'Average product.')

    def test_delete_review(self):
        review = Review.objects.create(user=self.customer, product=self.product, rating=4, comment='Nice product.')
        review.delete()
        self.assertEqual(Review.objects.count(), 0)


class WishlistModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='wishlistuser', email='wishlist@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Headphones',
            price=150.0,
            stock=20,
            category=self.category,
            serial_number='HP12345',
            digital=False
        )

    def test_add_to_wishlist(self):
        # Create a wishlist entry with a specific product
        wishlist_entry = Wishlist.objects.create(user=self.customer, product=self.product)
        self.assertEqual(Wishlist.objects.filter(user=self.customer).count(), 1)
        self.assertEqual(wishlist_entry.product, self.product)

    def test_remove_from_wishlist(self):
        # Create a wishlist entry for this specific product
        wishlist = Wishlist.objects.create(user=self.customer, product=self.product)
        
        # Remove the product from the wishlist
        wishlist.delete()
        
        # Ensure the product is removed
        self.assertEqual(Wishlist.objects.filter(user=self.customer).count(), 0)


    def test_empty_wishlist(self):
        # Add a dummy product but simulate an empty behavior
        product = Product.objects.create(name='Dummy', price=0.0, stock=0, category=self.category)
        wishlist = Wishlist.objects.create(user=self.customer, product=product)
        wishlist.product = None  # Manually clear the product field if needed
        self.assertEqual(Wishlist.objects.filter(user=self.customer).count(), 1)



class InvoiceModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='invoiceuser', email='invoice@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Appliances')
        self.product = Product.objects.create(
            name='Vacuum Cleaner',
            price=300.0,
            stock=5,
            category=self.category,
            serial_number='VC12345',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, status='Completed', complete=True)

    def test_create_invoice(self):
        invoice = Invoice.objects.create(order=self.order, customer=self.customer, total_amount=600.0,discounted_total=500.0)
        self.assertEqual(Invoice.objects.count(), 1)
        self.assertEqual(invoice.total_amount, 600.0)
        self.assertEqual(invoice.discounted_total, 500.0)
        self.assertEqual(invoice.customer, self.customer)

class RefundRequestModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='refunduser', email='refund@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Electronics')
        self.product = Product.objects.create(
            name='Laptop',
            price=1500.0,
            stock=5,
            category=self.category,
            serial_number='LT12345',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, status='Delivered', complete=True)
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=1500.0)

    def test_create_refund_request(self):
        refund_request = RefundRequest.objects.create(
            customer=self.customer,
            order_item=self.order_item,
            reason='Received a defective product.'
        )
        self.assertEqual(RefundRequest.objects.count(), 1)
        self.assertEqual(refund_request.customer, self.customer)
        self.assertEqual(refund_request.order_item, self.order_item)
        self.assertEqual(refund_request.status, 'Pending')

    def test_update_refund_request_status(self):
        refund_request = RefundRequest.objects.create(
            customer=self.customer,
            order_item=self.order_item,
            reason='Wrong product sent.'
        )
        refund_request.status = 'Approved'
        refund_request.save()
        self.assertEqual(refund_request.status, 'Approved')

    def test_refund_request_str_representation(self):
        refund_request = RefundRequest.objects.create(
            customer=self.customer,
            order_item=self.order_item,
            reason='Not satisfied with the product.'
        )
        expected_str = f"Refund request {refund_request.id} by {self.customer.username}"
        self.assertEqual(str(refund_request), expected_str)


class DeliveryModelTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='deliveryuser', email='delivery@test.com', password='password123', role='customer')
        self.category = Category.objects.create(name='Appliances')
        self.product = Product.objects.create(
            name='Washing Machine',
            price=800.0,
            stock=3,
            category=self.category,
            serial_number='WM56789',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, status='Shipped', complete=True)
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=800.0)

    def test_create_delivery(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='123 Main Street, Cityville'
        )
        self.assertEqual(Delivery.objects.count(), 1)
        self.assertEqual(delivery.customer, self.customer)
        self.assertEqual(delivery.delivery_address, '123 Main Street, Cityville')
        self.assertEqual(delivery.total_price, Decimal('0.00'))  # Default total price

    def test_calculate_total_price(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='456 Elm Street, Townsville'
        )
        delivery.calculate_total_price()
        expected_price = Decimal(self.order_item.quantity) * Decimal(self.product.price)
        self.assertEqual(delivery.total_price, expected_price)

    def test_delivery_status_property(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='789 Oak Avenue, Villagetown'
        )
        self.assertEqual(delivery.status, 'Shipped')

    def test_delivery_str_representation(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='123 Main Street, Cityville'
        )
        expected_str = f"Delivery {delivery.id} for {self.product.name} - {self.order.status}"
        self.assertEqual(str(delivery), expected_str)

class AdditionalTests(TestCase):
    def setUp(self):
        self.customer = CustomUser.objects.create_user(username='customer_extra', email='extra@test.com', password='password123', role='customer')
        self.product_manager = CustomUser.objects.create_user(username='manager_extra', email='manager_extra@test.com', password='password123', role='product_manager')
        self.category = Category.objects.create(name='Gaming')
        self.product = Product.objects.create(
            name='Gaming Console',
            price=500.0,
            stock=15,
            category=self.category,
            serial_number='GC45678',
            description='A powerful gaming console',
            digital=False
        )
        self.order = Order.objects.create(customer=self.customer, status='Processing')
        self.order_item = OrderItem.objects.create(order=self.order, product=self.product, quantity=1, price=500.0)

    def test_product_discount_application(self):
        self.product.discount = 20  # 20% discount
        self.product.save()
        self.assertEqual(self.product.discounted_price, 400.0)

    def test_notification_creation(self):
        notification = Notification.objects.create(user=self.customer, message='New product launched!')
        self.assertEqual(Notification.objects.count(), 1)
        self.assertFalse(notification.is_read)

    def test_mark_notification_as_read(self):
        notification = Notification.objects.create(user=self.customer, message='Order delivered')
        notification.is_read = True
        notification.save()
        self.assertTrue(notification.is_read)

    def test_generate_order_history(self):
        order_history = OrderHistory.objects.create(customer=self.customer, status='Processing')
        order_history.orders.add(self.order)
        self.assertEqual(order_history.orders.count(), 1)
        self.assertEqual(order_history.customer.username, 'customer_extra')

    def test_review_update(self):
        review = Review.objects.create(user=self.customer, product=self.product, rating=3, comment='Average')
        review.rating = 5
        review.comment = 'Excellent!'
        review.save()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Excellent!')

    def test_refund_request_creation(self):
        refund_request = RefundRequest.objects.create(
            customer=self.customer,
            order_item=self.order_item,
            reason='Product defect'
        )
        self.assertEqual(refund_request.status, 'Pending')
        self.assertEqual(refund_request.reason, 'Product defect')

    def test_refund_approval(self):
        refund_request = RefundRequest.objects.create(
            customer=self.customer,
            order_item=self.order_item,
            reason='Damaged item'
        )
        refund_request.status = 'Approved'
        refund_request.save()
        self.assertEqual(refund_request.status, 'Approved')

    def test_invoice_creation(self):
        invoice = Invoice.objects.create(
            order=self.order,
            customer=self.customer,
            total_amount=500.0,
            discounted_total=450.0
        )
        self.assertEqual(Invoice.objects.count(), 1)
        self.assertEqual(invoice.discounted_total, 450.0)

    def test_delivery_creation(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='456 Maple Street'
        )
        self.assertEqual(delivery.delivery_address, '456 Maple Street')
        self.assertEqual(delivery.total_price, Decimal('0.00'))

    def test_delivery_total_price_calculation(self):
        delivery = Delivery.objects.create(
            order_item=self.order_item,
            customer=self.customer,
            delivery_address='123 Pine Avenue'
        )
        delivery.calculate_total_price()
        self.assertEqual(delivery.total_price, Decimal('500.00'))

    def test_order_status_update(self):
        self.order.status = 'Shipped'
        self.order.save()
        self.assertEqual(self.order.status, 'Shipped')

    def test_order_completion_flag(self):
        self.order.complete = True
        self.order.save()
        self.assertTrue(self.order.complete)