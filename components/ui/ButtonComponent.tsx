import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, StyleProp, TouchableOpacityProps } from "react-native";

type ButtonComponentProps = TouchableOpacityProps & {
  title: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function ButtonComponent({ title, style, textStyle, ...rest }: ButtonComponentProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...rest}>
      <Text style={[styles.body3, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007bff",
    padding:5,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  
  body3:{fontSize:14 , lineHeight: 18}, 
  headline:{ fontSize:14, lineHeight:32 , fontWeight:"bold" },  
  caption:{ fontSize:8, lineHeight:12  },  
  subtitle1: {fontSize:14, lineHeight:12 , fontWeight:"bold"},
  subtitle2: {fontSize:12, lineHeight:16 , fontWeight:"bold"}, 
  subtitl3: {fontSize:10, lineHeight:16 , fontWeight:"bold"} // "subtitle3" avait une faute de frappe
});