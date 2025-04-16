package com.sport_store.backend.utils;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

public class Helper {
    public static Path getPath(String fileName) {
        String backendDir = System.getProperty("user.dir");
        Path rootDir = Paths.get(backendDir).getParent();
        return rootDir.resolve("DoAnPTTK/frontend/public/product").resolve(fileName);
    }
}
