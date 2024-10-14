import { CameraView, CameraType, useCameraPermissions, CameraMode, CameraPictureOptions, useMicrophonePermissions } from 'expo-camera';
import {useState, useRef, useContext} from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraAction from './CameraAction';
import {useNavigation} from "@react-navigation/native";
import {ScanContext} from "@/app/index";
import * as FileSystem from 'expo-file-system';


interface CameraFrameProps {
    /*handleTakePicture: () => void;*/
    setMedia: (mediaUri: string) => void; 
    cameraMode: CameraMode;
}
export function CameraFrame({setMedia, cameraMode}:CameraFrameProps) {
    const navigation = useNavigation();
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [videoTracking, setVideoTracking] = useState<string>("");
    const [picture, setPicture] = useState<string>("");
    const [pictureSettings, setPictureSettings] = useState<CameraPictureOptions>({
        imageType: "jpg",
        base64: true
    });
    const { scan_uuid } = useContext(ScanContext);


    if (!cameraPermission || !audioPermission) {
        // Camera and microphone permissions are still loading.
        return <View />;
    }

    if (!cameraPermission.granted || !audioPermission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestCameraPermission} title="grant camera permission" />
                <Button onPress={requestAudioPermission} title="grant microphone permission" />
            </View>
        );
    }

    const handleCameraReady = () => {
        setCameraReady(true);
        console.log('Camera is ready');
    };

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    /*const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
        const base64DecodeChars = (input) => {
            const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            const base64Lookup = new Uint8Array(256);

            for (let i = 0; i < base64Chars.length; i++) {
                base64Lookup[base64Chars.charCodeAt(i)] = i;
            }

            const output = [];
            let buffer = 0;
            let bits = 0;

            console.log(input)
            for (let i = 0; i < input.length; i++) {
                const c = input.charCodeAt(i);
                if (c === 61) {  // '=' character (padding)
                    break;
                }

                buffer = (buffer << 6) | base64Lookup[c];
                bits += 6;

                if (bits >= 8) {
                    bits -= 8;
                    output.push((buffer >> bits) & 0xff);
                }
            }

            return output;
        };

        const byteCharacters = base64DecodeChars(base64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteArray = new Uint8Array(slice);
            byteArrays.push(byteArray);
        }
        console.log("Hello");
        console.log(byteArrays)
        try {
            const blob = new Blob(byteArrays, { type: contentType });  // Create a Blob from byte arrays

            console.log(blob);
            return blob;
        } catch (error) {
            console.error("new Blob function failed")
        }
        

        
    };*/

    const base64ToBlob = async (base64: string, filename: string) => {
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return fileUri; // Use this file URI to upload
    };


    async function handleTakePicture() {
        const response = await cameraRef.current?.takePictureAsync(pictureSettings);
        //Alert.alert('success', response!.base64);
        console.log("Yes I");
        
        const fileUri = await base64ToBlob(response!.base64, 'image.jpg');
        console.log("Binary: ");
        
        //console.log(binary);
        
        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        const photo_response = await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${scan_uuid}/photos/body`, {
            method: 'POST',
            body: formData,
        });

        navigation.navigate('recordVideo');
    }
    
    async function toggleRecord() {
        if (isRecording) {
            cameraRef.current?.stopRecording();
            setIsRecording(false);
        } else {
            setIsRecording(true);
            const response = await cameraRef.current?.recordAsync();
            let tempVariable = response!.uri;
            setMedia(tempVariable);
        }
    }

    return (
        <View style={styles.container}>
            <CameraView 
                ref={cameraRef} 
                mode={cameraMode} 
                style={styles.camera} 
                facing={facing} 
                mute={true} 
                onCameraReady={() => handleCameraReady()}>
                <View style={styles.buttonContainer}>
                    {cameraReady && <TouchableOpacity style={styles.cameraAction}>
                        <CameraAction cameraMode={cameraMode} isRecording={isRecording} handleCameraShutter={cameraMode === "picture" ? handleTakePicture : toggleRecord}/>
                    </TouchableOpacity>}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    cameraAction: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
});

