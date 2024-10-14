import {StyleSheet, Button, View, TextInput, Text, ScrollView   } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useVideoPlayer, VideoView} from 'expo-video';
import {useNavigation} from "@react-navigation/native";

const videoSource =
    'https://videos.pexels.com/video-files/15465878/15465878-hd_1080_1920_30fps.mp4';

export default function TutorialScreen() {
    const [height, setHeight] = useState(''); // State for height input
    const [isButtonEnabled, setButtonEnabled] = useState(false);
    const navigation = useNavigation();

    const handleHeightChange = (value) => {
        setHeight(value);
        // Enable button only if the height is entered and is a valid number
        setButtonEnabled(value.trim() !== '' && !isNaN(value));
    };

    const handleStartButtonPress = () => {
        // Handle the start button press event
        console.log('Start button pressed with height:', height);
    };
    const ref = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const player = useVideoPlayer(videoSource, player => {
        player.loop = true;
        player.play();
    });

    useEffect(() => {
        const subscription = player.addListener('playingChange', isPlaying => {
            setIsPlaying(isPlaying);
        });

        return () => {
            subscription.remove();
        };
    }, [player]);
    return (
        <ScrollView>
            <View>
                <Button
                    onPress={() => navigation.navigate("recordPhoto")}
                    children={undefined}
                    title={"Let's go"}
                    color={"#de78b2"}
                />
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center', // Centers content horizontally
    },
    title: {
        fontSize: "4vw", // Responsive title size
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: "10%",
        marginTop: "10%",
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9, // Makes the video container responsive with a 16:9 ratio
        marginBottom: 30,
    },
    video: {
        width: '94%',
        borderRadius: 5,
        marginLeft: "3%",
        backgroundColor: 'black', // Ensures the background is black while the video loads
    },
    instructionsContainer: {
        width: '100%',
        alignItems: 'center', // Center the input and button
    },
    input: {
        height: "3vh",
        width: '94%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        padding: "3%",
    },
    continueButton: {
        height: "100px",
    },
});