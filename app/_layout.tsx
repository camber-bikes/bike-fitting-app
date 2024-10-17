import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { PersonContext, ScanContext } from "@/app/index";

import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native-reanimated/lib/typescript/Animated";
import { Person } from "@/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [scan_uuid, setScanUUID] = useState("Initial Value");
  const [person, setPerson] = useState<Person>({
    name: "",
    uuid: "",
    height: 0,
  });
  const updateScanUUID = (newScanUUID) => {
    setScanUUID(newScanUUID);
  };
  const updatePerson = (newPerson: Person) => {
    setPerson(newPerson);
  };

  useEffect(() => {
    async function getPerson() {
      try {
        const jsonValue = await AsyncStorage.getItem("person");
        const val =
          jsonValue != null ? JSON.parse(JSON.parse(jsonValue)) : null;
        updatePerson(val);
      } catch (e) {
        // read error
      }
    }
    getPerson();
  }, []);
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <ScanContext.Provider value={{ scan_uuid, updateScanUUID }}>
      <PersonContext.Provider value={{ person, updatePerson }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="personinformation"
              options={{ title: "Person Information" }}
            />
            <Stack.Screen
              name="photo-tutorial"
              options={{ title: "Photo tutorial" }}
            />
            <Stack.Screen
              name="video-tutorial"
              options={{ title: "Video tutorial" }}
            />
            <Stack.Screen name="results" options={{ title: "Results" }} />
            <Stack.Screen
              name="recordPhoto"
              options={{ title: "Take a photo of your whole body" }}
            />
            <Stack.Screen
              name="recordVideo"
              options={{ title: "Take a photo of your on bike pedalling " }}
            />
            <Stack.Screen
              name="history"
              options={{ title: "Previous Scans " }}
            />
          </Stack>
        </ThemeProvider>
      </PersonContext.Provider>
    </ScanContext.Provider>
  );
}
