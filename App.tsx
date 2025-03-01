import React, {useEffect, useState} from 'react';
import {ScrollView, ActivityIndicator, View, Text} from 'react-native';
import SupplementCard from './src/components/Card/SupplementCard';
import {fetchSupplements} from './src/api/api';

interface Supplement {
  id: number;
  imageUrl: string;
  category: string;
  name: string;
  description: string;
}

const App = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSupplements = async () => {
      try {
        const data = await fetchSupplements();
        setSupplements(data);
      } catch (error) {
        console.error('보충제 데이터를 불러오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSupplements();
  }, []);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % supplements.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + supplements.length) % supplements.length,
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#D94C4C" />
      </View>
    );
  }

  if (supplements.length === 0) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{alignItems: 'center', paddingVertical: 20}}>
      <SupplementCard
        supplement={supplements[currentIndex]}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </ScrollView>
  );
};

export default App;
