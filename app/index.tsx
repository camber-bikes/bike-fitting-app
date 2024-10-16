import { Text, StyleSheet, View, Dimensions, Alert } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@/constants/Api";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Button from "../components/Button";

export const PersonContext = React.createContext({
  person: { name: "Rudi", uuid: "none" },
});

export const ScanContext = React.createContext<{
  scan_uuid: string;
  updateScanUUID: (newUuid: string) => void;
}>({ scan_uuid: "", updateScanUUID: () => {} });

export default function HomeScreen() {
  fetch(`${BASE_URL}/healthcheck`).catch((err) => {
    console.error(err);
    Alert.alert("Error", "the api is not healthy");
  });

  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <Image
        style={styles.homeImage}
        source={require("../assets/images/sascha.jpeg")}
        contentFit="cover"
      />
      <View style={styles.titleView}>
        <Text style={styles.title}>Start bike fitting</Text>
      </View>
      <View style={styles.button}>
        <Button
          type="secondary"
          onPress={() => navigate("personinformation")}
          title="Start scan"
        />
        <Button
          type="primary"
          onPress={() => navigate("personinformation")}
          title="Start scan"
        />
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  titleView: {
    position: "absolute",
    top: 0,
    width: "100%",
    paddingTop: 70,
  },
  title: {
    textAlign: "center",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 16,
  },
  homeImage: {
    width: width,
    height: height + 100, // I don't know why, but without this the Image does not stretch over the whole screen on my phone
    position: "absolute",
    top: 0,
    left: 0,
  },
  button: {
    position: "absolute",
    paddingHorizontal: 20,
    gap: 15,
    bottom: 0,
    width: "100%",
    paddingBottom: 40,
  },
});
