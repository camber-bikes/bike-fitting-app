import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useState } from "react";
import {
  Animated,
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

type Direction = "up" | "down" | "left" | "right";

export default function InstructionCard({
  direction,
  amount,
}: {
  direction: Direction;
  amount: number;
}) {
  const [isToggled, setIsToggled] = useState(false);
  const [heightAnimation] = useState(new Animated.Value(0)); // Height animation value

  const toggleAccordion = () => {
    setIsToggled((old) => !old);

    // Animate height change based on toggle state
    Animated.timing(heightAnimation, {
      toValue: isToggled ? 0 : 200, // You can adjust this to the content height
      duration: 300, // Animation duration (ms)
      useNativeDriver: false,
    }).start();
  };

  const correctArrowIcon = () => {
    switch (direction) {
      case "up":
        return <FontAwesome5 name="arrow-up" style={styles.arrowIcon} />;
      case "down":
        return <FontAwesome5 name="arrow-down" style={styles.arrowIcon} />;
      case "left":
        return <FontAwesome5 name="arrow-left" style={styles.arrowIcon} />;
      case "right":
        return <FontAwesome5 name="arrow-right" style={styles.arrowIcon} />;
      default:
        break;
    }
    // return (<Text>TestIcon</Text>);
  };

  return (
    <View>
      <Pressable onPress={toggleAccordion}>
        <View style={styles.card}>
          <View style={styles.cardTitle}>
            <View style={styles.iconHolder}>
              <View style={styles.saddleIconContainer}>
                <Image
                  source={require("@/assets/images/saddle.png")}
                  style={styles.saddleIcon}
                />
              </View>
              {correctArrowIcon()}
            </View>
            <Text style={styles.resultText}>{`${amount} cm`}</Text>
            <Text style={styles.resultText}>{`Move saddle ${direction}`}</Text>
          </View>
        </View>
        <Animated.View
          style={[styles.cardContent, { height: heightAnimation }]}
        >
          {isToggled && (
            <View>
              <Text style={styles.resultText}>
                arst arstoi oeiarnsto neioar nsetioa rnseiot nrseoat
                nseioarnsetio resiroa sr eorans to neriao snteio raoie
                tsneioarsnetio rnaesiot nersioa snteo rsneitao nseraio tnserioa
              </Text>
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  resultText: {
    fontSize: 20,
    padding: "2%",
    marginHorizontal: "3%",
    marginVertical: "3%",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: "3%",
    paddingHorizontal: "4%",
    marginBottom: "3%",
    borderRadius: 5,
    // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    width: "80%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  cardContent: {
  //   // overflow: 'text-wrap',
  //   transition: "height 0.3s ease",
  },
  saddleIconContainer: {
    width: 30,
    aspectRatio: 1,
    // position: 'relative',
  },
  saddleIcon: {
    // position: 'absolute',
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    // objectFit: "fit",
  },
  arrowIcon: {
    height: "10%",
    width: "10%",
    alignSelf: "center",
  },
  iconHolder: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
