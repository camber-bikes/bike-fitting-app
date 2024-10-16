import { BASE_URL } from "@/constants/Api";
import { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function History() {
  const { person } = useContext(PersonContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateScanUUID } = useContext(ScanContext);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const fetchData = async () => {
    //  await fetch(`${BASE_URL}/person/${person_uuid}/scans`);
    const resp = await fetch(`${BASE_URL}/persons/${person.uuid}/scans`);
    const data = await resp.json();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(data);
  return (
    <View>
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.textloader}>
            Loading your results, please hang on
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                updateScanUUID(item.scan_uuid);
                navigate("results");
              }}
            >
              <Text>Scan number: {item.scan_uuid}</Text>
            </Pressable>
          )}
        ></FlatList>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly dim the background
  },
  textloader: {
    color: "white",
  },
});
