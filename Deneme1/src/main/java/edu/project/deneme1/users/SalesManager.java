package edu.project.deneme1.users;

import edu.project.deneme1.product.Product;
import jakarta.annotation.sql.DataSourceDefinitions;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class SalesManager extends User {

    private String shopName;
    private String shopAddress;
    private String shopCity;

    private List<Product> products;
}
