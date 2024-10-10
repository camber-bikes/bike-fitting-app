// import Ionicons from '@expo/vector-icons/Ionicons';
// import { StyleSheet, ActivityIndicator, PixelRatio, Button, View, Text, Image, Platform, ScrollView } from 'react-native';
// import { useEffect, useRef, useState } from 'react';
// import Video from 'react-native-video';
// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import InstructionCard from '../components/Results/InstructionCard'
// import { useVideoPlayer, VideoView } from 'expo-video';

import InstructionCard from "@/components/Results/InstructionCard";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, ScrollView, Text, View } from "react-native";


export default function ResultsScreen() {

    const BASE_URL = 'http://localhost:8000';
    const SCAN_UUID = '5430be3a-d14d-427a-b6d2-c0a774744a96';

        const [videoSource] = useState(BASE_URL + '/api/scans/' + SCAN_UUID + '/videos/pedalling.mp4')
        const ref = useRef(null);
        const [isPlaying, setIsPlaying] = useState(true);
        const [loading, setLoading] = useState(true);
        const [result_x, setResultX] = useState(-100);
        const [result_y, setResultY] = useState(-100);
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


  useEffect(() => {
      let interval: any;
      const checkEndpoint = async () => {
        try {
          const uri = BASE_URL + '/api/scans/' + SCAN_UUID + '/result';
          console.log("fetching: " + uri)
          const response = await fetch(uri);
          const data = await response.json();
          if (data.done) {
            setResultX(data.saddle_x_cm);
            setResultY(data.saddle_y_cm);
            setLoading(false); // Remove blur and spinner when finished
            clearInterval(interval)
          }
        } catch (error) {
          console.error('Error fetching endpoint:', error);
        }
      };

        interval = setInterval(checkEndpoint, 1000); // Poll every 2 seconds
        return () => clearInterval(interval); // Clean up on unmount
    }, [loading]);

  return (
    <ScrollView>
     {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
    )}
        <View>
        <Text style={styles.title}>Results</Text>
          <View style={styles.videoContainer}>
              <VideoView
                      ref={ref}
                      style={styles.video}
                      player={player}
                      resizeMode="contain"
                      useNativeControls={false}
                    />
              </View>
          </View>  
          <View style={styles.instructionsContainer}>
            <InstructionCard direction={result_x > 0 ? "up" : "down"} amount={Math.round(result_x * 10) / 10}></InstructionCard>
            <InstructionCard direction={result_y > 0 ? "left" : "right"} amount={Math.round(result_y * 10) / 10}></InstructionCard>
          </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: "80%", // Responsive title size
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom:   "10%",
    marginTop: "10%",
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Makes the video container responsive with a 16:9 ratio
    marginBottom: 30,
  },
  video: {
    width: '94%',
//     height: '100%',
    borderRadius: 5,
    marginLeft: "3%",
    backgroundColor: 'black', // Ensures the background is black while the video loads
  },
  instructionsContainer: {
    width: '100%',
  },
  loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)', // Adds a blur effect with opacity
      zIndex: 1, // Ensures the overlay is on top of the rest
    },
});

