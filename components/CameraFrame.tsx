import { CameraView, CameraType, useCameraPermissions, CameraMode, CameraPictureOptions, useMicrophonePermissions } from 'expo-camera';
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
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef<CameraView>(null);
    const [isRecording, setIsRecording] = useState(false)
    const [picture, setPicture] = useState<string>("");
    const [video, setVideo] = useState<string>("")
    const [pictureSettings, setPictureSettings] = useState<CameraPictureOptions>({
        imageType: "jpg"
    })


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
        console.log("Camera Ref:", cameraRef.current);
        console.log("Is Camera Ready:", cameraReady);
        console.log("Is Recording:", isRecording);

        if (!cameraReady || !cameraRef.current || isRecording) {
            console.log("Camera is not ready yet!");
            return;
        }
        
        console.log("Starting Recording...");

        try {
            const response = await cameraRef.current?.recordAsync();
            console.log("Recording response:", response);

            if (response) {
                setVideo(response!.uri);
                setIsRecording(prevIsRecording => !prevIsRecording);
                console.log("Started Recording, file saved to: " + response.uri);
                console.log(video);
                
            } else {
                console.error("Recording failed to start");
            }
        } catch (error) {
            console.error("Error starting recording:", error);
        }

        /*const response = await cameraRef.current?.recordAsync();
        console.log(response);
        setVideo(response!.uri)
        setIsRecording(true);
        console.log("Started Recording, file gets saved to: " + video);*/
        
        
    }

    async function handleStopRecording() {
        cameraRef.current?.stopRecording();
        setIsRecording(false);
        console.log("Stopped Recording");
    }
    

    return (
        <View style={styles.container}>
            <CameraView 
                ref={cameraRef} 
                mode="video" 
                style={styles.camera} 
                facing={facing} 
                mute={true} 
                onCameraReady={() => handleCameraReady()}>
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

/* animateShutter={false} autofocus="on"  mute={true} 

if (response === undefined) {
            console.error("Failed Recording");
        }
        else{
            
            
        }
*/
