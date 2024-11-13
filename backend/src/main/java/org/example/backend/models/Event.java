package org.example.backend.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Event {
    private int id;
    private String title;
    private String location;
    private String date;
    private String time;
    private List<String> involvedUsers;
    private List<List<String>> tasks;
    private String admin;
}