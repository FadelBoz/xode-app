import { Dimensions, View } from "react-native";
import { ViewStyle } from "react-native";
import { type ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import Animated from 'react-native-reanimated';

type navProps = ViewProps;

export function  Navbar({style, ...rest}:navProps){
    const colors = useThemeColors();
    const {width, height}=Dimensions.get('window');
    const styles = {
        backgroundColor:colors.secondary,
        width:width,
        height:height, 
        position:"absolute", 
        right:0, 
        zIndex:2, 
        borderLeftColor:colors.card, 
        borderLeftWidth:0.5        
    } satisfies ViewStyle;
    
    return (
        <Animated.View style={[style, styles]}{...rest}/>
    )
};