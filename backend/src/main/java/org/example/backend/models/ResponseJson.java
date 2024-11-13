package org.example.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
public class ResponseJson {
    private int code;
    private boolean success;
    private String message;
    private String jwtToken;
    private List<String> allowedUsers;
    private Event event;

    public ResponseJson(int code, boolean success, String message, String jwtToken, List<String> allowedUsers) {
        this.code = code;
        this.success = success;
        this.message = message;
        this.jwtToken = jwtToken;
        this.allowedUsers = allowedUsers;
    }
    public ResponseJson(int code, boolean success, String message, String jwtToken) {
        this.code = code;
        this.success = success;
        this.message = message;
        this.jwtToken = jwtToken;
    }
    public ResponseJson(int code, boolean success, String message) {
        this.code = code;
        this.success = success;
        this.message = message;
    }
}
