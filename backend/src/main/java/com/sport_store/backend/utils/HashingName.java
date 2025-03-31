package com.sport_store.backend.utils;

import java.text.Normalizer;

public class HashingName {
    public static String generateImageName(String productName, String fileExtension) {
        String normalized = Normalizer.normalize(productName, Normalizer.Form.NFD);
        String noDiacritics = normalized.replaceAll("\\p{M}", "");

        String slug = noDiacritics.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "_");

        return slug + "." + fileExtension;
    }
}
