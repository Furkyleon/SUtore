package edu.project.deneme1.users;

import edu.project.deneme1.product.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class ProductManager extends User {

    private Product product;

}
