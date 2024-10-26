package org.example.backend.configs;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import com.mongodb.client.MongoCollection;
import org.bson.Document;
import org.example.backend.models.User;

public class DatabaseConfig {
    public static MongoDatabase connectToMongoDB() {
        MongoClient mongoClient = null;
        MongoDatabase database = null;
        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("src/main/resources/application.properties"));
            String DB_URL = prop.getProperty("DB_URL");
            mongoClient = MongoClients.create(DB_URL);
            database = mongoClient.getDatabase("CoolCluster");
            return database;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
