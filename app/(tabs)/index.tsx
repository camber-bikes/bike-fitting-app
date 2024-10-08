import { Button, Card, Text} from 'react-native-paper';
import {StyleSheet} from "react-native";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Link} from "expo-router";
import {Pressable} from "expo-router/build/views/Pressable";

export default function HomeScreen() {
        const navigation = useNavigation();

        const styles = StyleSheet.create({
                title: {
                        textAlign: 'center',  // Centers the text horizontally
                        fontSize: 20,         // You can adjust the font size
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
                        borderRadius: 15,
                        width: "75%",
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
                        borderColor: 'black'
                },
                actionAdvice: {
                        fontWeight: "bold"
                }
        });

        return (
            <Card style={{width: "100%", height: "100%", display: "flex", justifyContent: "center"}}>
                    <Text styile={styles.title}>Camber Bikes</Text>
                    <Card.Content>
                            <div style={styles.contentAlignment}>
                                    <img style={styles.homeImage} src="../assets/images/AngertyBike.jpg" />
                                    <div style={styles.actionContainer}>
                                            <Link href="/tutorial" asChild>
                                                    <Pressable>
                                                            <Button style={styles.recordingButton}></Button>
                                                    </Pressable>
                                            </Link>
                                            <p style={styles.actionAdvice}>Start recording</p>
                                    </div>
                            </div>
                    </Card.Content>
            </Card>
        );
}