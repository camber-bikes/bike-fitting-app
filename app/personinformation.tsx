import {
  Text,
  Keyboard,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { PersonContext } from "@/app/index";
import { ScanContext } from "@/app/index";
import { BASE_URL } from "@/constants/Api";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Button from "../components/Button";

export default function PersonInformationScreen() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const isButtonDisabled = !name || !height;
  const { person } = useContext(PersonContext);
  const { updateScanUUID } = useContext(ScanContext);

    const handleHeightChange = (value : string) => {
        if (/^\d*$/.test(value)) {  // Allow only numeric input
            setHeight(value);
        }
    };


  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      console.log(isUploading);
      
      const numericHeight = parseInt(height);
      if (isNaN(numericHeight) || numericHeight < 50 || numericHeight > 300) {
        Alert.alert("Invalid height", "Please enter your height in cm.");
        return;
      }
      const person_response = await fetch(`${BASE_URL}/persons/information`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          height_cm: height,
        }),
      });
      const person_data = await person_response.json();
      person.uuid = person_data.uuid;
    
      const scan_response = await fetch(`${BASE_URL}/scans/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person_uuid: person.uuid,
        }),
      });
      const scan_data = await scan_response.json();
      updateScanUUID(scan_data.scan_uuid);
      navigate("photo-tutorial");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "could not create new scan");
    }
    finally{
        setIsUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.questionText}>What's your name?</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            placeholderTextColor="#999"
          />
          <Text style={styles.questionText}>How tall are you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Height in cm"
            value={height}
            onChangeText={handleHeightChange}
            keyboardType="numeric"
            placeholderTextColor="#999"
            maxLength={3}
          />    
          <Button
            onPress={handleSubmit}
            title="Next"
            disabled={isButtonDisabled}
            style={styles.button}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    marginTop: 35,
    paddingVertical: 12,
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly dim the background
  },
  textloader:{
    color:"white",
  }
});
