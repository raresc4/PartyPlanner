package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.example.backend.configs.DatabaseConfig;
import org.example.backend.models.ResponseJson;
import org.example.backend.models.User;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import org.example.backend.configs.GetProperties;
@RestController
@RequestMapping("/user")
public class UserControllers {

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

    @PostMapping("/register")
    public ResponseJson getUserInfo(@RequestBody User userForm) {
        String DB_URL = GetProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        Document user = new Document("username", userForm.getUsername())
                .append("password", userForm.getPassword());
        try {
            userCollection.insertOne(user);
           return new ResponseJson(200, true, "User inserted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseJson(404, false, "User insertion failed");
        }
    }
}
