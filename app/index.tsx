import { Card, Text } from 'react-native-paper';
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import React from "react";
import { Image } from 'expo-image';
import { Pressable } from "expo-router/build/views/Pressable";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export const PersonContext = React.createContext({ person: { name: "Rudi", uuid: "none" } });
export const ScanContext = React.createContext({});

export default function HomeScreen() {
    const BASE_URL = 'https://backend-489080704622.us-west2.run.app';
    //fetch(BASE_URL + '/api/healthcheck');
    const navigation = useNavigation();

    return (
            <View style={styles.container}>
                <Image
                    style={styles.homeImage}
                    source={require("../assets/images/sascha.jpeg")}
                    contentFit='cover'
                />
                <View style={styles.overlayContainer}>
                    <Card style={styles.overlayCard}>
                        <Text style={styles.title}>Start bike fitting</Text>
                        <Pressable onPress={() => navigation.navigate('personinformation', {})} style={styles.cameraAction}>
                            <FontAwesome5 name='record-vinyl' size="50l" color="red" />
                        </Pressable>
                    </Card>
                </View>
            </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    homeImage: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlayContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingBottom: 20, // Adjust padding for spacing
    },
    overlayCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 18,
        marginHorizontal: 16,
        padding: 16,
        marginBottom: 0,
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    actionAdvice: {
        fontWeight: "bold",
        marginTop: 8,
    },
    cameraAction: {
        alignItems: 'center',
    },
});
