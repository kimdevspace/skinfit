package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteReviewsResponse {
    private int deletedCount;       // 실제로 삭제된 리뷰 수
    private List<Integer> failedIds; // 삭제 실패한 리뷰 ID 목록
}
