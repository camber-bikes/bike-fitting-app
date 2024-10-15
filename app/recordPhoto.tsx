import { CameraFrame } from "@/components/CameraFrame";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import {useNavigation} from "@react-navigation/native";
import { CameraCapturedPicture } from "expo-camera";
import { ScanContext } from "@/app/index";
import * as FileSystem from 'expo-file-system';



export default function recordPhotoScreen() {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const[picture, setPicture] = useState<CameraCapturedPicture>()
    const[pictureTaken, setPictureTaken] = useState(false) 
    const [uuid,setUuid] = useState<string>();


    async function SaveImage(){
        if (!picture || !picture.base64) {
            Alert.alert("Error", "No image to upload");
            return;
        }
        const fileUri = await base64ToBlob(picture!.base64, 'image.jpg');
        console.log("Converted file URI: ", fileUri);
        
        
        

        // Prepare formData for the upload
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        console.log(formData);
        
        console.log(uuid);
        // Upload the image
        try {
            const photo_response = await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${uuid}/photos/body`, {
                method: 'POST',
                body: formData,
            });

            if (photo_response.ok) {
                Alert.alert("Success", "Image uploaded successfully");
                navigation.navigate('recordVideo');
            } else {
                Alert.alert("Error", "Failed to upload image");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            Alert.alert("Error", "Failed to upload image");
        }
    }

    

    const base64ToBlob = async (base64: string, filename: string) => {
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return fileUri; // Return the file URI for upload
    };

    return(
        
            <>
            {!pictureTaken ? (<CameraFrame setMedia={setPicture} cameraMode="picture" setIsMediaRecorded={setPictureTaken} setUuid={setUuid} ></CameraFrame>
            ) : (
                <View style={styles.container}>
                    <Stack.Screen
                        options={{
                            headerLeft: () => <Button onPress={() => SaveImage()} title="Delete Image" />,
                            headerRight: () => <Button onPress={() => SaveImage()} title="Save" />,
                        }}
                    />
                    <Image style={styles.image} source={picture?.uri}></Image>
                </View>
            )}
                
            </>
            );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
});