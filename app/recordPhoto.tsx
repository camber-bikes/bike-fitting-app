import { CameraFrame } from "@/components/CameraFrame";
import { useState } from "react";

export default function recordPhotoScreen() {

    const[pictureUri, setPictureUri] = useState("")

    return(
        <CameraFrame setMedia={setPictureUri}  cameraMode="picture"></CameraFrame>
    );

}