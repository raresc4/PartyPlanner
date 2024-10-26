package org.example.backend.data;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.example.backend.configs.GetProperties;
import org.example.backend.models.Event;
import org.example.backend.models.ResponseJson;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/events")
public class EventController {
    @PostMapping("/createEvent")
    public ResponseJson createEvent(@RequestBody Event event) {
        String DB_URL = GetProperties.getURL();
        MongoClient mongoClient = MongoClients.create(DB_URL);
        MongoDatabase database = mongoClient.getDatabase("CoolCluster");
        try {
            MongoCollection<Document> eventsCollection = database.getCollection("events");
            Document eventDocument = new Document("title", event.getTitle())
                    .append("involvedUsers", event.getInvolvedUsers())
                    .append("tasks", event.getTasks());
            eventsCollection.insertOne(eventDocument);
            return new ResponseJson(200, true, "Event created");
        } catch (Exception e) {
            return new ResponseJson(404, false, "Failed to create event");
        }
    }
}
