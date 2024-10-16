import {
  StyleSheet,
  View,
  Image,
  Text,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

export default function Tutorial({
  nextScreen,
  imageSource,
  title,
  description,
}: {
  nextScreen: string;
  imageSource: ImageSourcePropType;
  title: string;
  description: string;
}) {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image style={styles.image} source={imageSource} />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.paragraph}>{description}</Text>
      </View>
      <View style={styles.buttonStyle}>
        <Button onPress={() => navigate(nextScreen)} title="next" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  topSection: {
    backgroundColor: "#ddd",
    width: "100%",
    height: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    height: "50%",
    display: "flex",
    padding: 30,
  },
  image: {
    resizeMode: "contain",
    height: 300,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  paragraph: {
    marginTop: 20,
    fontSize: 15,
  },
  buttonStyle: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: "auto",
    marginBottom: 30,
  },
});
