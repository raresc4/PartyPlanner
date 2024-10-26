package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.Document;
import org.example.backend.configs.DatabaseConfig;
import org.example.backend.configs.JwtUtil;
import org.example.backend.models.ResponseJson;
import org.example.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCrypt;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.example.backend.configs.GetProperties;
@RestController
@RequestMapping("/user")
public class UserControllers {
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/find/{username}")
    public ResponseJson responseJson(@PathVariable String username){
        String DB_URL = GetProperties.getURL();
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
    private String getToken(String username) {
        String secretKey = GetProperties.getTokenSecret();
        Map<String, Object> claims = new HashMap<>();
        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject("rares")
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                    .signWith(SignatureAlgorithm.HS256, secretKey)
                    .compact();
        } catch (Exception e) {
            e.printStackTrace();
            return "Error generating token";
        }
    }

    @PostMapping("/login")
    public ResponseJson login(@RequestBody User userForm, HttpServletResponse response) {
        String DB_URL = GetProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        Document user = userCollection.find(new Document("username", userForm.getUsername())).first();
        if (user != null) {
            String hashedPassword = user.getString("password");
            if (BCrypt.checkpw(userForm.getPassword(), hashedPassword)) {
                String token = jwtUtil.getToken(userForm.getUsername());
                Cookie cookie = new Cookie("token", token);
                cookie.setHttpOnly(true); // Prevents JavaScript access to the cookie
                cookie.setPath("/"); // Set the path for the cookie (accessible in the whole application)
                cookie.setSecure(true); // Set to true if using HTTPS
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
        String DB_URL = GetProperties.getURL();
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
