import React from 'react';
import styled from 'styled-components/native';
import {Shadow} from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
}

const SupplementCard: React.FC<SupplementCardProps> = ({
  supplement,
  onPrev,
  onNext,
}) => {
  return (
    <Shadow
      distance={5}
      startColor="rgba(140,3,3,0.15)"
      offset={[0, 0.5]}
      style={{borderRadius: 12}}>
      <CardContainer>
        <ArrowButton onPress={onPrev}>
          <ArrowLeft />
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
            <DetailButton>
              <DetailText>상세보기</DetailText>
            </DetailButton>
          </InfoContainer>
        </Content>

        <ArrowButton onPress={onNext}>
          <ArrowRight />
        </ArrowButton>
      </CardContainer>
    </Shadow>
  );
};

export default SupplementCard;

const CardContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 8px 0px;
  width: 370px;
  justify-content: space-between;
`;

const ArrowButton = styled.TouchableOpacity`
  padding: 6px;
`;

const ArrowIcon = styled(ArrowLeft)`
  width: 7px;
  height: 14px;
  color: black;
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
  border-radius: 18px;
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
