import { CameraView, CameraType, useCameraPermissions, CameraMode, CameraPictureOptions, useMicrophonePermissions, CameraCapturedPicture, CameraRecordingOptions } from 'expo-camera';
import {useState, useRef, useContext} from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraAction from './CameraAction';
import {useNavigation} from "@react-navigation/native";
import {ScanContext} from "@/app/index";
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';


interface CameraFrameProps {
    /*handleTakePicture: () => void;*/
    setMedia: (mediaUri: CameraCapturedPicture) => void; 
    cameraMode: CameraMode;
    setIsMediaRecorded: (isMediaRecorded: boolean) => void;
    setUuid: (uuid: string) => void
    
}
export function CameraFrame({ setMedia, cameraMode, setIsMediaRecorded, setUuid }: CameraFrameProps ) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [pictureSize, setPictureSize] = useState<string | undefined>();
    const [pictureSettings, setPictureSettings] = useState<CameraPictureOptions>({
        imageType: "jpg",
        base64: true,
    });
    const [videoSettings, setVideoSettings] = useState<CameraRecordingOptions>({
       maxDuration:20
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

    const handleCameraReady = async () => {

        setCameraReady(true);

        const availableSizes = await cameraRef.current?.getAvailablePictureSizesAsync();
        console.log(availableSizes);

        console.log('Camera is ready');

        if (availableSizes && availableSizes.includes("1920x1080")) {
            // Set the largest available size (max resolution)
            setPictureSize("1920x1080");
        }
    };


    async function handleTakePicture() {
        
        const response = await cameraRef.current?.takePictureAsync(pictureSettings);
        console.log(response!.uri);
        console.log("Scan UUID Handle Take Picture: s" + scan_uuid);
        
        setUuid(scan_uuid);
        setMedia(response!);  
        setIsMediaRecorded(true);
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

            const video_response = await fetch(`https://backend-489080704622.us-west2.run.app/api/scans/${scan_uuid}/videos/pedalling`, {
                method: 'POST',
                body: formData,
            });
            Alert.alert('Success', video_response.status.toString());
        }
    }

    return (
        <View style={styles.container}>
            <CameraView 
                pictureSize={pictureSize}
                ref={cameraRef} 
                videoStabilizationMode='off'
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

