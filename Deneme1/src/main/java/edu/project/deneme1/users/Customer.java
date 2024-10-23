package edu.project.deneme1.users;

import edu.project.deneme1.ordersystem.ShoppingCart;
import edu.project.deneme1.product.Review;
import edu.project.deneme1.ordersystem.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

    private ShoppingCart shopCart;
    private List<Order> orders;
    private List<Review> reviews;

}
