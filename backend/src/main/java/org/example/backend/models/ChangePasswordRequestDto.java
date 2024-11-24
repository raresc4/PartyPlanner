package org.example.backend.models;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Data
@Getter
public class ChangePasswordRequestDto {
    private String username;
    private String oldPassword;
    private String newPassword;
}
