package com.ssafy12.moinsoop.skinfit.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DeleteReviewsRequest {
    private List<Integer> reviewIds; // 삭제할 리뷰 ID 목록
}
