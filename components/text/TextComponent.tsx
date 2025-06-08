import { useThemeColors } from "@/hooks/useThemeColors";
import React from "react";
import { Text, TextProps, StyleSheet, StyleProp, TextStyle } from "react-native";

const stylles = StyleSheet.create({ 
    body5: { fontFamily: 'GgSansRegular',fontSize: 14 },
    body4: { fontFamily: 'GgSansRegular',fontSize: 14 },
    body3: { fontFamily: 'GgSansRegular',fontSize: 17, lineHeight: 20 }, 
    body2: { fontFamily: 'GgSansRegular',fontSize: 18, lineHeight: 20, fontWeight: "bold" }, 
    headline: { fontFamily: 'GgSansRegular',fontSize: 16, lineHeight: 32, fontWeight: "bold" },  
    headline2: { fontFamily: 'GgSansRegular',fontSize: 16, lineHeight: 32, fontWeight: "bold" }, 
    caption: { fontSize: 8, lineHeight: 12 },  
    subtitle0: { fontFamily: 'GgSansRegular', fontSize: 32, lineHeight:32, fontWeight:"bold"},
    subtitle1: { fontFamily: 'GgSansRegular',fontSize: 24, lineHeight: 24, fontWeight: "bold" }, 
    subtitle2: { fontFamily: 'GgSansRegular',fontSize: 17, lineHeight: 16, fontWeight: "bold" }, 
    subtitle3: { fontFamily: 'GgSansRegular',fontSize: 14, lineHeight: 16, fontWeight: "bold" }, 
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