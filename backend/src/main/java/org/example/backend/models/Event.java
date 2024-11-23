package org.example.backend.models;

import lombok.*;
import org.springframework.data.annotation.Id;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Event {
    @Id
    private int id;
    private String title;
    private String location;
    private String date;
    private String time;
    private List<String> involvedUsers;
    private List<List<String>> tasks;
    private String admin;
}