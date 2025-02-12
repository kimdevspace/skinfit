package com.ssafy12.moinsoop.skinfit.domain.user.entity.converter;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.Gender;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {
    @Override
    public String convertToDatabaseColumn(Gender attribute) {
        return attribute.name(); // 대문자로 저장
    }

    @Override
    public Gender convertToEntityAttribute(String dbData) {
        return Gender.valueOf(dbData.toUpperCase());
    }
}
