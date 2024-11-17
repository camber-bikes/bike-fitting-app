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
  useColorScheme,
} from "react-native";
import React, { useState } from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { PersonContext } from "@/app/index";
import { ScanContext } from "@/app/index";
import { BASE_URL } from "@/constants/Api";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Button from "../components/Button";
import createScan from "@/lib/api";
import { Person } from "@/lib/types";
import { ThemedText } from "@/components/ThemedText";
import { storage } from "@/lib/mmkv";

export default function PersonInformationScreen() {
  const colorScheme = useColorScheme();
  const themeTextInputStyle =
    colorScheme === "light"
      ? styles.lightThemeTextInput
      : styles.darkThemeTextInput;
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const isButtonDisabled = !name || !height;
  const { updateScanUUID } = useContext(ScanContext);
  const { updatePerson } = useContext(PersonContext);

  const handleHeightChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      // Allow only numeric input
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
      const person: Person = {
        uuid: person_data.uuid,
        name: person_data.name,
        height: person_data.height,
      };
      updatePerson(person);

      try {
        const jsonValue = JSON.stringify(JSON.stringify(person));
        storage.set('person', jsonValue)
      } catch (e) {
        console.error("Error Saving Person to Local KV Store");
      }

      const scan = await createScan(person?.uuid ?? "");
      updateScanUUID(scan.scan_uuid ?? "");

      navigate("photo-tutorial");
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "could not create new scan");
    } finally {
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
          <ThemedText style={styles.questionText}>What's your name?</ThemedText>
          <TextInput
            style={[styles.input, themeTextInputStyle]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            keyboardType="default"
            placeholderTextColor="#999"
          />
          <ThemedText style={styles.questionText}>How tall are you?</ThemedText>
          <TextInput
            style={[styles.input, themeTextInputStyle]}
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
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
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
  lightThemeTextInput: {
    color: "#11181C",
  },
  darkThemeTextInput: {
    color: "#ECEDEE",
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
  textloader: {
    color: "white",
  },
});
