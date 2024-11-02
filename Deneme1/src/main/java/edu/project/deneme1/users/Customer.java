package edu.project.deneme1.users;

import edu.project.deneme1.ordersystem.ShoppingCart;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RestController;


@RestController
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends User {

    private ShoppingCart shopCart = new ShoppingCart();
}