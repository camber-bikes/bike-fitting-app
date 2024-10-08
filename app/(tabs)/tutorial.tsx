import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, PixelRatio, Button, View, TextInput, Text, Image, Platform, ScrollView } from 'react-native';
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
    'https://videos.pexels.com/video-files/15465878/15465878-hd_1080_1920_30fps.mp4';

export default function TutorialScreen() {
  const [height, setHeight] = useState(''); // State for height input
  const [isButtonEnabled, setButtonEnabled] = useState(false);

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
    <Text style={styles.title}>Tutorial</Text>
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
              <TextInput
                style={styles.input}
                placeholder="Enter height in cm"
                keyboardType="numeric"
                value={height}
                onChangeText={handleHeightChange} // Handle text input changes
              />
              <Button
                title="Next"
                style={styles.continueButton}
                onPress={handleStartButtonPress} // Handle button press
                disabled={!isButtonEnabled} // Disable button if conditions not met
                color={isButtonEnabled ? '#2196F3' : 'gray'} // Change color based on button state
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
    height: "100%",
    width: '94%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: "2%",
  },
  continueButton: {
    height: "100px",
  },
});