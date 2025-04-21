// QuyenService.java
package com.sport_store.backend.service;

import com.sport_store.backend.entity.Enum.HanhDong;
import com.sport_store.backend.repository.QuyenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuyenService {

    private final QuyenRepository quyenRepository;

    public Map<String, List<String>> getQuyenByChucVu(Integer chucVuId) {
        List<Object[]> rawData = quyenRepository.findByChucVuGroupByChucNang(chucVuId);

        Map<String, List<String>> result = new HashMap<>();
        for (Object[] row : rawData) {
            String tenChucNang = (String) row[0];
            String hanhDong = ((HanhDong) row[1]).getValue();

            result.computeIfAbsent(tenChucNang, k -> new ArrayList<>()).add(hanhDong);
        }
        return result;
    }
}
