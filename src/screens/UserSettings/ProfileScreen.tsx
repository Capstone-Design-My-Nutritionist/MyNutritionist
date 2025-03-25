<<<<<<< HEAD
import React, {useState, useRef, useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Shadow} from 'react-native-shadow-2';
import CustomToggle from '../../components/Toggle/CustomToggle';
import TimePickerModal from '../../components/Modal/TimePickerModal';

// 네비게이션 타입 정의
type RootStackParamList = {
  PasswordChangeScreen: undefined;
  NicknameChangeScreen: undefined;
  AccountDeleteScreen: undefined;
};

const ProfileScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isPushEnabled, setIsPushEnabled] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTimeType, setSelectedTimeType] = useState<
    'morning' | 'lunch' | 'dinner' | null
  >(null);

  const [morningTime, setMorningTime] = useState({hour: '08', minute: '00'});
  const [lunchTime, setLunchTime] = useState({hour: '12', minute: '00'});
  const [dinnerTime, setDinnerTime] = useState({hour: '18', minute: '00'});

  const openTimeModal = (type: 'morning' | 'lunch' | 'dinner') => {
    setSelectedTimeType(type);
    setModalVisible(true);
  };

  const handleTimeConfirm = (hour: string, minute: string) => {
    if (selectedTimeType === 'morning') setMorningTime({hour, minute});
    if (selectedTimeType === 'lunch') setLunchTime({hour, minute});
    if (selectedTimeType === 'dinner') setDinnerTime({hour, minute});
    setModalVisible(false);
  };

  return (
    <>
      <TitleWrapper>
        <Title>마이페이지</Title>
        <TitleUnderline />
      </TitleWrapper>

      <Container>
        <SectionTitle>정보수정</SectionTitle>
        <ShadowWrapper>
          <Shadow
            distance={4}
            offset={[0, 2]}
            startColor="rgba(0, 0, 0, 0.05)"
            style={{width: '100%', borderRadius: 8}}>
            <Card>
              <InfoRow>
                <Label>이메일</Label>
                <Value>*******@naver.com</Value>
              </InfoRow>
              <Touchable
                onPress={() => navigation.navigate('PasswordChangeScreen')}>
                <TextRow>
                  <TextLabel>비밀번호 변경</TextLabel>
                  <Arrow>＞</Arrow>
                </TextRow>
              </Touchable>
              <Touchable
                onPress={() => navigation.navigate('NicknameChangeScreen')}>
                <TextRow>
                  <TextLabel>닉네임 변경</TextLabel>
                  <Arrow>＞</Arrow>
                </TextRow>
              </Touchable>
              <Touchable
                onPress={() => navigation.navigate('AccountDeleteScreen')}>
                <TextRow>
                  <TextLabel>회원탈퇴</TextLabel>
                  <Arrow>＞</Arrow>
                </TextRow>
              </Touchable>
            </Card>
          </Shadow>
        </ShadowWrapper>

        <SectionTitle>설문조사하기</SectionTitle>
        <ShadowWrapper>
          <Shadow
            distance={4}
            offset={[0, 2]}
            startColor="rgba(0, 0, 0, 0.05)"
            style={{width: '100%', borderRadius: 8}}>
            <Card>
              {[
                '설문조사 다시하기',
                '신체정보 설문조사',
                '건강정보 설문조사',
                '생활습관 설문조사',
                '건강고민 설문조사',
                '복용약 설문조사',
              ].map((item, index) => (
                <Touchable
                  key={index}
                  onPress={() => console.log(`${item} 클릭됨`)}>
                  <TextRow>
                    <TextLabel>{item}</TextLabel>
                    <RowRight>
                      <RecentDate>최근 진행 2025.01.01</RecentDate>
                      <Arrow>＞</Arrow>
                    </RowRight>
                  </TextRow>
                </Touchable>
              ))}
            </Card>
          </Shadow>
        </ShadowWrapper>

        <SectionTitle>환경설정</SectionTitle>
        <ShadowWrapper>
          <Shadow
            distance={4}
            offset={[0, 2]}
            startColor="rgba(0, 0, 0, 0.05)"
            style={{width: '100%', borderRadius: 8}}>
            <Card>
              <PushRow>
                <TextLabel>푸쉬알림</TextLabel>
                <CustomToggle
                  value={isPushEnabled}
                  onToggle={() => setIsPushEnabled(prev => !prev)}
                />
              </PushRow>
              <TouchableWrapper
                onPress={() => isPushEnabled && openTimeModal('morning')}
                disabled={!isPushEnabled}>
                <TimeRow>
                  <TimeLabel isPushEnabled={isPushEnabled}>
                    아침 식사 시간
                  </TimeLabel>
                  <RowRight>
                    <TimeText isPushEnabled={isPushEnabled}>
                      {morningTime.hour}:{morningTime.minute}
                    </TimeText>
                    <Arrow isPushEnabled={isPushEnabled}>＞</Arrow>
                  </RowRight>
                </TimeRow>
              </TouchableWrapper>

              <TouchableWrapper
                onPress={() => isPushEnabled && openTimeModal('lunch')}
                disabled={!isPushEnabled}>
                <TimeRow>
                  <TimeLabel isPushEnabled={isPushEnabled}>
                    점심 식사 시간
                  </TimeLabel>
                  <RowRight>
                    <TimeText isPushEnabled={isPushEnabled}>
                      {lunchTime.hour}:{lunchTime.minute}
                    </TimeText>
                    <Arrow isPushEnabled={isPushEnabled}>＞</Arrow>
                  </RowRight>
                </TimeRow>
              </TouchableWrapper>

              <TouchableWrapper
                onPress={() => isPushEnabled && openTimeModal('dinner')}
                disabled={!isPushEnabled}>
                <TimeRow>
                  <TimeLabel isPushEnabled={isPushEnabled}>
                    저녁 식사 시간
                  </TimeLabel>
                  <RowRight>
                    <TimeText isPushEnabled={isPushEnabled}>
                      {dinnerTime.hour}:{dinnerTime.minute}
                    </TimeText>
                    <Arrow isPushEnabled={isPushEnabled}>＞</Arrow>
                  </RowRight>
                </TimeRow>
              </TouchableWrapper>
            </Card>
          </Shadow>
        </ShadowWrapper>
      </Container>

      {selectedTimeType && (
        <TimePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleTimeConfirm}
          title={
            selectedTimeType === 'morning'
              ? '아침 식사 시간'
              : selectedTimeType === 'lunch'
              ? '점심 식사 시간'
              : '저녁 식사 시간'
          }
          initialHour={
            selectedTimeType === 'morning'
              ? morningTime.hour
              : selectedTimeType === 'lunch'
              ? lunchTime.hour
              : dinnerTime.hour
          }
          initialMinute={
            selectedTimeType === 'morning'
              ? morningTime.minute
              : selectedTimeType === 'lunch'
              ? lunchTime.minute
              : dinnerTime.minute
          }
        />
      )}
    </>
  );
};

export default ProfileScreen;

const TitleWrapper = styled.View`
  background-color: #ffffff;
  padding-top: 11px;
`;
const Title = styled.Text`
  font-size: 18px;
  font-family: 'Pretendard-Bold';
  color: #731a22;
  text-align: center;
  margin-bottom: 11px;
`;
const TitleUnderline = styled.View`
  width: 100%;
  height: 1.3px;
  background-color: #731a22;
`;
const Container = styled.ScrollView`
  flex: 1;
  background-color: #fffbfb;
  padding: 14px;
`;
const SectionTitle = styled.Text`
  font-family: 'Pretendard-Bold';
  font-size: 18px;
  color: #731a22;
  margin-bottom: 4px;
`;
const ShadowWrapper = styled.View`
  margin-bottom: 12px;
`;
const Card = styled.View`
  background-color: #ffffff;
  border-radius: 8px;
  padding: 18px;
`;
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
`;
const Label = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 14px;
  color: #070c26;
`;
const Value = styled.Text`
  font-family: 'Pretendard-Regular';
  font-size: 12px;
  color: #d95b72;
`;
const Touchable = styled.TouchableOpacity``;
const TextRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 7px;
`;
const TextLabel = styled.Text`
  font-size: 14px;
  font-family: 'Pretendard-Regular';
  color: #070c26;
`;
const TouchableWrapper = styled.TouchableOpacity``;
interface ArrowProps {
  isPushEnabled?: boolean;
}
const Arrow = styled.Text<ArrowProps>(({isPushEnabled = true}) => ({
  color: isPushEnabled ? '#d95b72' : '#999999',
  fontSize: 14,
  marginLeft: 8,
}));
const RecentDate = styled.Text`
  font-size: 12px;
  color: #d95b72;
`;
const RowRight = styled.View`
  flex-direction: row;
  align-items: center;
`;
const PushRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;
const TimeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: 7px;
`;
interface TimeProps {
  isPushEnabled: boolean;
}

const TimeLabel = styled.Text<TimeProps>(({isPushEnabled}: TimeProps) => ({
  fontSize: 14,
  fontFamily: 'Pretendard-Regular',
  color: isPushEnabled ? '#070c26' : '#999999',
}));

const TimeText = styled.Text<TimeProps>(({isPushEnabled}: TimeProps) => ({
  fontSize: 12,
  color: isPushEnabled ? '#d95b72' : '#999999',
}));
=======
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>프로필 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; // ✅ default export 확인!!
>>>>>>> develop
