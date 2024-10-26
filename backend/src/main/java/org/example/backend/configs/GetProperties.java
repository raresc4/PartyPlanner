package org.example.backend.configs;

import java.io.FileInputStream;
import java.util.Properties;

public class GetProperties {
    public static String getURL() {
        Properties prop = new Properties();
        try {
            prop.load(new FileInputStream("src/main/resources/application.properties"));
            String DB_URL = prop.getProperty("DB_URL");
            return DB_URL;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
