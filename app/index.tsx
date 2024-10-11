import { Button, Card, Text} from 'react-native-paper';
import { StyleSheet, View, ScrollView} from "react-native";
import React from "react";
import { Image } from 'expo-image';
import {Pressable} from "expo-router/build/views/Pressable";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function HomeScreen() {
        const  BASE_URL = 'http://localhost:8000';
          fetch(BASE_URL + '/api/healthcheck')
        const navigation = useNavigation();


        return (
        
        <SafeAreaView>
            <ScrollView>
                <Card style={{width: "100%", height: "100%", display: "flex", justifyContent: "center"}}>
                        <Text style={styles.title}>Camber Bikes</Text>
                        <Card.Content>                        
                                <View style={styles.container}>
                                        <Image 
                                                style={styles.homeImage} 
                                                source={require("../assets/images/AngertyBike.jpg")} 
                                                contentFit='cover'
                                                />
                                </View>
                                <View style={styles.contentAlignment}>    
                                    <View style={styles.buttonContainer}>
                                        <Pressable onPress={() => navigation.navigate('tutorial', {})} style={styles.cameraAction}>    
                                                <SymbolView
                                                        name= "circle.inset.filled"
                                                        size={90}
                                                        type="palette"
                                                        colors={["red", "#a7a7a7"]}
                                                        fallback={ 
                                                                <FontAwesome5
                                                                        name = "circle"
                                                                        size={90}
                                                                        color={"red"}
                                                                />
                                                        }
                                                />
                                                <Text style={styles.actionAdvice}>Start Bike Fitting</Text>
                                            </Pressable>
                                    </View>
                                </View>
                        </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
        );
}

const styles = StyleSheet.create({
        container: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
        },
        title: {
                textAlign: 'center',  // Centers the text horizontally
                fontSize: '40%',         // You can adjust the font size
                fontWeight: 'bold',   // Optional: makes the title bold
                marginBottom: "5%",
                marginTop: "5%"
        },
        contentAlignment: {
                width: "100%",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center"
        },
        homeImage: {
                width: 320,
                height: 440,
                borderRadius: 18,
                
        },
        actionContainer: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
        },
        recordingButton: {
                width: 60,
                height: 60,
                marginTop: "5%",
                backgroundColor: "red",
                borderRadius: 30,
                borderWidth: 4,           // Border width of 2 pixels
                borderColor: 'black',
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
        },
        actionAdvice: {
                fontWeight: "bold"
        },
        cameraAction: {
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
        },
        buttonContainer: {
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'transparent',
                margin: 64,
        },
});