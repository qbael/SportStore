package com.sport_store.backend.utils;

import java.text.Normalizer;
import java.util.Objects;

public class HashingName {
    public static String generateImageName(String productName, String originalFileName) {
        String extension = Objects.requireNonNull(originalFileName)
                .substring(originalFileName.lastIndexOf("."));
        String noDiacritics = normalizeString(productName);

        String slug = noDiacritics.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "_");

        return slug + extension;
    }

    public static String normalizeString(String str){
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }


}
