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
import { Person } from "@/lib/types";
import { Alert, StatusBar } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { storage } from "@/lib/mmkv";

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
  const updateScanUUID = (newScanUUID: string) => {
    setScanUUID(newScanUUID);
  };
  const updatePerson = (newPerson: Person) => {
    setPerson(newPerson);
  };

  useEffect(() => {
    function getPerson() {
      if (storage.contains('person')) {
        const jsonValue = storage.getString('person')
        const val =
          jsonValue != null ? JSON.parse(JSON.parse(jsonValue)) : null;
        updatePerson(val)

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
          <StatusBar barStyle={useThemeColor({}, "text")} backgroundColor={useThemeColor({}, "background")} />
          <Stack>
            <Stack.Screen
              name="index"
              options={{ headerShown: false, title: "Home" }}
            />
            <Stack.Screen
              name="personinformation"
              options={{ title: "Person Information", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="photo-tutorial"
              options={{ title: "Photo tutorial", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="video-tutorial"
              options={{ title: "Video tutorial", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="results"
              options={{ title: "Results", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="recordPhoto"
              options={{ title: "Take picture", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="recordVideo"
              options={{ title: "Record the video", headerBackTitle: "Back" }}
            />
            <Stack.Screen
              name="history"
              options={{ title: "Previous Scans", headerBackTitle: "Back" }}
            />
          </Stack>
        </ThemeProvider>
      </PersonContext.Provider>
    </ScanContext.Provider>
  );
}
