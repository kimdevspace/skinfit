package com.ssafy12.moinsoop.skinfit.domain.user.entity.converter;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.RoleType;
import jakarta.persistence.AttributeConverter;

public class RoleTypeConverter implements AttributeConverter<RoleType, String> {
    @Override
    public String convertToDatabaseColumn(RoleType attribute) {
        return attribute.name(); // 대문자로 저장
    }

    @Override
    public RoleType convertToEntityAttribute(String dbData) {
        return RoleType.valueOf(dbData.toUpperCase());
    }
}
