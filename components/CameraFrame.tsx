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



    const base64ToBlob = async (base64: string, filename: string) => {
        const fileUri = `${FileSystem.cacheDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        return fileUri; // Use this file URI to upload
    };


    async function handleTakePicture() {
        const response = await cameraRef.current?.takePictureAsync(pictureSettings);
        const fileUri = await base64ToBlob(response!.base64, 'image.jpg');
        const formData = new FormData();

        formData.append('file', {
            uri: fileUri,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${scan_uuid}/photos/body`, {
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
            const videoData = await cameraRef.current.recordAsync();
            const formData = new FormData();
            Alert.alert('URI URI', videoData!.uri);

            formData.append('file', {
                uri: videoData!.uri,
                type: 'video/quicktime',
                name: 'video.mov',
            });

            const video_response = await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${scan_uuid}/videos/cycling`, {
                method: 'POST',
                body: formData,
            });
            Alert.alert('Success', video_response.status.toString());
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

