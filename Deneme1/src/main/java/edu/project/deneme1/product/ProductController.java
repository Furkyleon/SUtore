package edu.project.deneme1.product;

import edu.project.deneme1.database.Database;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProductController {
    @Autowired
    private Database productRepository;

    @GetMapping("/addproduct/{id}/{name}/{price}/{quantity}/{sold}")
    public void addProduct(@PathVariable("id") int id,
                           @PathVariable("name") String name,
                           @PathVariable("price") double price,
                           @PathVariable("quantity") int quantity,
                           @PathVariable("sold") int sold)
    {
        Product product = new Product(id, name, price, quantity, sold);
        productRepository.save(product);
    }

    @GetMapping("/listproducts")
    public List<Product> listProducts()
    {
        List<Product> products = productRepository.findAll();
        return products;
    }
}
