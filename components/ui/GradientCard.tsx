import { ViewStyle } from "react-native";
import { type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GradProps = ViewProps & {
  style?: ViewStyle;
  colors: string[];
};

export function GradientCard({ style, colors, ...rest }: GradProps) {
  const defaultStyles: ViewStyle = {
    borderRadius: 10, // Changed from 1 to a more visible radius
    padding: 10
  };

  return (
    <LinearGradient
      colors={colors} // Using the colors prop correctly here
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[defaultStyles, style]}
      {...rest}
    />
  );
}