import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type SendIconProps = ViewProps & {
    fillColor?: string;
    width?: string | number;
    height?: string | number;
};

export function SendIcon({ style, fillColor, width = "24", height = "24" }: SendIconProps) {
    const themeColors = useThemeColors();

    // Utilise la couleur fournie, sinon utilise la couleur par défaut du thème
    const color = fillColor || themeColors.icon;

    return (
        <View style={[styles.container, style]}>
            <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M21.66,12a2,2,0,0,1-1.14,1.81L5.87,20.75A2.08,2.08,0,0,1,5,21a2,2,0,0,1-1.82-2.82L5.46,13H11a1,1,0,0,0,0-2H5.46L3.18,5.87A2,2,0,0,1,5.86,3.25h0l14.65,6.94A2,2,0,0,1,21.66,12Z"
                    fill={color}
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SendIcon;