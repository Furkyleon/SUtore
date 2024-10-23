package edu.project.deneme1.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String name;
    private String lastname;
    private String email;
    private String phone;
    private String password;

}
