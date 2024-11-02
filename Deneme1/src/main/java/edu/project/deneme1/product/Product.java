package edu.project.deneme1.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    private int id;
    private String name;
    private double price;
    private int stock;
    private int sold;

    public void sold(){
        sold++;
        stock--;
    }
}
