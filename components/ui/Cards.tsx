import { useThemeColors } from "@/hooks/useThemeColors";
import { View, ViewStyle } from "react-native";
import { type ViewProps } from "react-native";

type Props =ViewProps

export function Cards({style, ...rest}:Props){
   const colors = useThemeColors()
   return <View style={[style, styles]} {...rest}/> 
} 
const styles = {
   borderRadius:3
} satisfies ViewStyle
