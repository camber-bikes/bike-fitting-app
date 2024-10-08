import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, PixelRatio, Button, View, Text, Image, Platform, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Video from 'react-native-video';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import InstructionCard from '../../components/Results/InstructionCard'
import { useVideoPlayer, VideoView } from 'expo-video';

const videoSource =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export default function ResultsScreen() {
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
    <Text style={styles.title}>Saddle Adjustment Instructions</Text>
      <div style={styles.videoContainer}>
          <VideoView
                  ref={ref}
                  style={styles.video}
                  player={player}
                  resizeMode="contain"
                  useNativeControls={false}
                />
          </div>
      <View style={styles.instructionsContainer}>
        <InstructionCard direction={"up"} amount={+2}></InstructionCard>
        <InstructionCard direction={"down"} amount={+2}></InstructionCard>
        <InstructionCard direction={"left"} amount={+2}></InstructionCard>
        <InstructionCard direction={"right"} amount={+2}></InstructionCard>
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
    marginBottom: 20,
    marginTop: "10%",
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9, // Makes the video container responsive with a 16:9 ratio
    marginBottom: 30,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'black', // Ensures the background is black while the video loads
  },
  instructionsContainer: {
    width: '100%',
  },
});

