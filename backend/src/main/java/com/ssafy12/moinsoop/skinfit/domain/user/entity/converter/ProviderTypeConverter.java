package com.ssafy12.moinsoop.skinfit.domain.user.entity.converter;

import com.ssafy12.moinsoop.skinfit.domain.user.entity.enums.ProviderType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProviderTypeConverter implements AttributeConverter<ProviderType, String> {
    @Override
    public String convertToDatabaseColumn(ProviderType attribute) {
        return attribute.name(); // 대문자로 저장
    }

    @Override
    public ProviderType convertToEntityAttribute(String dbData) {
        return ProviderType.valueOf(dbData.toUpperCase());
    }
}
