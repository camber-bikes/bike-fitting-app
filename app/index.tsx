import { Text, StyleSheet, View, Dimensions, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "@/constants/Api";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import Button from "../components/Button";
<<<<<<< HEAD
import { Person } from "../lib/types";
import createScan from "@/lib/api";
=======
import { Person } from "@/components/types";
import { ThemedText } from "@/components/ThemedText";
>>>>>>> 2bcb22a (Added Godmode Dark Mode)

export const PersonContext = React.createContext<{
  person: Person;
  updatePerson: (person: Person) => void;
}>({
  person: { name: "default", uuid: null, height: 0 },
  updatePerson: () => {},
});

export const ScanContext = React.createContext<{
  scan_uuid: string;
  updateScanUUID: (newUuid: string) => void;
}>({ scan_uuid: "", updateScanUUID: () => {} });

export default function HomeScreen() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const { person } = useContext(PersonContext);
  const { updateScanUUID } = useContext(ScanContext);
  const [nextSite, setNextSite] = useState("personinformation");

  fetch(`${BASE_URL}/healthcheck`).catch((err) => {
    console.error(err);
    Alert.alert("Error", "the api is not healthy");
  });

  const handleClick = () => {
    if (!person) {
      navigate("personinformation");
      return;
    }

    const addScan = async () => {
      try {
        const scan = await createScan(person?.uuid ?? "");
        updateScanUUID(scan?.scan_uuid ?? "");
        setNextSite("photo-tutorial");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to create scan");
      }
    };

    addScan();

    navigate("photo-tutorial");
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.homeImage}
        source={require("../assets/images/sascha.jpeg")}
        contentFit="cover"
      /> 
      <View style={styles.titleView}>
        <ThemedText style={styles.title}>Start bike fitting</ThemedText>
      </View>
      <View style={styles.button}>
        {person && (
          <Button
            type="secondary"
            onPress={() => navigate("history")}
            title="History"
          />
        )}
        <Button type="primary" onPress={handleClick} title="Start scan" />
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
