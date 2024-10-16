import {
  Button,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@/constants/Colors";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

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
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  button: {
    position: "absolute",
    paddingHorizontal: 30,
    bottom: 0,
    width: "100%",
    paddingBottom: 20,
  },
});
