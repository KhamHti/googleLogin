import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { fetchUserInfoAsync } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "789923758060-es72j6u41ik59jv1d38ijosc55jnsnct.apps.googleusercontent.com",
    iosClientId:
      "789923758060-fo9ctbs0cnc0c3dln4s3qa8f7fnard8s.apps.googleusercontent.com",
    androidClientId:
      "789923758060-7ja66jhbii9o6o8ab8rvvligj83lr902.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type == "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fethUserInfo();
    }
  }, [response, accessToken]);

  async function fethUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await response.json();
    setUser(userInfo);
  }

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 25, fontWeight: "700", marginBottom: 20 }}>
            Welcome
          </Text>
          <Image
            source={{ uri: user.picture }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ fontSize: 24, fontWeight: "700" }}>{user.name}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null && (
        <>
          <Text style={{ fontSize: 35, fontWeight: "bold", marginBottom: 20 }}>
            Welcome
          </Text>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              marginVertical: 20,
              color: "#666",
            }}
          >
            Please Login
          </Text>
          <TouchableOpacity
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={require("./assets/google-logo-transparent-alphabet.png")}
              style={{ width: 50, height: 50 }}
            />
            <Text
              style={{
                marginLeft: 15,
                color: "#666",
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
