import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../utils/OrderComponents/Header';
import { navigate } from '../../../navigation/NavigationUtils';

interface Address {
    id: string;
    name: string;
    details: string;
}

const addressList: Address[] = [
    { id: '1', name: '우리집', details: '광주 북구 용봉동 ' },
    { id: '2', name: '회사', details: '광주 서구 대남대로 ' },
    { id: '3', name: '강원 원성군 ', details: '둔내면 고원로 ' },
    { id: '4', name: '전남 목포시 ', details: '해안로' },
    { id: '5', name: '광주 북구 용봉로 ', details: '용봉로 77 백도 1층' },
    { id: '6', name: '양산시 덕천장로 ', details: '덕천장로 ' },
];

const AddressSettingScreen = () => {
    const [selectedAddress, setSelectedAddress] = useState<string | null>('1');

    return (
        <SafeAreaView style={styles.container}>
            <Header title="주소 설정" />
            <View style={styles.container}>

                <TouchableOpacity onPress={() => navigate('AddressSearchScreen')} style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="black" />

                    <Text style={styles.buttonText}>지번, 도로명, 건물명으로 검색</Text>
                </TouchableOpacity>
                <Pressable style={styles.locationButton} onPress={() => alert('현재 위치 찾기')}>
                    <Ionicons name="locate" size={20} color="white" />
                    <Text style={styles.locationButtonText}>현재 위치로 찾기</Text>
                </Pressable>

                <FlatList
                    data={addressList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.addressItem}
                            onPress={() => setSelectedAddress(item.id)}
                        >
                            <View>
                                <Text style={styles.addressName}>{item.name}</Text>
                                <Text style={styles.addressDetails}>{item.details}</Text>
                            </View>
                            {selectedAddress === item.id && <Ionicons name="checkmark" size={20} color="blue" />}
                        </Pressable>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginBottom: 16,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        marginBottom: 16,
    },
    locationButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    buttonText: {
        marginLeft: 8,
        fontSize: 16,
    },
    addressItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    addressName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressDetails: {
        fontSize: 14,
        color: '#666',
    },
});

export default AddressSettingScreen;
