import {
  CameraView,
  CameraType,
  useCameraPermissions,
  CameraMode,
  CameraPictureOptions,
  CameraRecordingOptions,
} from "expo-camera";
import { useState, useRef, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { ScanContext } from "@/app/index";
import * as FileSystem from "expo-file-system";
import { BASE_URL } from "@/constants/Api";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import CameraAction from "./CameraAction";

interface CameraFrameProps {
  setMedia: (mediaUri: string) => void;
  cameraMode: CameraMode;
}

export function CameraFrame({ cameraMode }: CameraFrameProps) {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pictureSettings, setPictureSettings] = useState<CameraPictureOptions>({
    imageType: "jpg",
    base64: true,
  });
  const [videoSettings, setVideoSettings] = useState<CameraRecordingOptions>({
    maxDuration: 10,
  });
  const [pictureSize, setPictureSize] = useState<string>("");
  const { scan_uuid } = useContext(ScanContext);

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    requestCameraPermission();
  }

  const handleCameraReady = async () => {
    setCameraReady(true);
    const availableSizes =
      await cameraRef.current?.getAvailablePictureSizesAsync();
    if (availableSizes && availableSizes.includes("1920x1080")) {
      setPictureSize("1920x1080");
    }
  };

  const base64ToBlob = async (base64: string, filename: string) => {
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return fileUri;
  };

  async function handleTakePicture() {
    try {
      setIsUploading(true);
      const response =
        await cameraRef.current?.takePictureAsync(pictureSettings);
      const fileUri = await base64ToBlob(response?.base64 ?? "", "image.jpg");
      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: "image/jpeg",
        name: "image.jpg",
      });
    
      const photo_response = await fetch(
        `${BASE_URL}/scans/${scan_uuid}/photos/body`,
        {
          method: "POST",
          body: formData,
        },
      );
      if (!photo_response.ok) {
        console.error(photo_response);
        Alert.alert("Error", "could not upload photo");
        return;
      }

      navigate("video-tutorial");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "could not upload photo");
    } finally {
      setIsUploading(false);
    }
  }

  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    const videoData = await cameraRef.current?.recordAsync(videoSettings);

    const formData = new FormData();
    formData.append("file", {
      uri: videoData!.uri,
      type: "video/quicktime",
      name: "video.mov",
    });

    try {
      setIsUploading(true);
      const video_response = await fetch(
        `${BASE_URL}/scans/${scan_uuid}/videos/pedalling`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!video_response.ok) {
        console.error(video_response);
        Alert.alert("Error", "could not upload video");
      }

      navigate("results");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "could not upload video");
    } finally {
      setIsUploading(false);
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
        onCameraReady={handleCameraReady}
      >
        {isUploading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.textloader}>
              Uploading your {cameraMode}...
            </Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            {cameraReady && (
              <TouchableOpacity style={styles.cameraAction}>
                <CameraAction
                  cameraMode={cameraMode}
                  isRecording={isRecording}
                  handleCameraShutter={
                    cameraMode === "picture" ? handleTakePicture : toggleRecord
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    backgroundColor: "red",
  },
  camera: {
    height: "100%",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  cameraAction: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  textloader: {
    color: "white",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0553",
  },
  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
      backgroundColor: "#111",
  },
});
