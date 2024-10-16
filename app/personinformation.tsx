import {
  Text,
  Button,
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
import { BASE_URL } from "@/constants/Colors";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export default function PersonInformationScreen() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const isButtonDisabled = !input1 || !input2;
  const { person } = useContext(PersonContext);
  const { updateScanUUID } = useContext(ScanContext);

  const handleSubmit = async () => {
    try {
      const person_response = await fetch(`${BASE_URL}/persons/information`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input1,
          height_cm: input2,
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
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {/* Input field for Name */}
        <View>
          <Text style={styles.questionText}>Wie heisst du?</Text>
          <TextInput
            style={styles.input}
            placeholder="Namen"
            value={input1}
            onChangeText={setInput1}
            keyboardType="default"
            placeholderTextColor="#999"
          />

          {/* Question for height */}
          <Text style={styles.questionText}>Wie gross bist du?</Text>

          {/* Input field for height */}
          <TextInput
            style={styles.input}
            placeholder="Größe in cm"
            value={input2}
            onChangeText={setInput2}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          {/* Submit button */}
          <Button
            onPress={handleSubmit}
            title="Weiter"
            color="#de78b2"
            disabled={isButtonDisabled}
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
});
