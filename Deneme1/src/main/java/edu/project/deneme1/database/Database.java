package edu.project.deneme1.database;

import edu.project.deneme1.product.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface Database extends MongoRepository<Product, String> {

}
