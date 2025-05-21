import React, {useState, useEffect, useMemo} from 'react';
import styled from 'styled-components/native';
import {Alert, ToastAndroid, Platform, ScrollView, FlatList, TouchableOpacity, Modal, Text, View, Image} from 'react-native';
import {useRoute, useNavigation, CommonActions} from '@react-navigation/native';
import {FoodUploadResultScreenRouteProp, FoodUploadNavigationProp} from '../../navigation/types';
import axios from 'axios';
import {API_URL} from '../../utils/env';
import {postMealData} from '../../api/api';
import {MEAL_TYPE_ENUM, convertToEnumMealType} from '../../utils/mealTypeUtils';
import CommonHeader from '../../components/Common/CommonHeader';
import MultiNutrientProgressBar from '../../components/Progress/MultiProgressBar';
import FoodNutrientCard from '../../components/Common/FoodNutrientCard';
import Icon from 'react-native-vector-icons/Ionicons';

// 영양소 한글 이름 매핑
const NUTRIENT_NAMES = {
  energy: '칼로리',
  protein: '단백질',
  fat: '지방',
  carbohydrate: '탄수화물',
  sodium: '나트륨',
  sugar: '당류',
  vitaminA: '비타민A',
  vitaminB1: '비타민B1',
  vitaminB2: '비타민B2',
  vitaminB6: '비타민B6',
  vitaminB12: '비타민B12',
  vitaminC: '비타민C',
  vitaminD: '비타민D',
  vitaminE: '비타민E',
  vitaminK: '비타민K',
  calcium: '칼슘',
  phosphorus: '인',
  iron: '철',
  zinc: '아연',
  magnesium: '마그네슘',
  potassium: '칼륨',
  totalDietaryFiber: '식이섬유',
  cholesterol: '콜레스테롤',
  transFattyAcid: '트랜스지방',
  saturatedFattyAcid: '포화지방',
  totalSugars: '당류'
};

// 식사 타입 매핑 - 백엔드 Enum 값으로 직접 매핑
const MEAL_TYPE_MAPPING: Record<string, string> = {
  '아침': MEAL_TYPE_ENUM.BREAKFAST,
  '점심': MEAL_TYPE_ENUM.LUNCH,
  '저녁': MEAL_TYPE_ENUM.DINNER,
  '간식': MEAL_TYPE_ENUM.SNACK
};

// 음식 타입 정의
interface FoodItem {
  name: string;
  nutrition: Record<string, number>;
  [key: string]: any;
}

// 선택된 음식 타입 정의
interface SelectedFood {
  food: FoodItem;
  amount: string;
  unit: string;
  calculatedNutrition: Record<string, number>;
  tempAmount: string; // 임시 입력값을 저장하기 위한 필드
}

// 결과 타입 정의
interface FoodResult {
  foods: FoodItem[];
  [key: string]: any;
}

// FoodUploadResultScreen 컴포넌트
const FoodUploadResultScreen = () => {
  const route = useRoute<FoodUploadResultScreenRouteProp>();
  const navigation = useNavigation<FoodUploadNavigationProp>();
  const {result, imageUri} = route.params as { result: FoodResult; imageUri: string };
  
  const [mealType, setMealType] = useState('아침');
  const [loading, setLoading] = useState(false);
  
    // 영양소 계산 함수 - 인분에 따라 영양소 값 계산
  const calculateNutrition = (nutrition: Record<string, number>, amount: number): Record<string, number> => {
    const result: Record<string, number> = {};
    
    // 원본 영양소 값에 인분 값을 곱함
    Object.entries(nutrition).forEach(([key, value]) => {
      result[key] = value * amount;
    });
    
    return result;
  };

  // 음식 선택 관리
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>(
    // 초기값으로 첫 번째 음식 설정
    result.foods.length > 0 
      ? [
          {
            food: result.foods[0],
            amount: '1',
            unit: '인분',
            calculatedNutrition: calculateNutrition(result.foods[0]?.nutrition || {}, 1),
            tempAmount: '1' // 임시 입력값을 저장하기 위한 필드
          }
        ] 
      : []
  );
  
  // 음식 이름 문자열 관리 - '|' 구분자로 연결
  const [selectedFoodNames, setSelectedFoodNames] = useState<string>(
    result.foods.length > 0 ? result.foods[0].name : ''
  );
  
  // 선택되지 않은 음식 목록 관리
  const [unselectedFoods, setUnselectedFoods] = useState<FoodItem[]>(
    result.foods.length > 1 ? result.foods.slice(1) : []
  );
  
  // 총 영양소 값 계산
  const [totalNutrition, setTotalNutrition] = useState<Record<string, number>>({});
  
  // 총 영양소 값 업데이트
  useEffect(() => {
    // selectedFoods가 유효한 배열인지 확인
    if (!Array.isArray(selectedFoods)) {
      console.log('경고: selectedFoods가 배열이 아닙니다:', selectedFoods);
      setTotalNutrition({});
      return;
    }
    
    const newTotalNutrition: Record<string, number> = {};
    
    // 모든 선택된 음식의 영양소 값 합산
    selectedFoods.forEach((item, index) => {
      // 디버깅용 로그 추가
      if (!item) {
        console.log(`경고: selectedFoods[${index}]가 undefined입니다`);
        return;
      }
      
      if (!item.calculatedNutrition) {
        console.log(`경고: selectedFoods[${index}].calculatedNutrition이 없습니다`);
        return;
      }
      
      try {
        Object.entries(item.calculatedNutrition).forEach(([key, value]) => {
          // value가 유효한 숫자인지 확인
          const numValue = Number(value);
          
          // -1은 실제 계산에서는 무시하고, 0보다 큰 값만 합산
          if (!isNaN(numValue) && numValue !== -1 && numValue > 0) {
            if (newTotalNutrition[key]) {
              newTotalNutrition[key] += numValue;
            } else {
              newTotalNutrition[key] = numValue;
            }
          } else if (!isNaN(numValue) && numValue === -1) {
            // -1인 값은 그대로 유지 (데이터 보존)
            if (!newTotalNutrition[key]) {
              newTotalNutrition[key] = -1;
            }
          }
        });
      } catch (error) {
        console.error(`selectedFoods[${index}] 처리 중 오류:`, error);
      }
    });
    
    // 총 값을 소수점 두 자리까지 정확하게 처리
    Object.keys(newTotalNutrition).forEach(key => {
      if (newTotalNutrition[key] !== -1) {
        // -1이 아닌 값만 소수점 두 자리까지 정확하게 처리
        newTotalNutrition[key] = parseFloat(newTotalNutrition[key].toFixed(2));
      }
    });
    
    setTotalNutrition(newTotalNutrition);
  }, [selectedFoods]);

  // 영양소 값 필터링하여 FoodNutrientCard에 표시할 형태로 변환
  const getNutrientItems = (nutrition: Record<string, number>) => {
    const items = [];
    
    for (const [key, value] of Object.entries(nutrition)) {
      // -1인 값은 화면 표시 시에만 0으로 변환 (데이터 자체는 변경하지 않음)
      // 칼로리, 탄수화물, 단백질, 지방은 위에 이미 표시되어 있으므로 제외
      const displayValue = value === -1 ? 0 : value;
      
      // 0보다 큰 값만 표시
      if (displayValue > 0 && !['energy', 'carbohydrate', 'protein', 'fat'].includes(key)) {
        const label = NUTRIENT_NAMES[key as keyof typeof NUTRIENT_NAMES] || key;
        let formattedValue = '';
        
        // 단위 설정 (소수점 두자리까지 표시)
        if (['sodium', 'calcium', 'phosphorus', 'iron', 'zinc', 'magnesium', 'potassium', 'vitaminA', 'vitaminB1', 'vitaminB2', 'vitaminB6', 'vitaminB12', 'vitaminC', 'vitaminD', 'vitaminE', 'vitaminK', 'cholesterol'].includes(key)) {
          formattedValue = `${displayValue.toFixed(2)} mg`;
        } else {
          formattedValue = `${displayValue.toFixed(2)} g`;
        }
        
        items.push({
          label,
          value: formattedValue
        });
      }
    }
    
    return items;
  };
  
  // 총 영양소 정보를 기반으로 영양소 항목 생성
  const totalNutrientItems = useMemo(() => {
    return getNutrientItems(totalNutrition);
  }, [totalNutrition]);

  

  // 음식 추가 처리
  const addFood = (food: FoodItem) => {
    if (!food || !food.nutrition) {
      Alert.alert('오류', '유효하지 않은 음식 데이터입니다.');
      return;
    }
    
    // 이미 선택된 음식인지 확인
    const alreadySelected = selectedFoods.some(item => item.food.name === food.name);
    if (alreadySelected) {
      Alert.alert('알림', '이미 선택된 음식입니다.');
      return;
    }
    
    // 선택된 음식 목록에 추가
    setSelectedFoods(prev => [
      ...prev,
      {
        food,
        amount: '1',
        unit: '인분',
        calculatedNutrition: calculateNutrition(food.nutrition, 1),
        tempAmount: '1' // 임시 입력값 초기화
      }
    ]);
    
    // 음식 이름 문자열 업데이트 - '|' 구분자로 연결
    setSelectedFoodNames(prev => {
      // 처음 추가되는 음식이면 구분자 없이 이름만 추가
      if (!prev || prev.trim() === '') return food.name;
      // 이미 음식이 있으면 '|' 구분자로 연결
      return `${prev}|${food.name}`;
    });
    
    // 선택되지 않은 음식 목록에서 제거
    setUnselectedFoods(prev => prev.filter(item => item.name !== food.name));
  };
  
  // 음식 제거
  const removeFood = (index: number) => {
    try {
      console.log('삭제 시작 - 현재 음식 개수:', selectedFoods.length, '삭제할 인덱스:', index);
      
      // selectedFoods가 유효한 배열인지 확인
      if (!Array.isArray(selectedFoods)) {
        console.error('selectedFoods가 배열이 아닙니다:', selectedFoods);
        return;
      }
      
      // 마지막 하나만 남은 경우 삭제하지 않음
      if (selectedFoods.length <= 1) {
        console.log('마지막 하나의 음식은 삭제할 수 없습니다');
        Alert.alert('알림', '최소 한 개의 음식은 유지되어야 합니다.');
        return;
      }
      
      // 인덱스 유효성 검사
      if (index < 0 || index >= selectedFoods.length) {
        console.error('유효하지 않은 인덱스:', index, 'selectedFoods 길이:', selectedFoods.length);
        return;
      }
      
      // 삭제할 음식 정보 로그 (디버깅용)
      const foodToRemove = selectedFoods[index];
      console.log('삭제할 음식:', foodToRemove?.food?.name);
      
      // 새 배열 생성 및 해당 인덱스 삭제
      const newSelectedFoods = selectedFoods.filter((_, i) => i !== index);
      console.log('삭제 후 음식 개수:', newSelectedFoods.length);
      
      // 음식 이름 문자열에서 해당 음식 제거
      if (foodToRemove && foodToRemove.food) {
        const foodNameToRemove = foodToRemove.food.name;
        setSelectedFoodNames(prev => {
          // 이름 문자열을 배열로 분리
          const namesArray = prev.split('|');
          // 해당 음식 이름 제거
          const filteredArray = namesArray.filter(name => name !== foodNameToRemove);
          
          // 다시 문자열로 합치기 - 단, 하나만 남은 경우 '|' 구분자 없이 이름만 반환
          if (filteredArray.length === 1) {
            return filteredArray[0];
          }
          return filteredArray.join('|');
        });
        
        // 삭제된 음식을 unselectedFoods에 다시 추가
        setUnselectedFoods(prev => [...prev, foodToRemove.food]);
      }
      
      setSelectedFoods(newSelectedFoods);
    } catch (error) {
      console.error('음식 삭제 중 오류:', error);
      Alert.alert('오류', '음식 삭제 중 오류가 발생했습니다.');
    }
  };
  


  // 서버에 데이터 제출
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // 식사 유형 변환 (한글 -> 백엔드 Enum 값)
      const serverMealType = MEAL_TYPE_MAPPING[mealType as keyof typeof MEAL_TYPE_MAPPING] || MEAL_TYPE_ENUM.BREAKFAST;
      
      console.log('제출할 식사 유형:', mealType, '->', serverMealType);
      console.log('제출할 음식 이름 문자열:', selectedFoodNames);
      console.log('제출할 총 영양소:', totalNutrition);
      
      // 1. 여러 음식을 하나로 합쳐서 전송하도록 수정
      // 총 섭취량 계산 (모든 음식의 eatAmount 합)
      const totalEatAmount = selectedFoods.reduce((total, item) => {
        return total + (parseFloat(item.amount) || 1);
      }, 0);
      
      // 2. 하나의 통합된 음식 데이터 생성
      const combinedFoodData = {
        name: selectedFoodNames.split('|')[0], // 첫 번째 음식 이름을 대표 이름으로 사용
        fullName: selectedFoodNames, // 전체 이름은 combinedFoodNames와 동일하게 설정
        eatAmount: parseFloat(totalEatAmount.toFixed(2)), // 총 섭취량 (소수점 두 자리까지)
        nutrition: totalNutrition, // 합산된 영양소 정보 사용
        combinedFoodNames: selectedFoodNames // 모든 음식 이름을 '|'로 구분하여 저장
      };
      
      // 3. 단일 음식 데이터를 배열에 담아 전송
      const foodsData = [combinedFoodData];
      
      console.log('제출할 통합 음식 데이터:', foodsData);
      
      // API 호출 - 새로운 postMealData 함수 사용
      const response = await postMealData(serverMealType, imageUri, foodsData);
      console.log('🍽️ 음식 데이터 제출 성공:', response);
      
      // 성공 메시지 표시
      if (Platform.OS === 'android') {
        ToastAndroid.show('제출 완료', ToastAndroid.SHORT);
      } else {
        Alert.alert('알림', '제출이 완료되었습니다.');
      }
      
      // 메인 화면으로 이동 - 중첩 네비게이터에서 루트 네비게이터로 이동
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Main'}],
        })
      );
    } catch (error) {
      console.error('음식 데이터 제출 오류:', error);
      Alert.alert('오류', '음식 데이터 제출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 총 칼로리 계산
  const totalCalories = totalNutrition.energy ? totalNutrition.energy : 0;
  
  // 영양소 비율 계산 (MultiNutrientProgressBar용)
  const carbohydrateRatio = totalNutrition.carbohydrate && totalCalories > 0 ? totalNutrition.carbohydrate * 4 / totalCalories * 100 : 0;
  const proteinRatio = totalNutrition.protein && totalCalories > 0 ? totalNutrition.protein * 4 / totalCalories * 100 : 0;
  const fatRatio = totalNutrition.fat && totalCalories > 0 ? totalNutrition.fat * 9 / totalCalories * 100 : 0;
  
  // 원래 영양소 값 (레전드 텍스트용) - 방어적 코딩 적용
  const carbValue = selectedFoods.reduce((acc: number, item: SelectedFood) => {
    // item이 undefined이거나 calculatedNutrition이 없는 경우 처리
    if (!item || !item.calculatedNutrition) return acc;
    return acc + (item.calculatedNutrition.carbohydrate || 0);
  }, 0);
  
  const proteinValue = selectedFoods.reduce((acc: number, item: SelectedFood) => {
    if (!item || !item.calculatedNutrition) return acc;
    return acc + (item.calculatedNutrition.protein || 0);
  }, 0);
  
  const fatValue = selectedFoods.reduce((acc: number, item: SelectedFood) => {
    if (!item || !item.calculatedNutrition) return acc;
    return acc + (item.calculatedNutrition.fat || 0);
  }, 0);
  
  return (
    <>
      <CommonHeader title="음식 사진 업로드" />

      <FoodImage
        source={{
          uri: imageUri,
        }}
      />

      <Container>
        <TitleRow>
          <FoodTitle>음식 정보</FoodTitle>

          <MealTypeContainer>
            <MealTypeLabel>식사 유형:</MealTypeLabel>
            <CustomDropdown
              value={mealType}
              options={['아침', '점심', '저녁', '간식']}
              onSelect={(value) => setMealType(value)}
              width={80}
            />
          </MealTypeContainer>
        </TitleRow>

        <AltFoodRow>
          {unselectedFoods.length > 0 ? (
            <>
              <AltFoodLabel>추가할 음식:</AltFoodLabel>
              <FlatList
                data={unselectedFoods}
                horizontal
                keyExtractor={(item: FoodItem, index: number) => `alt-food-${index}`}
                renderItem={({item, index}: {item: FoodItem, index: number}) => {
                  // item이 유효한지 확인
                  if (!item || !item.name || !item.nutrition) {
                    console.log(`경고: 대체 음식[${index}]가 유효하지 않습니다:`, item);
                    return null;
                  }
                  
                  return (
                    <AltFoodButton 
                      onPress={() => {
                        try {
                          console.log(`음식 추가: ${index}, ${item.name}`);
                          addFood(item);
                        } catch (error) {
                          console.error('음식 추가 중 오류:', error);
                          Alert.alert('오류', '음식 추가 중 오류가 발생했습니다.');
                        }
                      }}
                    >
                      <AltFoodText>{item.name}</AltFoodText>
                    </AltFoodButton>
                  );
                }}
              />
            </>
          ) : (
            <AltFoodText>추가할 수 있는 음식이 없습니다</AltFoodText>
          )}
        </AltFoodRow>

        <SummaryRow>
          <SummaryLabel>총 섭취량</SummaryLabel>
          <KcalText>{totalCalories.toFixed(2)}kcal</KcalText>
        </SummaryRow>

        <MultiNutrientProgressBar
          carbohydrate={carbohydrateRatio}
          protein={proteinRatio}
          fat={fatRatio}
          carbValue={carbValue}
          proteinValue={proteinValue}
          fatValue={fatValue}
        />
        <FoodCardsTitle>선택된 음식 ({selectedFoods.length}개)</FoodCardsTitle>
        <FoodCardsScrollView>
          {selectedFoods.map((item, index) => {
            // item이 유효한지 확인
            if (!item) {
              console.log(`경고: selectedFoods[${index}]가 undefined입니다`);
              return null;
            }
            
            // food 속성이 유효한지 확인
            if (!item.food) {
              console.log(`경고: selectedFoods[${index}].food가 undefined입니다`);
              return null;
            }
            
            // calculatedNutrition 속성이 유효한지 확인
            if (!item.calculatedNutrition) {
              console.log(`경고: selectedFoods[${index}].calculatedNutrition이 undefined입니다`);
              return null;
            }
            
            // 에너지 값 계산 (안전하게)
            const energyValue = item.calculatedNutrition.energy || 0;
            const amountValue = parseFloat(item.amount || '1');
            const energyPerServing = amountValue > 0 ? (energyValue / amountValue).toFixed(2) : '0';
            
            // 고유한 키 생성 (음식 이름 + 인덱스)
            const foodKey = `food-${item.food.name}-${index}`;
            
            // 개별 음식의 영양소 항목 생성
            const foodNutrientItems = getNutrientItems(item.calculatedNutrition);
            
            return (
              <FoodCardWrapper key={foodKey}>
                <FoodNutrientCard
                  foodName={item.food.name || '이름 없음'}
                  servingInfo={`1인분
${energyPerServing}kcal`}
                  nutrients={foodNutrientItems}
                  unit={item.unit}
                  inputValue={item.tempAmount || '1'}
                  onUnitChange={(unit: string) => {
                    try {
                      console.log(`단위 변경: ${index}, ${unit}`);
                      const newSelectedFoods = [...selectedFoods];
                      if (newSelectedFoods[index]) {
                        newSelectedFoods[index].unit = unit;
                        setSelectedFoods(newSelectedFoods);
                      }
                    } catch (error) {
                      console.error('단위 변경 중 오류:', error);
                    }
                  }}
                  onInputChange={(amount: string) => {
                    try {
                      console.log(`임시 수량 변경: ${index}, ${amount}`);
                      const newSelectedFoods = [...selectedFoods];
                      if (newSelectedFoods[index]) {
                        // 임시 수량 값만 업데이트 (실제 계산에는 영향 없음)
                        newSelectedFoods[index].tempAmount = amount;
                        setSelectedFoods(newSelectedFoods);
                      }
                    } catch (error) {
                      console.error('수량 변경 중 오류:', error);
                    }
                  }}
                  onInput={() => {
                    try {
                      const tempAmount = selectedFoods[index]?.tempAmount || '';
                      console.log(`입력 완료: ${index}, 값: ${tempAmount}`);
                      
                      // 임시 값을 실제 amount에 적용하고 영양소 계산
                      const newSelectedFoods = [...selectedFoods];
                      if (newSelectedFoods[index]) {
                        // 빈 문자열이면 기본값 1로 설정
                        const finalAmount = tempAmount.trim() === '' ? '1' : tempAmount;
                        const amountValue = parseFloat(finalAmount) || 1;
                        
                        // 실제 amount 값 업데이트
                        newSelectedFoods[index].amount = finalAmount;
                        newSelectedFoods[index].tempAmount = finalAmount;
                        
                        // 영양소 값 재계산
                        newSelectedFoods[index].calculatedNutrition = calculateNutrition(
                          newSelectedFoods[index].food.nutrition,
                          amountValue
                        );
                        
                        setSelectedFoods(newSelectedFoods);
                      }
                    } catch (error) {
                      console.error('입력 완료 중 오류:', error);
                    }
                  }}
                  showRemoveButton={selectedFoods.length > 1}
                  onRemove={() => {
                    console.log(`삭제 버튼 클릭: ${index}`);
                    removeFood(index);
                  }}
                />
              </FoodCardWrapper>
            );
          })}
        </FoodCardsScrollView>

        <Divider style={{ marginTop: 10 }} />
        
        <BottomButtons>
          <SubmitButton onPress={handleSubmit} disabled={loading}>
            <SubmitText>{loading ? '제출 중...' : '제출하기'}</SubmitText>
          </SubmitButton>
          <CancelButton onPress={() => navigation.goBack()}>
            <CancelText>취소</CancelText>
          </CancelButton>
        </BottomButtons>
      </Container>
    </>
  );
};

export default FoodUploadResultScreen;

const FoodImage = styled.Image`
  margin-top: -6px;
  width: 100%;
  height: 200px;
`;

const Container = styled.View`
  flex: 1;
  margin-top: -20px;
  border-radius: 12px;
  background-color: #fff;
  padding-horizontal: 16px;
`;

const TitleContainer = styled.View`
  padding: 20px;
  padding-bottom: 0;
`;

const TitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const FoodTitle = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #000;
`;

// 커스텀 드롭다운 컴포넌트
interface CustomDropdownProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  width?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onSelect, width = 80 }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer style={{ width }}>
      <DropdownButton onPress={() => setIsOpen(true)}>
        <DropdownButtonText>{value}</DropdownButtonText>
        <DropdownArrow>▼</DropdownArrow>
      </DropdownButton>

      <Modal
        transparent={true}
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <ModalOverlay onPress={() => setIsOpen(false)}>
          <ModalContent>
            {options.map((option, index) => (
              <OptionButton
                key={index}
                onPress={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                isSelected={option === value}
              >
                <OptionText isSelected={option === value}>{option}</OptionText>
              </OptionButton>
            ))}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.View`
  position: relative;
`;

const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding-horizontal: 12px;
  border: 1px solid #d95b72;
  border-radius: 8px;
  background-color: white;
`;

const DropdownButtonText = styled.Text`
  font-size: 12px;
  color: #333;
  font-family: 'Pretendard-Medium';
  margin-right: 4px;
`;

const DropdownArrow = styled.Text`
  font-size: 12px;
  color: #d95b72;
  font-weight: bold;
`;

const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 150px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(217, 91, 114, 0.3);
  background-color: #FFF8F8;
  max-height: 200px;
`;

const OptionButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding: 10px 16px;
  background-color: ${(props: { isSelected: boolean }) => props.isSelected ? 'rgba(217, 91, 114, 0.15)' : 'white'};
  border-bottom-width: ${(props: { isSelected: boolean }) => props.isSelected ? '0' : '1px'};
  border-bottom-color: rgba(217, 91, 114, 0.1);
  height: 36px;
  justify-content: center;
  align-items: center;
`;

const OptionText = styled.Text<{ isSelected: boolean }>`
  font-size: 13px;
  color: ${(props: { isSelected: boolean }) => props.isSelected ? '#d95b72' : '#333'};
  font-family: ${(props: { isSelected: boolean }) => props.isSelected ? 'Pretendard-SemiBold' : 'Pretendard-Regular'};
  text-align: center;
`;

const AltFoodRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 10px;
  align-items: center;
`;

const AltFoodLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  color: #333;
  margin-right: 8px;
`;

const AltFoodButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  border-radius: 6px;
  padding: 6px 14px;
  margin-right: 8px;
`;

const AltFoodText = styled.Text`
  font-size: 10px;
  color: #d95b72;
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const SummaryLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: black;
`;

const KcalText = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Bold';
  color: black;
`;

const Divider = styled.View`
  height: 1px;
  background-color: rgba(115, 26, 34, 0.5);
  margin-horizontal: -16px;
`;

const BoldDivider = styled.View`
  height: 6px;
  background-color: rgba(115, 26, 34, 0.5);
  margin-top: 8px;
  margin-horizontal: -16px;
`;

const FoodDivider = styled.View`
  height: 2px;
  background-color: rgba(217, 91, 114, 0.3);
  margin-vertical: 12px;
  margin-horizontal: -6px;
  border-radius: 1px;
`;

const FoodCardsScrollView = styled.ScrollView`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FoodCardsTitle = styled.Text`
  font-size: 16px;
  font-family: 'Pretendard-Bold';
  color: #333;
  margin-top: 20px;
  margin-bottom: 12px;
`;

const FoodCardWrapper = styled.View`
  margin-bottom: 16px;
  border: 1px solid rgba(217, 91, 114, 0.2);
  border-radius: 8px;
  padding: 12px;
  background-color: #FFFAFA;
`;

const MealTypeRow = styled.View`
  padding-vertical: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MealTypeContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;


const MealTypeLabel = styled.Text`
  color: black;
  font-size: 14px;
  font-family: 'Pretendard-SemiBold';
  margin-right: 12px;
`;

const FoodSearchInput = styled.TextInput`
  width: 115px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
`;

const BottomButtons = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  border-top-width: 1px;
  border-color: #eee;
  margin-top: auto;
  margin-horizontal: -16px;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #d95b72;
  width: 150px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const SubmitText = styled.Text`
  color: #fff;
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  border: 1px solid #d95b72;
  width: 150px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const CancelText = styled.Text`
  color: #d95b72;
  font-size: 14px;
`;
