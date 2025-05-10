import { useColorScheme } from "react-native"
import { color } from "@/constants/color"
export function useThemeColors(){
    const theme = useColorScheme() ?? 'dark'
    return color[theme]
}