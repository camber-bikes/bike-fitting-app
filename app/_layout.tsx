import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';
import {ScanContext} from "@/app/index";


import {useColorScheme} from '@/hooks/useColorScheme';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });
    const [scan_uuid, setScanUUID] = useState('Initial Value');
    const updateScanUUID = (newScanUUID) => {
        setScanUUID(newScanUUID);
    };

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);



    return (
        <ScanContext.Provider value={{scan_uuid, updateScanUUID}}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: false}}/>
                    <Stack.Screen name="personinformation" options={{title: 'Person Information'}}/>
                    <Stack.Screen name="tutorial" options={{title: 'Tutorial'}}/>
                    <Stack.Screen name="results" options={{title: 'Results'}}/>
                    <Stack.Screen name="recordPhoto" options={{title: 'Take a photo of your whole body'}}/>
                    <Stack.Screen name="recordVideo" options={{title: 'Take a photo of your on bike pedalling '}}/>
                </Stack>
            </ThemeProvider>
        </ScanContext.Provider>

    );
}
