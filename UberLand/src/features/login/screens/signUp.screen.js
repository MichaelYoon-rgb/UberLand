import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { LoginContext } from "../../../services/login/login.context";
import { LoadingComponent } from "../../map/components/loading.component";

export const SignUpScreen = ({ navigation }) => {
  // Set an initializing state whilst Firebase connects
  const { user, initializing, emailAndPasswordSignUp } =
    useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (initializing) return <Loading />;

  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <IconButton
          style={{ position: "absolute", left: 30, top: 70, opacity: 0.7 }}
          onPress={() => {
            navigation.navigate("Anon");
          }}
          icon={require("../../../../assets/icons/grey-arrow.png")}
        ></IconButton>
        <Text
          style={{
            fontSize: 35,
            fontFamily: "Poppins_700Bold",
            margin: 50,
            marginBottom: 0,
            marginTop: 200,
          }}
        >
          Sign Up
        </Text>
        <Text
          style={{
            margin: 50,
            marginTop: 0,
            marginBottom: 0,
            fontFamily: "Poppins_600SemiBold",
            color: "grey",
            fontSize: 15,
            fontWeight: "bold",
            opacity: 0.8,
          }}
        >
          Enter Your Email and Password
        </Text>
        <View style={{ margin: 50, marginTop: 40,marginBottom: 30, }}>
          <TextInput
            selectionColor={"black"}
            placeholder="Email"
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
            style={{
              fontWeight: "bold",

              borderBottomWidth: 0.7,
              padding: 10,
              paddingBottom: 7,
              paddingLeft: 0,
              marginBottom: 25,

              borderBottomColor: "lightgrey",
            }}
          ></TextInput>
          <TextInput
            selectionColor="black"
            placeholder="Password"
            value={password}
            autoCapitalize='none'
            secureTextEntry={true}
            onChangeText={setPassword}
            style={{
              fontWeight: "bold",
              borderBottomWidth: 0.7,
              padding: 10,
              paddingLeft: 0,

              borderBottomColor: "lightgrey",
            }}
          ></TextInput>
        </View>
        <View style={{marginLeft:50, marginBottom: 20}}><Text style={{fontWeight: 'bold', color: 'rgb(200, 50, 50)'}}>{error}</Text></View>
        <View style={{ width: 150, alignSelf: "flex-end", marginRight: 50 }}>
          <Button
            icon={require("../../../../assets/icons/right-arrow-white.png")}
            onPress={async () => {
              const errorCode = await emailAndPasswordSignUp(email, password)
              const isError = errorCode === ''
              if (isError){
                  navigation.navigate("Profile")
              } else {
                setError(errorCode)
              }
            }}
            title="LOGIN"
            compact={true}
            contentStyle={{ flexDirection: "row-reverse" }}
            style={{
              borderRadius: 100,
              height: 50,
              justifyContent: "center",
              fontWeight: "bold",
              backgroundColor: "rgb(118, 150, 86)",
            }}
            mode="contained"
          >
            <Text style={{ marginRight: 10 }}>Sign Up </Text>
          </Button>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 70,
              width: "100%",
            }}
            onPress={() => {
              navigation.navigate("LogIn");
            }}
          >
            <Text
              style={{
                
                alignSelf:'center',
                color: "grey",
                position: 'absolute',
                fontWeight: "700",
              }}
            >
              Have an account?
              <Text style={{ color: "rgb(118, 150, 86)", fontWeight: "700" }}>
                {" "}
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }

  navigation.navigate("Home");
};
