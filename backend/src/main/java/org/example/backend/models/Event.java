package org.example.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Event {
    private String title;
    private List<String> involvedUsers;
    private List<List<String>> tasks;
    private String admin;
}