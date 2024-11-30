package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.Document;
import org.example.backend.configs.JwtUtil;
import org.example.backend.models.ChangePasswordRequestDto;
import org.example.backend.models.ResponseJson;
import org.example.backend.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCrypt;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserControllers {
    @Autowired
    private JwtUtil jwtUtil;

    @Value("${DB_URL}")
    private String DB_URL;

    @GetMapping("/getToken")
    public ResponseJson someEndpoint(@CookieValue(name = "token", required = false) String token) {
        if (token != null) {
            return new ResponseJson(200, true, "Token found", token);
        }
        return ResponseJson.builder().code(404).success(false).message("Token not found").build();
    }

    @GetMapping("/logout")
    public ResponseJson logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return ResponseJson.builder().code(200).success(true).message("Logged out").build();
    }

    @GetMapping("/find/{username}")
    public ResponseJson responseJson(@PathVariable String username){
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
    public ResponseJson register(@RequestBody User userForm) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        try {
            String salt = BCrypt.gensalt(10);
            String hashedPassword = BCrypt.hashpw(userForm.getPassword(), salt);
            Document user = new Document("username", userForm.getUsername())
                    .append("password", hashedPassword);
            String accountCreationDate = new java.util.Date().toString();
            user.append("accountCreationDate", accountCreationDate);
            userCollection.insertOne(user);
           return new ResponseJson(200, true, "User inserted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseJson(404, false, "User insertion failed");
        }
    }

    @PutMapping("/changePassword")
    public ResponseJson changePassword(@RequestBody ChangePasswordRequestDto changePasswordRequestDto) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        Document user = userCollection.find(new Document("username", changePasswordRequestDto.getUsername())).first();
        if(user == null) {
            return new ResponseJson(404, false, "User not found");
        }
        String hashedPassword = user.getString("password");
        if (BCrypt.checkpw(changePasswordRequestDto.getOldPassword(), hashedPassword)) {
            String salt = BCrypt.gensalt(10);
            String newHashedPassword = BCrypt.hashpw(changePasswordRequestDto.getNewPassword(), salt);
            userCollection.updateOne(new Document("username", changePasswordRequestDto.getUsername()), new Document("$set", new Document("password", newHashedPassword)));
            return new ResponseJson(200, true, "Password changed successfully");
        } else {
            return new ResponseJson(404, false, "Password change failed");
        }
    }

    @DeleteMapping("/delete/{username}")
    public ResponseJson deleteUser(@PathVariable String username) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> userCollection = database.getCollection("users");
        try {
            Document user = userCollection.find(new Document("username", username)).first();
            if(user == null) {
                return ResponseJson.builder().code(404).success(false).message("User not found").build();
            }
            userCollection.deleteOne(new Document("username", username));
        } catch (Exception e) {
            return ResponseJson.builder().code(404).success(false).message(e.getMessage()).build();
        }
        MongoCollection<Document> eventCollection = database.getCollection("events");
        try {
            for (Document event : eventCollection.find()) {
                boolean userExists = false;
                if (event.getString("admin").equals(username)) {
                    List<String> involvedUsers = event.getList("involvedUsers", String.class);
                    if (involvedUsers == null) {
                        userExists = true;
                        eventCollection.deleteOne(new Document("admin", username));
                    } else {
                        String newAdmin = null;
                        while (newAdmin == null) {
                            for (String involvedUser : involvedUsers) {
                                if (!involvedUser.equals(username)) {
                                    newAdmin = involvedUser;
                                    break;
                                }
                            }
                        }
                        eventCollection.updateOne(new Document("admin", username), new Document("$set", new Document("admin", newAdmin)));
                    }
                }

                if (!userExists) {
                    List<String> involvedUsers = event.getList("involvedUsers", String.class);
                    List<String> newInvolvedUsers = null;
                    for (String involvedUser : involvedUsers) {
                        if (!involvedUser.equals(username)) {
                            newInvolvedUsers.add(involvedUser);
                        }
                    }
                    eventCollection.updateOne(new Document("involvedUsers", event.get("involvedUsers")), new Document("$set", new Document("involvedUsers", newInvolvedUsers)));

                    List<List<String>> tasks = (List<List<String>>) (List<?>) event.get("tasks");
                    List<List<String>> newTasks = null;
                    for (List<String> task : tasks) {
                        if (!task.get(3).equals(username)) {
                            newTasks.add(task);
                        }
                    }
                    eventCollection.updateOne(new Document("tasks", event.get("tasks")), new Document("$set", new Document("tasks", newTasks)));
                }
            }
        } catch (Exception e) {
            return ResponseJson.builder().code(404).success(false).message(e.getMessage()).build();
        }
        return ResponseJson.builder().code(200).success(true).message("User deleted successfully").build();
    }
}
