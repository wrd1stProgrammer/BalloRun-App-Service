import React, { useState } from 'react';
import { View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { navigate,goBack } from '../../../navigation/NavigationUtils';

const FourthScreen = () => {
  const [terms, setTerms] = useState([false, false, false]);
  const [allAgreed, setAllAgreed] = useState(false);

  const toggleTerm = (index: number) => {
    const newTerms = [...terms];
    newTerms[index] = !newTerms[index];
    setTerms(newTerms);
    setAllAgreed(newTerms.every(term => term));
  };

  const toggleAll = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setTerms(terms.map(() => newValue));
  };

  const handleComplete = () => {
    if (allAgreed) {
      console.log('회원가입 완료');
      // 완료 로직 추가
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.checkboxRow} onPress={toggleAll}>
          <Text style={styles.checkbox}>{allAgreed ? '✅' : '⬜'}</Text>
          <Text style={styles.checkboxText}>모두 동의</Text>
        </TouchableOpacity>
        {[0, 1, 2].map(index => (
          <TouchableOpacity key={index} style={styles.checkboxRow} onPress={() => toggleTerm(index)}>
            <Text style={styles.checkbox}>{terms[index] ? '✅' : '⬜'}</Text>
            <Text style={styles.checkboxText}>약관 {index + 1}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.nextButton, !allAgreed && styles.disabledButton]}
          onPress={handleComplete}
          disabled={!allAgreed}
        >
          <Text style={styles.nextButtonText}>완료</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  inner: { padding: 20, flex: 1, justifyContent: 'center' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { fontSize: 20, marginRight: 10 },
  checkboxText: { fontSize: 16 },
  nextButton: { backgroundColor: '#6200EE', padding: 15, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#B0BEC5' },
  nextButtonText: { color: '#FFFFFF', fontSize: 16 },
  backButton: { marginTop: 10, alignItems: 'center' },
  backButtonText: { color: '#6200EE', fontSize: 14 },
});

export default FourthScreen;