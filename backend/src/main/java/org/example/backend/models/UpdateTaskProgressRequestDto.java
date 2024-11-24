package org.example.backend.models;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Data
@Getter
public class UpdateTaskProgressRequestDto {
    private String roomName;
    private String taskName;
    private String progress;
}
