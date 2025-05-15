import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface SurveyPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onParticipate: () => void;
}

const SurveyPromptModal = ({
  visible,
  onClose,
  onParticipate,
}: SurveyPromptModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.text}>
            설문조사를 참여하시면
            {'\n'}
            저희가 맞춤 서비스를 제공해드릴 수 있어요.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.participateButton}
              onPress={onParticipate}>
              <Text style={styles.participateText}>참여하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <Text style={styles.skipText}>나중에</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  text: {fontSize: 14, color: '#111', textAlign: 'center', marginBottom: 24},
  buttonContainer: {flexDirection: 'row', gap: 12},
  participateButton: {backgroundColor: '#E44F68', padding: 10, borderRadius: 8},
  skipButton: {
    borderWidth: 1,
    borderColor: '#E44F68',
    padding: 10,
    borderRadius: 8,
  },
  participateText: {color: '#fff', fontWeight: 'bold'},
  skipText: {color: '#E44F68', fontWeight: 'bold'},
});

export default SurveyPromptModal;
