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
} from "react-native";

import { ScanContext } from "@/app/index";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { PersonContext } from "@/app/index";
import { Scan } from "@/lib/types";

export default function History() {
  const { person } = useContext(PersonContext);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateScanUUID } = useContext(ScanContext);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`${BASE_URL}/persons/${person.uuid}/scans`);
      const data = await resp.json();
      setScans(data);
      setLoading(false);
    };

    fetchData();
  }, []);

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
            <View style={styles.entry}>
              <Image
                style={{ height: 300, resizeMode: "contain" }}
                source={{
                  uri: /* "https://reactnative.dev/img/tiny_logo.png" */ `${BASE_URL}/scans/${item.scan_uuid}/photos/body.jpg`,
                }}
              />
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
  entry: { backgroundColor: "#ddd" },
  textloader: {
    color: "white",
  },
});
