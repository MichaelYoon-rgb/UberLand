import React, { useState, useRef } from "react";
import { View, Text, ActivityIndicator, Button, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import { colors } from "../../../../theme";
import { manipulateAsync } from 'expo-image-manipulator';
import firebase from '../../../../firebase';

export const SecurityScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const cameraRef = useRef(null);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      uploadImage(photo);
    }
  };

  const uploadImageFirebase = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(db, `/Images/your_image_nam`);
    await push(storageRef, blob);

    console.log("Image uploaded successfully");
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);

    setImageUri(downloadURL);
  };


  const uploadImage = (photo) => {
    const ref = firebase.storage().ref().child("Images");

    const data = {
        providers: "Amazon",
        file1_url: "https://ibb.co/hH20R4T",
        file2_url: "https://ibb.co/hH20R4T"
    }
    axios({
      method: "post",
      url: "https://api.edenai.run/v2/image/face_compare",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        "authorization":  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWY4MTgyNzAtZGI1YS00Y2FjLThhZDItMmIyNzBkNjkzYmM3IiwidHlwZSI6ImFwaV90b2tlbiIsIm5hbWUiOiJVYmVyTGFuZCIsImlzX2N1c3RvbSI6dHJ1ZX0.eblhVwxZTqwml2doVXE9csC9RBK9QdShTQ3SHP_PCeQ"},
    })
    .then(function (response) {
        console.log("Upload successful:", response);
    })
    .catch(function (error) {
        console.error("Upload error:", error.message);
    })
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={Camera.Constants.Type.front}
        autoFocus={Camera.Constants.AutoFocus.on}
      >
        <View style={{position: "absolute", width: "100%", alignItems: "center", bottom: 0, marginBottom: 120}}>
            <TouchableOpacity onPress={handleTakePicture} style={{backgroundColor: colors.secondary, width: 60, height: 60, borderRadius: 15}}/>
        </View>
      </Camera>
    </View>
  );
};
