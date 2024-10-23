package edu.project.deneme1.product;

import edu.project.deneme1.database.Database;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    private int id;
    private String name;
    private double price;
    private int quantity;
    private int sold;

    public void sold(){
        sold++;
        quantity--;
    }
}
