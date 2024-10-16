import { Image } from "expo-image";

interface PictureViewProps {
  picture: string;
  setPicture: React.Dispatch<React.SetStateAction<string>>;
}

export default function pictureView({ picture, setPicture }: PictureViewProps) {
  return <Image source={picture} style={{ height: "100%", width: "100%" }} />;
}
