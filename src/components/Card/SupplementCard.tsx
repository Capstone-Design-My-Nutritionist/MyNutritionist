import React from 'react';
import styled from 'styled-components/native';
import ArrowLeft from '../../../assets/images/arrow-left.svg';
import ArrowRight from '../../../assets/images/arrow-right.svg';

interface Supplement {
  id: number;
  imageUrl: string;
  category: string;
  name: string;
  description: string;
}

interface SupplementCardProps {
  supplement: Supplement;
  onPrev: () => void;
  onNext: () => void;
  onDetailPress: () => void;
}

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onPrev,
  onNext,
  onDetailPress,
}) => {
  return (
    <CardContainer>
      <ArrowButton onPress={onPrev}>
        {/* <ArrowLeft /> */}
      </ArrowButton>

      <Content>
        <ImageContainer>
          <ProductImage
            source={{uri: supplement.imageUrl}}
            resizeMode="contain"
          />
        </ImageContainer>

        <InfoContainer>
          <CategoryText>{supplement.category}</CategoryText>
          <ProductName>{supplement.name}</ProductName>
          <Description>{supplement.description}</Description>
          <DetailButton onPress={onDetailPress}>
            <DetailText>상세보기</DetailText>
          </DetailButton>
        </InfoContainer>
      </Content>

      <ArrowButton onPress={onNext}>
        {/* <ArrowRight /> */}
      </ArrowButton>
        
    </CardContainer>
    
  );
};

export default SupplementCard;

const CardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 12px 4px;
  width: 370px;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ArrowButton = styled.TouchableOpacity`
  padding: 6px;
`;

const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 328px;
`;

const ImageContainer = styled.View`
  width: 100px;
  height: 100px;
  border: 1px solid #333;
  border-radius: 8px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const InfoContainer = styled.View`
  width: 220px;
  height: 96px;
  justify-content: space-between;
`;

const CategoryText = styled.Text`
  font-size: 15px;
  font-family: 'Pretendard-Bold';
  color: #e60022;
`;

const ProductName = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: #111111;
  margin-top: 4px;
`;

const Description = styled.Text`
  font-size: 10px;
  font-family: 'Pretendard-Regular';
  color: #666666;
  margin-top: 4px;
`;

const DetailButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
`;

const DetailText = styled.Text`
  font-size: 10px;
  font-family: 'Pretendard-Regular';
  color: #000000;
  text-decoration: underline;
`;


const SectionDivider = styled.View`
  height: 8px;
  background-color: #F5F5F5;
  margin-vertical: 8px;
`;
