package edu.project.deneme1.users;

import edu.project.deneme1.database.Database;
import edu.project.deneme1.ordersystem.ShoppingCart;
import edu.project.deneme1.product.Product;
import edu.project.deneme1.product.Review;
import edu.project.deneme1.ordersystem.Order;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Objects;

@RestController
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {
    @Autowired
    private Database productRepository;

    private ShoppingCart shopCart = new ShoppingCart();
    private List<Order> orders;
    private List<Review> reviews;

    @GetMapping("/buy/{name}")
    public void buyProduct(@PathVariable("name") String productName) {
        List<Product> products = productRepository.findAll();

        for (Product product : products) {
            if (Objects.equals(product.getName(), productName)) {
                shopCart.addToCart(product);
                product.sold();
            }
        }
    }
}