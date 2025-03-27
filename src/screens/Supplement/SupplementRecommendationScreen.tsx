import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import SupplementCard from '../../components/Card/SupplementCard';
import {recommendedSupplements, categorySupplements} from '../../data/dummySupplementsData';

const ITEMS_PER_PAGE = 3;
const MAX_REFRESH_COUNT = 3; // 최대 새로고침 횟수 (3개씩 3번 = 9개)

const SupplementRecommendationScreen = () => {
  const navigation = useNavigation();
  const [refreshCount, setRefreshCount] = useState(0);
  const [currentRecommendedPage, setCurrentRecommendedPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // 현재 표시할 추천 영양제 목록
  const currentRecommendedSupplements = recommendedSupplements.slice(
    currentRecommendedPage * ITEMS_PER_PAGE,
    (currentRecommendedPage + 1) * ITEMS_PER_PAGE,
  );

  // 새로고침 버튼 클릭 시 다음 페이지로 이동
  const handleRefresh = () => {
    if (refreshCount < MAX_REFRESH_COUNT) {
      const nextPage = (currentRecommendedPage + 1) % Math.ceil(recommendedSupplements.length / ITEMS_PER_PAGE);
      setCurrentRecommendedPage(nextPage);
      setRefreshCount(refreshCount + 1);
    } else {
      setModalVisible(true);
    }
  };

  // 이전 영양제 버튼 클릭
  const handlePrevSupplement = (index: number) => {
    // 현재 카테고리의 이전 아이템으로 이동하는 로직
    // 실제 구현에서는 해당 카테고리의 이전 아이템으로 이동하도록 구현
    Alert.alert('이전 영양제', '이전 영양제로 이동합니다.');
  };

  // 다음 영양제 버튼 클릭
  const handleNextSupplement = (index: number) => {
    // 현재 카테고리의 다음 아이템으로 이동하는 로직
    // 실제 구현에서는 해당 카테고리의 다음 아이템으로 이동하도록 구현
    Alert.alert('다음 영양제', '다음 영양제로 이동합니다.');
  };

  // 상세 페이지로 이동
  const navigateToSupplementDetails = (supplement: any) => {
    // @ts-ignore: 타입 정의 임시 처리
    navigation.navigate('SupplementDetails', { supplement });
  };

  // 카테고리 렌더링
  const renderCategory = (category: string, supplements: any[]) => {
    return (
      <CategorySection key={category}>
        <CategoryTitle>{category}</CategoryTitle>
        <FlatList
          data={supplements}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item, index}) => (
            <SupplementCardWrapper>
              <SupplementCard
                supplement={item}
                onPrev={() => handlePrevSupplement(index)}
                onNext={() => handleNextSupplement(index)}
                onDetailPress={() => navigateToSupplementDetails(item)}
              />
            </SupplementCardWrapper>
          )}
          contentContainerStyle={{paddingHorizontal: 10}}
        />
      </CategorySection>
    );
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <HeaderTitle>영양제 구매</HeaderTitle>
      </Header>
      <HeaderDivider />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* 추천 영양제 섹션 */}
        <RecommendationSection>
          <RecommendationHeader>
            <RecommendationTitle>홍길동님께 추천하는 영양제</RecommendationTitle>
            <RefreshButton onPress={handleRefresh}>
              <RefreshButtonText>새로고침</RefreshButtonText>
            </RefreshButton>
          </RecommendationHeader>

          <FlatList
            data={currentRecommendedSupplements}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item, index}) => (
              <SupplementCardWrapper>
                <SupplementCard
                  supplement={item}
                  onPrev={() => handlePrevSupplement(index)}
                  onNext={() => handleNextSupplement(index)}
                  onDetailPress={() => navigateToSupplementDetails(item)}
                />
              </SupplementCardWrapper>
            )}
            contentContainerStyle={{paddingHorizontal: 10}}
          />
        </RecommendationSection>

        {/* 카테고리별 영양제 섹션 */}
        {Object.entries(categorySupplements).map(([category, supplements]) =>
          renderCategory(category, supplements),
        )}


      </ScrollView>

      {/* 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <ModalOverlay>
          <ModalContainer>
            <ModalTitle>알림</ModalTitle>
            <ModalContent>더이상 추천할 영양제가 없습니다.</ModalContent>
            <ModalButton onPress={() => setModalVisible(false)}>
              <ModalButtonText>확인</ModalButtonText>
            </ModalButton>
          </ModalContainer>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default SupplementRecommendationScreen;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FFF8F8;
`;

const Header = styled.View`
  height: 56px;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-color: #E0E0E0;
`;

const HeaderTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const HeaderDivider = styled.View`
  height: 1px;
  background-color: #E0E0E0;
`;

const RecommendationSection = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #fefefe;
  padding-vertical: 12px;
`;

const RecommendationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 12px;
`;

const RecommendationTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #731A22;
`;

const RefreshButton = styled.TouchableOpacity`
  padding: 6px 12px;
  background-color: #731A22;
  border-radius: 4px;
`;

const RefreshButtonText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 12px;
  color: #ffffff;
`;

const SupplementCardWrapper = styled.View`
  margin-horizontal: 8px;
  margin-bottom: 16px;
`;

const SectionDivider = styled.View`
  height: 8px;
  background-color: #E0E0E0;
  margin-top: 8px;
  margin-bottom: 8px;
`;

const CategorySection = styled.View`
  margin-vertical: 16px;
  background-color: #fefefe;
  padding-vertical: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);

`;

const CategoryTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #731A22;
  margin-left: 16px;
  margin-bottom: 12px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContainer = styled.View`
  width: 80%;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #111111;
  margin-bottom: 16px;
`;

const ModalContent = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #333333;
  margin-bottom: 20px;
  text-align: center;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: #731A22;
  padding: 10px 20px;
  border-radius: 5px;
`;

const ModalButtonText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: white;
`;