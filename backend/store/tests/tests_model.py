from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
from store.models import (
    CustomUser, Product, Order, OrderItem, Review, Wishlist, Category
)


class CustomUserTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
            role="customer"
        )

    def test_create_user(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "testuser@example.com")

    def test_user_role_default(self):
        new_user = CustomUser.objects.create_user(
            username="defaultuser", email="defaultuser@example.com", password="password123"
        )
        self.assertEqual(new_user.role, "customer")

    def test_create_superuser(self):
        admin = CustomUser.objects.create_superuser(
            username="adminuser", email="admin@example.com", password="adminpass123"
        )
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)

    def test_get_user_by_email(self):
        user = CustomUser.objects.get_user_by_email("testuser@example.com")
        self.assertEqual(user.username, "testuser")

    def test_get_user_by_username(self):
        user = CustomUser.objects.get_user_by_username("testuser")
        self.assertEqual(user.email, "testuser@example.com")


class ProductTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Test Product",
            price=100.00,
            discount=10.0,
            stock=10,
            category="Electronics"
        )

    def test_discounted_price(self):
        self.assertAlmostEqual(self.product.discounted_price, 90.0, places=2)

    def test_no_discount(self):
        self.product.discount = 0
        self.assertEqual(self.product.discounted_price, 100.00)

    def test_stock_availability(self):
        self.assertEqual(self.product.stock, 10)

    def test_category_assignment(self):
        self.assertEqual(self.product.category, "Electronics")


class OrderTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
            role="customer"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=100.00,
            stock=10
        )
        self.order = Order.objects.create(customer=self.user, complete=False)
        self.order_item = OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=2,
            price=100.00,
            subtotal=200.00
        )

    def test_get_total_cost(self):
        self.assertEqual(self.order.get_total_cost, 200.00)

    def test_order_status(self):
        self.assertEqual(self.order.status, "Pending")

    def test_order_completion(self):
        self.order.complete = True
        self.assertTrue(self.order.complete)


class ReviewTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="reviewuser",
            email="reviewuser@example.com",
            password="password123",
            role="customer"
        )
        self.product = Product.objects.create(
            name="Test Product",
            price=50.00,
            stock=5
        )
        self.review = Review.objects.create(
            user=self.user,
            product=self.product,
            rating=4,
            comment="Great product!",
        )

    def test_review_creation(self):
        self.assertEqual(self.review.rating, 4)
        self.assertEqual(self.review.comment, "Great product!")

    def test_review_rating_bounds(self):
        with self.assertRaises(ValueError):
            Review.objects.create(user=self.user, product=self.product, rating=6)

    def test_review_product_association(self):
        self.assertEqual(self.review.product, self.product)


class WishlistTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="wishlistuser",
            email="wishlistuser@example.com",
            password="password123",
            role="customer"
        )
        self.product = Product.objects.create(
            name="Wishlist Product",
            price=75.00,
            stock=15
        )
        self.wishlist = Wishlist.objects.create(
            user=self.user,
            product=self.product
        )

    def test_wishlist_creation(self):
        self.assertEqual(self.wishlist.user, self.user)
        self.assertEqual(self.wishlist.product, self.product)

    def test_duplicate_wishlist(self):
        with self.assertRaises(Exception):
            Wishlist.objects.create(user=self.user, product=self.product)


class CategoryTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics")

    def test_category_creation(self):
        self.assertEqual(self.category.name, "Electronics")

    def test_unique_category(self):
        with self.assertRaises(Exception):
            Category.objects.create(name="Electronics")


class OrderRevenueTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username="revenueuser",
            email="revenueuser@example.com",
            password="password123",
            role="customer"
        )
        self.product1 = Product.objects.create(name="Product 1", price=100.00, stock=10)
        self.product2 = Product.objects.create(name="Product 2", price=200.00, stock=5)
        self.order = Order.objects.create(customer=self.user, complete=True)
        OrderItem.objects.create(order=self.order, product=self.product1, quantity=2, price=100.00, subtotal=200.00)
        OrderItem.objects.create(order=self.order, product=self.product2, quantity=1, price=200.00, subtotal=200.00)

    def test_revenue_calculation(self):
        start_date = timezone.now() - timezone.timedelta(days=7)
        end_date = timezone.now()
        revenue = Order.calculate_revenue(start_date, end_date)
        self.assertEqual(revenue, 400.00)

    def test_profit_or_loss_calculation(self):
        start_date = timezone.now() - timezone.timedelta(days=7)
        end_date = timezone.now()
        profit_or_loss = Order.calculate_profit_or_loss(start_date, end_date)
        self.assertEqual(profit_or_loss, 400.00)  # Assuming cost is equal to price


