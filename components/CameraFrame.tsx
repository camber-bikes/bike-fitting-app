import { CameraView, CameraType, useCameraPermissions, CameraMode, CameraPictureOptions, useMicrophonePermissions } from 'expo-camera';
import {useState, useRef, useContext} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraAction from './CameraAction';
import {useNavigation} from "@react-navigation/native";
import {ScanContext} from "@/app/index";


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

    const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(base64);  // Decode base64
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });  // Create a Blob from byte arrays
        return blob;
    };

    async function handleTakePicture() {
        const response = await cameraRef.current?.takePictureAsync(pictureSettings);
        const binary = base64ToBlob(response!.base64.split(',')[1], 'image/jpg')
        setMedia(response!.uri);
        const formData = new FormData();
        formData.append('file', binary, 'image.jpg');
        const photo_response = await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${scan_uuid}/photos/body`, {
            method: 'POST',
            body: formData, // Send form data with the file
        });
        navigation.navigate('recordVideo')
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

