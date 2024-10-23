package edu.project.deneme1.product;

import edu.project.deneme1.users.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    private int id;
    private User author;
    private Product product;
    private String title;
    private String content;
    private int star;
    private int score;

}
