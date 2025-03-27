import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation, useRoute} from '@react-navigation/native';

const SupplementDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore: 타입 정의 임시 처리
  const {supplement} = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <BackButton onPress={handleGoBack}>
          <BackButtonText>{'< 뒤로'}</BackButtonText>
        </BackButton>
        <HeaderTitle>영양제 상세</HeaderTitle>
        <View style={{width: 50}} />
      </Header>
      <HeaderDivider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 상품 이미지 */}
        <ImageContainer>
          <ProductImage
            source={{uri: supplement.imageUrl}}
            resizeMode="contain"
          />
        </ImageContainer>

        {/* 상품 정보 */}
        <InfoSection>
          <CategoryBadge>
            <CategoryText>{supplement.category}</CategoryText>
          </CategoryBadge>
          <ProductName>{supplement.name}</ProductName>
          <Description>{supplement.description}</Description>
        </InfoSection>

        <Divider />

        {/* 상세 정보 */}
        <DetailSection>
          <SectionTitle>상세 정보</SectionTitle>
          <DetailItem>
            <DetailLabel>제조사</DetailLabel>
            <DetailValue>건강한 영양제</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>섭취 방법</DetailLabel>
            <DetailValue>1일 1회, 1회 1정 물과 함께 복용</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>주요 성분</DetailLabel>
            <DetailValue>비타민 C, 비타민 D, 아연, 마그네슘</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>보관 방법</DetailLabel>
            <DetailValue>직사광선을 피하고 서늘한 곳에 보관하세요.</DetailValue>
          </DetailItem>
        </DetailSection>

        <Divider />

        {/* 효능 정보 */}
        <BenefitSection>
          <SectionTitle>효능 정보</SectionTitle>
          <BenefitItem>
            <BenefitBullet />
            <BenefitText>면역력 증진에 도움을 줄 수 있습니다.</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitBullet />
            <BenefitText>피로 회복에 도움을 줄 수 있습니다.</BenefitText>
          </BenefitItem>
          <BenefitItem>
            <BenefitBullet />
            <BenefitText>항산화 작용으로 노화 방지에 도움을 줄 수 있습니다.</BenefitText>
          </BenefitItem>
        </BenefitSection>

        {/* 구매 버튼 */}
        <ButtonContainer>
          <PurchaseButton>
            <PurchaseButtonText>구매하기</PurchaseButtonText>
          </PurchaseButton>
        </ButtonContainer>
      </ScrollView>
    </Container>
  );
};

export default SupplementDetailsScreen;

// 스타일 컴포넌트
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  height: 56px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 16px;
`;

const BackButton = styled.TouchableOpacity`
  width: 50px;
`;

const BackButtonText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #731A22;
`;

const HeaderTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const HeaderDivider = styled.View`
  height: 1px;
  background-color: #731A22;
  opacity: 0.3;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 250px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ProductImage = styled.Image`
  width: 200px;
  height: 200px;
  border-radius: 8px;
`;

const InfoSection = styled.View`
  padding: 20px;
`;

const CategoryBadge = styled.View`
  background-color: #FFEBEE;
  padding: 4px 8px;
  border-radius: 4px;
  align-self: flex-start;
`;

const CategoryText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 12px;
  color: #e60022;
`;

const ProductName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
  color: #111111;
  margin-top: 8px;
`;

const Description = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
  line-height: 20px;
`;

const Divider = styled.View`
  height: 8px;
  background-color: #F5F5F5;
`;

const DetailSection = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #111111;
  margin-bottom: 16px;
`;

const DetailItem = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;

const DetailLabel = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #666666;
  width: 80px;
`;

const DetailValue = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  color: #111111;
  flex: 1;
`;

const BenefitSection = styled.View`
  padding: 20px;
`;

const BenefitItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const BenefitBullet = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: #731A22;
  margin-right: 8px;
`;

const BenefitText = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  color: #111111;
  flex: 1;
`;

const ButtonContainer = styled.View`
  padding: 20px;
  margin-bottom: 20px;
`;

const PurchaseButton = styled.TouchableOpacity`
  background-color: #731A22;
  padding: 16px;
  border-radius: 8px;
  align-items: center;
`;

const PurchaseButtonText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #ffffff;
`;