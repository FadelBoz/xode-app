import { useThemeColors } from "@/hooks/useThemeColors";
import React from "react";
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from "react-native";

const stylles = StyleSheet.create({
    body4: { fontSize: 14 },
    body3: { fontSize: 16, lineHeight: 20 }, 
    body2: { fontSize: 18, lineHeight: 20, fontWeight: "bold" }, 
    headline: { fontSize: 16, lineHeight: 32, fontWeight: "bold" },  
    caption: { fontSize: 8, lineHeight: 12 },  
    subtitle1: { fontSize: 24, lineHeight: 24, fontWeight: "bold" }, 
    subtitle2: { fontSize: 17, lineHeight: 16, fontWeight: "bold" }, 
    subtitle3: { fontSize: 14, lineHeight: 16, fontWeight: "bold" }, 
});
    
type Props = TextProps & {
    color?: string, 
    variante?: keyof typeof stylles, 
    children?: React.ReactNode, 
    style?: StyleProp<TextStyle>
};

export function TextComponent({ variante, color, style, ...rest }: Props) {
    const colors = useThemeColors();
    return (
        <Text style={[ stylles[variante ?? "body3"], { color: color ?? colors.text },style]} {...rest}/>
    );
}