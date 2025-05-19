// src/screens/Main/NutritionDetailsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import ProgressBar from '../../components/Progress/ProgressBar';
import {dummyNutritionData} from '../../data/dummyNutritionDetailData';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchNutritionSummary } from '../../api/api';

// 값이 숫자인지 확인하고 숫자로 변환하는 유틸리티 함수
const ensureNumber = (value: any): number => {
  // undefined, null, NaN 처리
  if (value === undefined || value === null || isNaN(value)) {
    return 0;
  }
  
  // 문자열인 경우 숫자로 변환 시도
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    // 음수인 경우 0으로 처리
    return isNaN(parsed) ? 0 : (parsed < 0 ? 0 : parsed);
  }
  
  // 이미 숫자인 경우
  if (typeof value === 'number') {
    // 음수인 경우 0으로 처리
    return value < 0 ? 0 : value;
  }
  
  // 그 외의 경우는 0 반환
  return 0;
};

// 숫자를 소수점 첫째자리까지 표시하는 함수
const formatToOneDecimal = (value: any): string => {
  const num = ensureNumber(value);
  return num.toFixed(1);
};

type RouteParams = {
  date: string;
};

const NutritionDetailsScreen = () => {
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  const navigation = useNavigation();
  const selectedDate = route.params?.date || '2025.03.27';
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 오류 상태
  const [error, setError] = useState<string | null>(null);
  
  // 영양소 요약 데이터 상태
  const [nutritionSummary, setNutritionSummary] = useState<{
    consumedCalories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    [key: string]: number;
  } | null>(null);
  
  // 목표 영양소 값 (더미 데이터)
  const goalNutrition = {
    calories: 2000,
    carbs: 250,
    protein: 80,
    fat: 60
  };
  
  // 영양소 이름을 한글로 변환하는 함수
  const getNutrientKoreanName = (key: string): string => {
    const koreanNames: {[key: string]: string} = {
      // 기본 영양소
      carbohydrate: '탄수화물',
      protein: '단백질',
      fat: '지방',
      // API 응답 형태에 맞게 수정
      saturatedFattyAcid: '포화지방',
      transFattyAcid: '트랜스지방',
      cholesterol: '콜레스테롤',
      totalSugars: '당류',
      totalDietaryFiber: '식이섬유',
      sodium: '나트륨',
      calcium: '칼슘',
      vitaminA: '비타민 A',
      vitaminC: '비타민 C',
      vitaminD: '비타민 D',
      vitaminE: '비타민 E',
      vitaminB6: '비타민 B6',
      // 기존 키도 유지
      potassium: '칼륨',
      fiber: '식이섬유',
      sugar: '당류',
      iron: '철분',
      vitamin_a: '비타민 A',
      vitamin_c: '비타민 C',
      vitamin_d: '비타민 D',
      vitamin_e: '비타민 E',
      vitamin_k: '비타민 K',
      vitamin_b1: '비타민 B1',
      vitamin_b2: '비타민 B2',
      vitamin_b6: '비타민 B6',
      vitamin_b12: '비타민 B12',
      folate: '엽산',
      magnesium: '마그네슘',
      zinc: '아연',
      phosphorus: '인',
      saturated_fat: '포화지방',
      trans_fat: '트랜스지방',
      omega3: '오메가3',
      omega6: '오메가6'
    };
    
    return koreanNames[key] || key; // 매핑된 한글 이름이 없으면 원래 키 반환
  };

  // 영양소 요약 데이터를 가져오는 함수
  const getNutritionSummary = async (date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 날짜 포맷 변환 (YYYY.MM.DD -> YYYY-MM-DD)
      const formattedDate = date.replace(/\./g, '-');
      
      const response = await fetchNutritionSummary(formattedDate);
      if (response && response.data) {
        // energy 값을 consumedCalories로 사용
        const apiData = response.data;
        const formattedData = {
          ...apiData,
          consumedCalories: apiData.energy !== undefined ? apiData.energy : (apiData.consumedCalories || 0)
        };
        
        setNutritionSummary(formattedData);
        console.log('영양소 요약 데이터 가져오기 성공:', formattedData);
      }
    } catch (error) {
      console.error('영양소 요약 데이터 가져오기 오류:', error);
      setError('영양소 데이터를 가져오는 중 오류가 발생했습니다.');
      // 오류 발생 시 더미 데이터 사용
      setNutritionSummary({
        consumedCalories: dummyNutritionData.consumedCalories,
        carbohydrate: dummyNutritionData.nutrients[0].consumed,
        protein: dummyNutritionData.nutrients[1].consumed,
        fat: dummyNutritionData.nutrients[2].consumed
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // 컴포넌트 마운트 시 영양소 요약 데이터 가져오기
  useEffect(() => {
    getNutritionSummary(selectedDate);
  }, [selectedDate]);
  
  // 더미 데이터 사용 (백업)
  const {totalCalories, consumedCalories, nutrients} = dummyNutritionData;

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 영양소 그리드 렌더링 (3개씩 5줄)
  const renderNutrientGrid = () => {
    const rows = [];
    for (let i = 0; i < nutrients.length; i += 3) {
      const rowItems = nutrients.slice(i, i + 3);
      rows.push(
        <NutrientRow key={`row-${i}`}>
          {rowItems.map((nutrient, index) => (
            <NutrientItem key={`nutrient-${i + index}`}>
              <ProgressBar
                id={i + index}
                label={nutrient.label}
                consumed={nutrient.consumed}
                goal={nutrient.goal}
                progressColor={nutrient.progressColor}
                unit={nutrient.unit}
              />
            </NutrientItem>
          ))}
        </NutrientRow>,
      );
    }
    return rows;
  };
  
  // API 데이터로 영양소 그리드 렌더링
  const renderNutrientGridFromAPI = (data: any) => {
    // 표시할 영양소 리스트와 그에 해당하는 색상 정의 (API 응답 형태에 맞게 수정)
    const nutrientList = [
      { key: 'carbohydrate', color: '#FD384C', goal: goalNutrition.carbs, unit: 'g' },
      { key: 'protein', color: '#D95B72', goal: goalNutrition.protein, unit: 'g' },
      { key: 'fat', color: '#FD9E38', goal: goalNutrition.fat, unit: 'g' },
      { key: 'cholesterol', color: '#D46A6A', goal: 300, unit: 'mg' },
      { key: 'totalDietaryFiber', color: '#FF7F7F', goal: 25, unit: 'g' },
      { key: 'calcium', color: '#FFB347', goal: 1000, unit: 'mg' },
      { key: 'saturatedFattyAcid', color: '#F69898', goal: 20, unit: 'g' },
      { key: 'sodium', color: '#B2A4FF', goal: 2300, unit: 'mg' },
      { key: 'totalSugars', color: '#FEC260', goal: 50, unit: 'g' },
      { key: 'transFattyAcid', color: '#FF6F61', goal: 2, unit: 'g' },
      { key: 'vitaminA', color: '#A2D2FF', goal: 700, unit: 'μg' },
      { key: 'vitaminB6', color: '#9ED9CC', goal: 1.3, unit: 'mg' },
      { key: 'vitaminC', color: '#B5EAD7', goal: 100, unit: 'mg' },
      { key: 'vitaminD', color: '#FFD6A5', goal: 15, unit: 'μg' },
      { key: 'vitaminE', color: '#BDB2FF', goal: 15, unit: 'mg' },
    ];
    
    // 3개씩 행으로 분할 (모든 영양소 표시)
    const rows = [];
    for (let i = 0; i < nutrientList.length; i += 3) {
      const rowItems = nutrientList.slice(i, i + 3);
      rows.push(
        <NutrientRow key={`api-row-${i}`}>
          {rowItems.map((item, index) => {
            // API 데이터에서 값 가져오기
            let value = data[item.key] !== undefined ? data[item.key] : 0; // 값이 없으면 0으로 처리
            // 음수인 경우 0으로 처리
            if (value < 0) value = 0;
            
            return (
              <NutrientItem key={`api-nutrient-${i + index}`}>
                <ProgressBar
                  id={i + index}
                  label={getNutrientKoreanName(item.key)}
                  consumed={ensureNumber(value)}
                  displayValue={formatToOneDecimal(value)}
                  goal={item.goal}
                  progressColor={item.color}
                  unit={item.unit}
                />
              </NutrientItem>
            );
          })}
        </NutrientRow>
      );
    }
    return rows;
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBackground>
          <HeaderContent>
            <DateText>{selectedDate}</DateText>
            <SubText>에 섭취했던 영양소 정보에요.</SubText>
          </HeaderContent>
        </HeaderBackground>

        <ContentContainer>
          {isLoading ? (
            <LoadingContainer>
              <ActivityIndicator size="large" color="#E44F68" />
              <LoadingText>영양소 데이터를 불러오는 중...</LoadingText>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          ) : (
            <SummaryContainer>
              <SectionTitle>총 섭취량</SectionTitle>
              <CalorieInfoContainer>
                <CalorieText>{formatToOneDecimal(nutritionSummary?.consumedCalories ?? consumedCalories)}</CalorieText>
                <CalorieUnit>/ {goalNutrition.calories}kcal</CalorieUnit>
              </CalorieInfoContainer>

              <ProgressBarContainer>
                <ProgressBarBackground>
                  <ProgressBarFill
                    width={(ensureNumber(nutritionSummary?.consumedCalories ?? consumedCalories) / goalNutrition.calories) * 100}
                  />
                </ProgressBarBackground>
              </ProgressBarContainer>

              <NutrientGridContainer>
                {/* API에서 가져온 영양소 데이터가 있는 경우 */}
                {nutritionSummary ? (
                  <>
                    {renderNutrientGridFromAPI(nutritionSummary)}
                  </>
                ) : (
                  // 더미 데이터 사용
                  renderNutrientGrid()
                )}
              </NutrientGridContainer>
            </SummaryContainer>
          )}
        </ContentContainer>

        <BackButtonContainer>
          <BackButton onPress={handleGoBack}>
            <BackButtonText>뒤로가기</BackButtonText>
          </BackButton>
        </BackButtonContainer>
      </ScrollView>
    </Container>
  );
};

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFFBFB;
`;

// 로딩 컨테이너
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// 로딩 텍스트
const LoadingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #8E8E8E;
  margin-top: 10px;
`;

// 오류 컨테이너
const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// 오류 텍스트
const ErrorText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #D95B72;
  text-align: center;
`;

const HeaderBackground = styled.View`
  background-color: #E44F68;
  padding: 20px;
  padding-top: 100px;
  height: 260px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const HeaderContent = styled.View`
  align-items: center;
`;

const DateText = styled.Text`
  font-family: 'Pretendard-ExtraBold';
  font-size: 20px;
  color: #ffffff;
  margin-bottom: 4px;
`;

const SubText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #ffffff;
`;

const ContentContainer = styled.View`
  padding: 20px;
`;

const SummaryContainer = styled.View`
  background-color: #FFFFFF;
  margin-top: -80px;
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #333333;
  margin-bottom: 15px;
`;

const CalorieInfoContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 10px;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 24px;
  color: #F2594B;
`;

const CalorieUnit = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
  margin-left: 5px;
  margin-bottom: 3px;
`;

const ProgressBarContainer = styled.View`
  margin-bottom: 20px;
`;

const ProgressBarBackground = styled.View`
  height: 8px;
  background-color: #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBarFill = styled.View<{ width: number }>`
  height: 100%;
  width: ${(props: { width: number }) => Math.min(Math.max(props.width, 0), 100)}%;
  background-color: #E44F68;
  border-radius: 4px;
`;

const NutrientGridContainer = styled.View`
  margin-top: 10px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
`;

const NutrientItem = styled.View`
  flex: 1;
  margin-horizontal: 5px;
`;

const BackButtonContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  background-color: #E44F68;
  padding: 15px 30px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  width: 80%;
`;

const BackButtonText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 16px;
  color: #ffffff;
`;

export default NutritionDetailsScreen;
