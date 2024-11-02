package edu.project.deneme1.ordersystem;

import edu.project.deneme1.product.Product;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
public class ShoppingCart {

    private List<Product> productsAdded = new ArrayList<>();

    public void addToCart(Product product) {
        productsAdded.add(product);
    }
}
