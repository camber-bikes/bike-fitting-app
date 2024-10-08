import { CameraView, CameraType, useCameraPermissions, CameraMode, CameraPictureOptions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CameraAction from './CameraAction';
import { ThemedText } from './ThemedText';
import { ImageType } from 'expo-camera/build/legacy/Camera.types';


interface CameraFrameProps {
    /*handleTakePicture: () => void;*/
    cameraMode: CameraMode;
}
export function CameraFrame({cameraMode}:CameraFrameProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false)
    const [picture, setPicture] = useState<string>("");
    const [video, setVideo] = useState("")
    const [pictureSettings, setPictureSettings] = useState<CameraPictureOptions>({
        imageType: "jpg"
    })


    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
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

    function handleCameraShutter(){
        console.log("Shutter pressed " + cameraMode)
        if (cameraMode === "picture"){
            handleTakePicture()
        }
        else if (cameraMode === "video" && isRecording === false) {
            console.log("Starting Recording...");
            handleStartRecording();
        }
        else if(cameraMode === "video" && isRecording === true){
            console.log("Trying to stop...");
            
            handleStopRecording();
        }
    }

    async function handleTakePicture() {
        console.log(cameraRef);
        console.log("Function called")
        const response = await cameraRef.current?.takePictureAsync(pictureSettings);
        setPicture(response!.uri);
        console.log(response!.base64)

    }

    async function handleStartRecording() {
        console.log("Hello there!");
        console.log(cameraRef);
        
        const response = await cameraRef.current?.recordAsync();
        console.log(response);
        if (response === undefined) {
            console.error("Failed Recording");
        }
        else{
            setVideo(response!.uri)
            setIsRecording(true);
            console.log("Started Recording, file gets saved to: " + video);
            
        }
        
    }

    async function handleStopRecording() {
        cameraRef.current?.stopRecording();
        setIsRecording(false);
        console.log("Stopped Recording");
    }
    

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} mode="video" style={styles.camera} facing={facing} mute={true} onCameraReady={() => handleCameraReady()}>
                <View style={styles.buttonContainer}>
                    {cameraReady && <TouchableOpacity style={styles.cameraAction}>
                        <CameraAction cameraMode={cameraMode} isRecording={isRecording} handleCameraShutter={() => handleCameraShutter()}/>
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

/* animateShutter={false} autofocus="on"  mute={true} */
