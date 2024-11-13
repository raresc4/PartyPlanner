package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.Document;
import org.example.backend.configs.JwtUtil;
import org.example.backend.models.ResponseJson;
import org.example.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCrypt;

import org.example.backend.configs.GetProperties;
@RestController
@RequestMapping("/user")
public class UserControllers {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private GetProperties getProperties;

    @GetMapping("/getToken")
    public ResponseJson someEndpoint(@CookieValue(name = "token", required = false) String token) {
        if (token != null) {
            return new ResponseJson(200, true, "Token found", token);
        }
        return new ResponseJson(404, false, "Token not found",null);
    }

    @GetMapping("/logout")
    public ResponseJson logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return new ResponseJson(200, true, "Logged out", null);
    }

    @GetMapping("/find/{username}")
    public ResponseJson responseJson(@PathVariable String username){
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        Document user = userCollection.find(new Document("username", username)).first();
        if (user != null) {
            return new ResponseJson(200, true, "User found");
        } else {
            return new ResponseJson(404, false, "User not found");
        }
    }

    @PostMapping("/login")
    public ResponseJson login(@RequestBody User userForm, HttpServletResponse response) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        Document user = userCollection.find(new Document("username", userForm.getUsername())).first();
        if (user != null) {
            String hashedPassword = user.getString("password");
            if (BCrypt.checkpw(userForm.getPassword(), hashedPassword)) {
                String token = jwtUtil.getToken(userForm.getUsername());
                System.out.println(userForm.getUsername());
                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly(true);
                cookie.setPath("/");
                cookie.setSecure(true);
                response.addCookie(cookie);
                return new ResponseJson(200, true, "Login successful", token);
            } else {
                return new ResponseJson(404, false, "Login failed");
            }
        } else {
            return new ResponseJson(404, false, "User not found");
        }
    }

    @PostMapping("/register")
    public ResponseJson getUserInfo(@RequestBody User userForm) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        try {
            String salt = BCrypt.gensalt(10);
            String hashedPassword = BCrypt.hashpw(userForm.getPassword(), salt);
            Document user = new Document("username", userForm.getUsername())
                    .append("password", hashedPassword);
            userCollection.insertOne(user);
           return new ResponseJson(200, true, "User inserted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseJson(404, false, "User insertion failed");
        }
    }
}
