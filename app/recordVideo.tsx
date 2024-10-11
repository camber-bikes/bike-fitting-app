import { CameraFrame } from "@/components/CameraFrame";
import { useState } from "react";

export default function recordVideocreen() {

    const[videoUri, setVideoUri] = useState("")

    return(
        <CameraFrame setMedia={setVideoUri}  cameraMode="video"></CameraFrame>
    );

}