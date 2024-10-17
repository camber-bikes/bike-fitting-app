import { BASE_URL } from "@/constants/Api";
import { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  Image,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  useColorScheme,
} from "react-native";

import { ScanContext } from "@/app/index";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { PersonContext } from "@/app/index";
import { Scan } from "@/lib/types";
import { FlipInEasyX } from "react-native-reanimated";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);
import { ThemedText } from "@/components/ThemedText";


export default function History() {
  const { person } = useContext(PersonContext);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateScanUUID } = useContext(ScanContext);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const timeAgo = new TimeAgo("en-US");
  const offset = new Date().getTimezoneOffset();
  const colorScheme = useColorScheme();
  const cardTheme = colorScheme === 'light' ? styles.lightCard : styles.darkCard;

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`${BASE_URL}/persons/${person.uuid}/scans`);
      const data = await resp.json();
      setScans(data);
      setLoading(false);
    };
    if (person) {
      fetchData();
    }
  }, [person]);

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.textloader}>
          Loading your results, please hang on
        </Text>
      </View>
    );
  }
  return (
    <View>
      <FlatList
        data={scans}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              updateScanUUID(item.scan_uuid ?? "");
              navigate("results");
            }}
          >
            <View style={[styles.entry, cardTheme]}>
              <Image
                style={{ height: 100, width: 100, resizeMode: "fill" }}
                source={{
                  uri: `${BASE_URL}/scans/${item.scan_uuid}/photos/body.jpg`,
                }}
              />
              <View>
                <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
                  Past Scan
                </ThemedText>
                <ThemedText>
                  {timeAgo.format(
                    new Date(
                      new Date(item.created_at).getTime() - offset * 60000,
                    ),
                  )}
                </ThemedText>
              </View>
              <View
                style={{
                  alignSelf: "center",
                  marginLeft: "auto",
                  paddingRight: 20,
                }}
              >
                <FontAwesome5 
                  name={"chevron-right"}
                  size={25}
                  color={colorScheme === 'light' ? ("black"):("white")}
                />
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  entry: {
    backgroundColor: "#ddd",
    display: "flex",
    flexDirection: "row",
    borderBottomWidth:2,
    borderBottomColor:"#fff",
    gap: 10,
  },
  darkCard:{
    backgroundColor:"#282828",
  },
  lightCard:{},
  textloader: {
    color: "white",
  },
});
