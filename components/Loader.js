import LottieView from "lottie-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Loader() {
  return (
    <View>
      <LottieView
        source={require("../assets/93826-loading-animation.json")}
        style={styles.animation}
        autoPlay
      />
    </View>
  );
}
const styles = StyleSheet.create({
  animation: {
    width: 180,
    height: 180,
    // paddingTop: -10
  },
});
