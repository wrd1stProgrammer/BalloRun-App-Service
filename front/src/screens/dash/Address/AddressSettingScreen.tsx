import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../utils/OrderComponents/Header';
import { navigate } from '../../../navigation/NavigationUtils';
import { useAppSelector } from '../../../redux/config/reduxHook';
import { selectUser } from '../../../redux/reducers/userSlice';
import { appAxios } from '../../../redux/config/apiConfig';

interface Address {
    _id: string;
    address: string;
    detail: string;
}

const AddressSettingScreen = () => {
    const user = useAppSelector(selectUser); // Get logged-in user info
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [addressList, setAddressList] = useState<Address[]>([]);

    useEffect(() => {
        if (!user?._id) return; // Ensure user is logged in before fetching data

        const fetchAddresses = async () => {
            try {
                const response = await appAxios.get(`/address/list/${user._id}`); // Fetch addresses from the backend
                setAddressList(response.data);
            } catch (error) {
                console.error('❌ Failed to fetch addresses:', error);
            }
        };

        fetchAddresses();
    }, [user]);

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
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.addressItem}
                            onPress={() => setSelectedAddress(item._id)}
                        >
                            <View>
                                <Text style={styles.addressName}>{item.address}</Text>
                                <Text style={styles.addressDetails}>{item.detail}</Text>
                            </View>
                            {selectedAddress === item._id && <Ionicons name="checkmark" size={20} color="blue" />}
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
