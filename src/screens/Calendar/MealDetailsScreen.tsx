import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NutrientItem from '../../components/Nutrient/NutrientItem';
import { fetchMealByType } from '../../api/api';
import { dummyMealRecord } from '../../data/dummyMealRecordData';
import { convertToEnumMealType, convertToKoreanMealType } from '../../utils/mealTypeUtils';

// 타입 정의
type RouteParams = {
  mealId?: number | string;
  date?: string;
  mealType?: string;
  foodName?: string; // 선택한 음식 이름 (여러 음식이 있을 경우 필터링용)
};

// 음식 데이터 타입 정의
type FoodData = {
  name: string;
  fullName?: string;
  eatAmount?: number; // 기존 필드
  amount?: number;    // 새로운 API 필드
  nutrition: {
    energy: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    saturatedFattyAcid?: number;
    transFattyAcid?: number;
    cholesterol?: number;
    totalSugars?: number;
    totalDietaryFiber?: number;
    sodium?: number;
    calcium?: number;
    vitaminA?: number;
    vitaminC?: number;
    vitaminD?: number;
    vitaminE?: number;
    vitaminB6?: number;
    [key: string]: number | undefined;
  };
  imageUrl?: string;
};

// 식사 데이터 타입 정의
type MealData = {
  mealType: string;
  foods: FoodData[];
};

// 화면에 표시할 데이터 타입
type DisplayMealData = {
  date: string;
  mealType: string;
  imageUrl: string;
  foodName: string;
  totalCalories: number;
  carbs: number;
  protein: number;
  fat: number;
  servingSize: string;
  nutrients: Record<string, string>;
  additionalFoods: Array<{
    name: string;
    servingSize: string;
    actualServing: string;
    calories: number;
    nutrients: Record<string, string>;
  }>;
};

// 스타일 정의
const Container = styled.View`
  flex: 1;
  background-color: #FFF8F8;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LoadingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #8E8E8E;
  margin-top: 16px;
  text-align: center;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ErrorText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 16px;
  color: #D95B72;
  margin-bottom: 16px;
  text-align: center;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: #D95B72;
  padding: 12px 24px;
  border-radius: 8px;
  margin-top: 8px;
`;

const RetryButtonText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: white;
  text-align: center;
`;

const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-top: 60px;
  position: relative;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-color: #E0E0E0;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 60px;
`;

const HeaderTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const HeaderDivider = styled.View`
  height: 1px;
  width: 100%;
  background-color: #E0E0E0;
`;

const FoodImage = styled.Image`
  width: 100%;
  height: 300px;
  resize-mode: cover;
`;

const FoodInfoCard = styled.View`
  background-color: #FFFFFF;
  margin-top: -20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(0,0,0,0.1);
`;

const FoodInfoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const FoodName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 20px;
  color: #111111;
`;

const MealTimeTag = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 12px;
  color: #FFFFFF;
  background-color: #E44F68;
  padding: 4px 8px;
  border-radius: 12px;
`;

const ServingInfoRow = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items:left;
  margin-bottom: 20px;
`;

const ServingText = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #8E8E8E;
`;

const CalorieText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #E44F68;
`;

const NutrientSummary = styled.View`
  margin-bottom: 10px;
  flex-direction: row;
`;

interface ColorProps {
  color: string;
}

const NutrientDot = styled.View<ColorProps>`
  width: 8px;
  height: 8px;
  background-color: ${(props: ColorProps) => props.color};
  border-radius: 2px;
  margin-left: 6px;
`;

interface WidthProps {
  width: number;
}

const NutrientProgressBar = styled.View`
  height: 10px;
  flex-direction: row;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
`;

const CarbsProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #FD384C;
`;

const FatProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #FD9E38;
`;

const ProteinProgress = styled.View<WidthProps>`
  height: 100%;
  width: ${(props: WidthProps) => props.width}%;
  background-color: #D95B72;
`;

const SectionDivider = styled.View`
  height: 8px;
  background-color: #E0E0E0;
`;

const NutrientDetailContainer = styled.View`
  align-items: center;
  padding: 10px 20px;
  background-color: #fefefe;
`;

const AdditionalFoodHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  width: 350px;
`;

const AdditionalFoodName = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731A22;
`;

const AdditionalFoodCalories = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #E44F68;
`;

const ActualServingText = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: #D95B72;
`;

const BottomSpacer = styled.View`
  height: 100px;
`;

const NutrientRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px; 
`;

const NutrientLabel = styled.Text`
  font-family: 'Pretendard-Medium';
  font-size: 14px;
  color: #111111;
  margin-left: 4px;
`;

const NutrientValue = styled.Text<{ color: string }>`
  font-family: 'Pretendard-Bold';
  font-size: 14px;
  color: ${(props: { color: string }) => props.color};
  margin-left: 4px;
`;

const ServingInfoWrapper = styled.View`
  width: 100%;
  max-width: 350px;
  align-self: flex-start;
  padding: 0px 10px;
`;

const MealDetailsScreen = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation();
  
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealData, setMealData] = useState<DisplayMealData | null>(null);
  
  // 라우트 파라미터에서 필요한 정보 추출
  const { date = '', mealType = '', foodName } = route.params || {};
  
  // 영양소 데이터를 포맷팅하는 함수
  const formatNutrientData = (nutrition: Record<string, number | undefined>): Record<string, string> => {
    const nutrientMap: Record<string, string> = {
      energy: '열량',
      carbohydrate: '탄수화물',
      protein: '단백질',
      fat: '지방',
      saturatedFattyAcid: '포화지방',
      transFattyAcid: '트랜스지방',
      cholesterol: '콜레스테롤',
      totalSugars: '당류',
      totalDietaryFiber: '식이섬유',
      sodium: '나트륨',
      calcium: '칼슘',
      vitaminA: '비타민A',
      vitaminC: '비타민C',
      vitaminD: '비타민D',
      vitaminE: '비타민E',
      vitaminB6: '비타민B6'
    };
    
    const formattedNutrients: Record<string, string> = {};
    
    Object.entries(nutrition).forEach(([key, value]) => {
      // -1인 값은 화면 표시 시에만 0으로 변환 (데이터 자체는 변경하지 않음)
      const displayValue = value === -1 ? 0 : value;
      
      // 탄수화물, 단백질, 지방은 이미 위에 표시되어 있으므로 제외
      if (displayValue !== undefined && displayValue !== 0 && nutrientMap[key] && 
          !['carbohydrate', 'protein', 'fat', 'energy'].includes(key)) {
        // 단위 설정
        let unit = 'g';
        if (key === 'energy') unit = 'kcal';
        else if (key.startsWith('vitamin')) unit = 'mg';
        else if (key === 'cholesterol' || key === 'sodium' || key === 'calcium') unit = 'mg';
        
        // 소수점 한 자리까지 표시 (요구사항에 맞춰 변경)
        formattedNutrients[nutrientMap[key]] = `${displayValue?.toFixed(1)}${unit}`;
      }
    });
    
    return formattedNutrients;
  };
  
  // API 데이터를 화면에 표시할 형태로 가공하는 함수
  const processApiData = (apiData: MealData, selectedDate: string): DisplayMealData => {
    // 메인 음식 (첫 번째 음식)
    const mainFood = apiData.foods[0] || {
      name: '데이터 없음',
      nutrition: { energy: 0, carbohydrate: 0, protein: 0, fat: 0 },
      amount: 1, // 기본값으로 1인분 설정
      imageUrl: 'https://via.placeholder.com/300'
    };
    
    // 인분수 가져오기 (새로운 amount 필드 우선 사용, 없으면 eatAmount 사용, 둘 다 없으면 1 기본값)
    const servingAmount = mainFood.amount !== undefined ? mainFood.amount : 
                         (mainFood.eatAmount !== undefined ? mainFood.eatAmount : 1);
    
    console.log('음식 데이터:', mainFood);
    console.log('인분수:', servingAmount);
    
    // 추가 음식 (첫 번째 이후의 모든 음식)
    const additionalFoods = apiData.foods.slice(1).map(food => {
      const foodAmount = food.amount !== undefined ? food.amount : 
                        (food.eatAmount !== undefined ? food.eatAmount : 1);
      return {
        name: food.name,
        servingSize: `${foodAmount}인분`,
        actualServing: `${foodAmount}인분`,
        calories: food.nutrition.energy,
        nutrients: formatNutrientData(food.nutrition)
      };
    });
    
    // 반환할 데이터 구성
    return {
      date: selectedDate,
      mealType: convertToKoreanMealType(apiData.mealType),
      imageUrl: mainFood.imageUrl || 'https://via.placeholder.com/300',
      foodName: mainFood.name,
      totalCalories: (mainFood.nutrition.energy !== undefined && mainFood.nutrition.energy >= 0) ? mainFood.nutrition.energy : 0,
      carbs: parseFloat(((mainFood.nutrition.carbohydrate !== undefined && mainFood.nutrition.carbohydrate >= 0) ? mainFood.nutrition.carbohydrate : 0).toFixed(1)),
      protein: parseFloat(((mainFood.nutrition.protein !== undefined && mainFood.nutrition.protein >= 0) ? mainFood.nutrition.protein : 0).toFixed(1)),
      fat: parseFloat(((mainFood.nutrition.fat !== undefined && mainFood.nutrition.fat >= 0) ? mainFood.nutrition.fat : 0).toFixed(1)),
      servingSize: `${servingAmount}인분`,
      nutrients: formatNutrientData(mainFood.nutrition),
      additionalFoods: [] // 추가 음식 정보 비우기
    };
  };
  
  // 식사 데이터 로드 함수
  const loadMealData = async () => {
    if (!date || !mealType) {
      setError('날짜와 식사 유형이 필요합니다');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 백엔드 API 호출을 위해 식사 유형을 영어로 변환
      const enumMealType = convertToEnumMealType(mealType);
      
      // 날짜 형식 변환 (YYYY.MM.DD -> YYYY-MM-DD)
      const formattedDate = date.replace(/\./g, '-');
      console.log('API 호출 정보:', formattedDate, enumMealType);
      
      // API 호출
      const response = await fetchMealByType(formattedDate, enumMealType);
      
      if (response && response.foods && response.foods.length > 0) {
        // API 응답 데이터 처리
        const processedData = processApiData(response, date);
        setMealData(processedData);
      } else {
        // 데이터가 없는 경우 더미 데이터 사용
        console.log('API 응답에 데이터가 없어 더미 데이터를 사용합니다');
        
        // 더미 데이터를 DisplayMealData 형식으로 변환
        const dummyDisplayData: DisplayMealData = {
          date: date,
          mealType: mealType,
          imageUrl: dummyMealRecord.mainFood.imageUrl,
          foodName: dummyMealRecord.mainFood.name,
          totalCalories: dummyMealRecord.mainFood.kcal,
          carbs: dummyMealRecord.mainFood.carbs,
          protein: dummyMealRecord.mainFood.protein,
          fat: dummyMealRecord.mainFood.fat,
          servingSize: dummyMealRecord.mainFood.serving.includes('인분') ? dummyMealRecord.mainFood.serving : '1인분',
          nutrients: dummyMealRecord.mainFood.nutrients,
          additionalFoods: dummyMealRecord.additionalFoods.map(food => ({
            name: food.name,
            servingSize: food.serving,
            actualServing: food.actualAmount,
            calories: food.kcal,
            nutrients: food.nutrients
          }))
        };
        
        setMealData(dummyDisplayData);
      }
    } catch (err) {
      console.error('식사 데이터 로드 중 오류 발생:', err);
      setError('데이터를 불러오는 중 오류가 발생했습니다');
      
      // 오류 발생 시 더미 데이터 사용
      const dummyDisplayData: DisplayMealData = {
        date: date,
        mealType: mealType,
        imageUrl: dummyMealRecord.mainFood.imageUrl,
        foodName: dummyMealRecord.mainFood.name,
        totalCalories: dummyMealRecord.mainFood.kcal,
        carbs: dummyMealRecord.mainFood.carbs,
        protein: dummyMealRecord.mainFood.protein,
        fat: dummyMealRecord.mainFood.fat,
        servingSize: dummyMealRecord.mainFood.serving.includes('인분') ? dummyMealRecord.mainFood.serving : '1인분',
        nutrients: dummyMealRecord.mainFood.nutrients,
        additionalFoods: dummyMealRecord.additionalFoods.map(food => ({
          name: food.name,
          servingSize: food.serving,
          actualServing: food.actualAmount,
          calories: food.kcal,
          nutrients: food.nutrients
        }))
      };
      
      setMealData(dummyDisplayData);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadMealData();
  }, [date, mealType]);
  
  // 로딩 중 표시
  if (isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#D95B72" />
        <LoadingText>식사 정보를 불러오는 중...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // 오류 표시
  if (error) {
    return (
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
        <RetryButton onPress={loadMealData}>
          <RetryButtonText>다시 시도</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }
  
  // 데이터가 없는 경우
  if (!mealData) {
    return (
      <ErrorContainer>
        <ErrorText>식사 정보를 찾을 수 없습니다</ErrorText>
        <RetryButton onPress={handleGoBack}>
          <RetryButtonText>돌아가기</RetryButtonText>
        </RetryButton>
      </ErrorContainer>
    );
  }
  
  // 탄수화물, 단백질, 지방의 비율 계산
  const totalNutrients = mealData.carbs + mealData.protein + mealData.fat;
  const carbsRatio = totalNutrients > 0 ? (mealData.carbs / totalNutrients) * 100 : 0;
  const proteinRatio = totalNutrients > 0 ? (mealData.protein / totalNutrients) * 100 : 0;
  const fatRatio = totalNutrients > 0 ? (mealData.fat / totalNutrients) * 100 : 0;
  
  // 유효한 영양소만 필터링 (값이 0이거나 빈 문자열이 아닌 것만)
  const validNutrients = Object.entries(mealData.nutrients).filter(
    ([_, value]) => value !== '0g' && value !== ''
  );
  
  return (
    <Container>
      {/* 상단바 */}
      <HeaderContainer>
        <BackButton onPress={handleGoBack}>
          <Icon name="arrow-back-ios" size={24} color="#731A22" />
        </BackButton>
        <HeaderTitle>{`${mealData.date} - ${mealData.mealType}`}</HeaderTitle>
      </HeaderContainer>
      <HeaderDivider />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 음식 이미지 */}
        <FoodImage source={{ uri: mealData.imageUrl }} />

        {/* 음식 정보 카드 */}
        <FoodInfoCard>
          <FoodInfoHeader>
            <FoodName>{mealData.foodName}</FoodName>
            <MealTimeTag>{mealData.mealType}</MealTimeTag>
          </FoodInfoHeader>
          
          <ServingInfoRow>
            <ServingText>{mealData.servingSize}</ServingText>
            <CalorieText>{mealData.totalCalories}kcal</CalorieText>
          </ServingInfoRow>

          {/* 탄단지 정보 */}
          <NutrientSummary>
            <NutrientRow>
              <NutrientDot color="#FD384C" />
              <NutrientLabel>탄수화물</NutrientLabel>
              <NutrientValue color="#FD384C">{mealData.carbs}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#FD9E38" />
              <NutrientLabel>지방</NutrientLabel>
              <NutrientValue color="#FD9E38">{mealData.fat}g</NutrientValue>
            </NutrientRow>

            <NutrientRow>
              <NutrientDot color="#D95B72" />
              <NutrientLabel>단백질</NutrientLabel>
              <NutrientValue color="#D95B72">{mealData.protein}g</NutrientValue>
            </NutrientRow>
          </NutrientSummary>

          {/* 탄단지 프로그레스바 */}
          <NutrientProgressBar>
            <CarbsProgress width={carbsRatio} />
            <FatProgress width={fatRatio} />
            <ProteinProgress width={proteinRatio} />
          </NutrientProgressBar>
        </FoodInfoCard>

        {/* 영양소 상세 정보 */}
        <NutrientDetailContainer>
          {validNutrients.map(([name, value], index) => (
            <NutrientItem key={`nutrient-${index}`} name={name} value={value} />
          ))}
        </NutrientDetailContainer>

        {/* 추가 음식 정보 섹션 제거 */}

        {/* 하단 여백 */}
        <BottomSpacer />
      </ScrollView>
    </Container>
  );
};

export default MealDetailsScreen;
