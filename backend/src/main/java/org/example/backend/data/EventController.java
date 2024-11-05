package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.example.backend.configs.GetProperties;
import org.example.backend.models.Event;
import org.example.backend.models.ResponseJson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    private GetProperties getProperties;

    @GetMapping("/getAdmin/{id}")
    public ResponseJson getAdmin(@PathVariable int id) {
        try {
            String DB_URL = getProperties.getURL();
            MongoClient mongoClient = MongoClients.create(DB_URL);
            MongoDatabase database = mongoClient.getDatabase("CoolCluster");
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document event = eventsCollection.find(new Document("id", id)).first();
            if (event != null) {
                String admin = event.getString("admin");
                return new ResponseJson(200, true, admin);
            } else {
                return new ResponseJson(404, false, "Admin not found", null);
            }
        } catch (Exception e) {
            return new ResponseJson(500, false, "Failed to get admin", null);
        }
    }
    @PostMapping("/createEvent")
    public ResponseJson createEvent(@RequestBody Event event) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        try {
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document eventDocument = new Document("id", getEventCount() + 1)
                    .append("title", event.getTitle())
                    .append("involvedUsers", event.getInvolvedUsers())
                    .append("tasks", event.getTasks())
                    .append("admin", event.getAdmin())
                    .append("location", event.getLocation())
                    .append("date", event.getDate())
                    .append("time", event.getTime());
            eventsCollection.insertOne(eventDocument);
            return new ResponseJson(200, true, "Event created");
        } catch (Exception e) {
            return new ResponseJson(404, false, "Failed to create event");
        }
    }

    @GetMapping("/isEventReal/{id}")
    public ResponseJson isEventReal(@PathVariable int id) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("id", id)).first();
        if (event != null) {
            return new ResponseJson(200, true, "Event found");
        } else {
            return new ResponseJson(404, false, "Event not found");
        }
    }

    @GetMapping("/getUsers/{id}")
    public ResponseJson getAllowedUsers(@PathVariable int id) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("id", id)).first();

        if (event != null) {
            List<String> involvedUsers = event.getList("involvedUsers", String.class);
            String admin = event.getString("admin");
            involvedUsers.add(admin);
            if (involvedUsers != null) {
                return new ResponseJson(200, true, "Involved users found", null, involvedUsers);
            } else {
                return new ResponseJson(404, false, "Involved users not found", null);
            }
        } else {
            return new ResponseJson(404, false, "Event not found", null);
        }
    }

    @GetMapping("/getEvent/{id}")
    public ResponseJson getEvent(@PathVariable int id) {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("id", id)).first();
        if (event != null) {
            List<List<String>> tasks = (List<List<String>>) (List<?>) event.get("tasks");
            System.out.println(tasks);
            Event event1 = new Event(0,
                    event.getString("title"),
                    event.getString("location"),
                    event.getString("date"),
                    event.getString("time"),
                    event.getList("involvedUsers", String.class),
                    tasks,
                    event.getString("admin"));
            System.out.println(event1);
            return new ResponseJson(200, true, "Event found", null, null, event1);
        } else {
            return new ResponseJson(404, false, "Event not found", null);
        }
    }
    @GetMapping("/getCount")
    public long getEventCount() {
        String DB_URL = getProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        return eventsCollection.countDocuments();
    }

    @DeleteMapping("/deleteEvent/{id}")
    public ResponseJson deleteEvent(@PathVariable int id) {
        String DB_URL = getProperties.getURL();
        try {
            MongoClient mongoClient = MongoClients.create(DB_URL);
            MongoDatabase database = mongoClient.getDatabase("CoolCluster");
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document event = eventsCollection.find(new Document("id", id)).first();
            if (event != null) {
                eventsCollection.deleteOne(new Document("id", id));
                return new ResponseJson(200, true, "Event deleted");
            } else {
                return new ResponseJson(404, false, "Event not found");
            }
        } catch (Exception e) {
            return new ResponseJson(500, false, "Failed to delete event");
        }
    }
}
