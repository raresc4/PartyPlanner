package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.example.backend.models.Event;
import org.example.backend.models.MarkAsDoneRequestDto;
import org.example.backend.models.ResponseJson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {
    @Value("${DB_URL}")
    private String DB_URL;

    @GetMapping("/getAdmin/{name}")
    public ResponseJson getAdmin(@PathVariable String name) {
        try {
            MongoClient mongoClient = MongoClients.create(DB_URL);
            MongoDatabase database = mongoClient.getDatabase("CoolCluster");
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document event = eventsCollection.find(new Document("title", name)).first();
            System.out.println(name);
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
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        try {
        Document event1 = eventsCollection.find(new Document("title", event.getTitle())).first();
            if (event1 != null) {
                return new ResponseJson(404, false, "Event already exists");
            }
         } catch (Exception e) {
            return new ResponseJson(404, false, "Failed to create event");
        }
        try {
            Document eventDocument = new Document("title", event.getTitle())
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
    @GetMapping("/getUsers/{name}")
    public ResponseJson getAllowedUsers(@PathVariable String name) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("title", name)).first();
        if (event != null) {
            List<String> involvedUsers = event. getList("involvedUsers", String.class);
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

    @GetMapping("/getEvent/{name}")
    public ResponseJson getEvent(@PathVariable String name) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("title", name)).first();
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

    @GetMapping("/getUserEvents/{username}")
    public ResponseJson getUserEvents(@PathVariable String username) {
        return null;
    }

    @PostMapping("/markAsDone")
    public ResponseJson markAsDone(@RequestBody MarkAsDoneRequestDto markAsDoneRequestDto) {
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        MongoCollection<Document> eventsCollection = database.getCollection("events");
        Document event = eventsCollection.find(new Document("title", markAsDoneRequestDto.getRoomName())).first();
        if(event == null) {
            return new ResponseJson(404, false, "Event not found");
        }
        List<List<String>> tasks = (List<List<String>>) (List<?>) event.get("tasks");
        List<List<String>> newTasks = tasks;
        for( List<String> task : tasks) {
            if(task.get(0).equals(markAsDoneRequestDto.getTaskName())) {
                newTasks.remove(task);
            }
        }
        eventsCollection.updateOne(new Document("title", markAsDoneRequestDto.getRoomName()), new Document("$set", new Document("tasks", newTasks)));
        return new ResponseJson(200, true, "Task marked as done");
    }
    @DeleteMapping("/deleteEvent/{name}")
    public ResponseJson deleteEvent(@PathVariable String name) {
        try {
            MongoClient mongoClient = MongoClients.create(DB_URL);
            MongoDatabase database = mongoClient.getDatabase("CoolCluster");
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document event = eventsCollection.find(new Document("title", name)).first();
            if (event != null) {
                eventsCollection.deleteOne(new Document("title", name));
                return new ResponseJson(200, true, "Event deleted");
            } else {
                return new ResponseJson(404, false, "Event not found");
            }
        } catch (Exception e) {
            return new ResponseJson(500, false, "Failed to delete event");
        }
    }
}
