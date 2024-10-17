import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Animated,
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  useColorScheme,
} from "react-native";
import Button from "../Button";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ParamListBase } from "@react-navigation/native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

type Direction = "up" | "down" | "left" | "right";

export default function InstructionCard({
  direction,
  amount,
}: {
  direction: Direction;
  amount: number;
}) {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [isToggled, setIsToggled] = useState(false);
  const [heightAnimation] = useState(new Animated.Value(0));
  const colorScheme = useColorScheme();
  const cardThemeBackground = colorScheme === 'light' ? styles.lightCardBackground : styles.darkCardBackground;

  const toggleAccordion = () => {
    setIsToggled((old) => !old);

    Animated.timing(heightAnimation, {
      toValue: isToggled ? 0 : 150,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <Pressable onPress={toggleAccordion}>
        <View style={[styles.card, cardThemeBackground]}>
          <View style={[styles.cardTitle]}>
            <View style={styles.iconHolder}>
              <View style={styles.saddleIconContainer}>
                <Image
                  source={colorScheme === 'light' ? (require("@/assets/images/saddle-dark.png")):(require("@/assets/images/saddle-light.png"))}
                  style={styles.saddleIcon}
                />
              </View>
              <FontAwesome5
                name={"arrow-" + direction}
                style={[styles.arrowIcon, cardThemeBackground]}
              />
            </View>
            <Text style={[styles.resultText, cardThemeBackground]}>{`${amount} cm`}</Text>
            <Text style={[styles.resultText, cardThemeBackground]}>{`Move saddle ${direction}`}</Text>
          </View>
        </View>
        <Animated.View style={{ height: heightAnimation }}>
          {isToggled && (
            <ThemedView style={[cardThemeBackground]}>
              <ThemedText style={[styles.resultText, cardThemeBackground]}>
                {direction == "up"
                  ? `Your saddle is too low. Adjust it by ${amount} cm to achieve an optimal knee angle for improved cycling efficiency and long-term joint health.`
                  : direction == "down"
                    ? `Your saddle is too high. Lower it by ${amount} cm for optimal knee alignment, improving both performance and comfort while preventing strain.`
                    : direction == "left"
                      ? `Your saddle is too far right. Shift it ${amount} cm to the left to maintain an optimal posture, ensuring better elbow and back alignment for healthier cycling.`
                      : direction == "right"
                        ? `Your saddle is too far left. Shift it ${amount} cm to the right for optimal balance, which enhances your back posture and promotes healthy joint movement.`
                        : ""}
              </ThemedText>
            </ThemedView>
          )}
        </Animated.View>
      </Pressable>
      <View style={styles.buttons}>
        <Button
          style={styles.button}
          type="secondary"
          onPress={() => navigate("history")}
          title="History"
        />
        <Button
          style={styles.button}
          onPress={() => navigate("index")}
          title="Home"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 20,
    padding: 10,
    margin: 10,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  cardTitle: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },

  saddleIconContainer: {
    width: 25,
    aspectRatio: 1,
    marginLeft:50
  },
  saddleIcon: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  arrowIcon: {
    height: "10%",
    width: "10%",
    alignSelf: "center",
  },
  iconHolder: {
    width: 100,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttons: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom:20
    
  },
  button: {
    width: "45%",
  },
  lightCardBackground:{
    backgroundColor:"#fff",
    color: "#11181C"
  },
  darkCardBackground: {
    backgroundColor: "#282828",
    color: "#ECEDEE"
  }
});
