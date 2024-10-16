import { CameraMode } from "expo-camera";
import { TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View } from "react-native";

function handleTakePicture() {}

interface CameraActionProps {
  handleCameraShutter: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
}
export default function CameraAction({
  cameraMode,
  isRecording,
  handleCameraShutter,
}: CameraActionProps) {
  return (
    <View>
      <TouchableOpacity onPress={handleCameraShutter}>
        {/* Ads Camera and Video Shutter for iPhone */}
        <SymbolView
          name={isRecording === true ? "stop.circle" : "circle.inset.filled"}
          size={90}
          type="palette"
          colors={
            cameraMode === "picture" ? ["white", "white"] : ["red", "white"]
          }
          fallback={
            <FontAwesome5
              name={isRecording === true ? "stop-circle" : "circle"}
              size={90}
              color={cameraMode === "picture" ? "white" : "red"}
            />
          }
        />
      </TouchableOpacity>
    </View>
  );
}
