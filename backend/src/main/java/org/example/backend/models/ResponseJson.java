package org.example.backend.models;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ResponseJson {
    private int code;
    private boolean success;
    private String message;
    private String jwtToken;

    public ResponseJson(int code, boolean success, String message) {
        this.code = code;
        this.success = success;
        this.message = message;
    }
}
