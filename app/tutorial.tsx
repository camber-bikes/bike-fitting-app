import {StyleSheet, Button, View, Image, TextInput, Text, ScrollView   } from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useVideoPlayer, VideoView} from 'expo-video';
import {useNavigation} from "@react-navigation/native";


export default function TutorialScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Image source={require("../assets/images/recordPhoto.svg")} style={styles.image} />
        <Text style={styles.text}>Take an image of you next to your bike</Text>
      </View>
      <View style={styles.section}>
        <Image source={require("../assets/images/recordVideo.svg")} style={styles.image} />
        <Text style={styles.text}>Record yourself pedalling backwards</Text>
      </View>
      <Button
        onPress={() => navigation.navigate("results")}
        title="Next"
        color="#de78b2"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
//     backgroundColor: '#000', // Set background color to black
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    resizeMode: 'contain', // Ensures the image fits
//     aspectRatio: 3 / 1, // Makes the video container responsive with a 16:9 ratio
  },
  text: {
//     color: '#fff', // Set text color to white
    fontSize: 18,
  },
});


