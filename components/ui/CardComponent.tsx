import { View, ViewStyle, ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = ViewProps

export function CardComponent({style, ...rest}:Props){
    const color = useThemeColors();
    return <View style={ [ styles , {backgroundColor: color.background}, style] } {...rest} />
}

const styles = {
    borderRadius:2
} satisfies ViewStyle
