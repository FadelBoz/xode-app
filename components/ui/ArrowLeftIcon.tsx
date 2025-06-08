import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type ArrowLeftIconProps = ViewProps & {
    fillColor?: string;
    width?: string | number;
    height?: string | number;
};

export function ArrowLeftIcon({ style, fillColor, width = "24", height = "24" }: ArrowLeftIconProps) {
    const themeColors = useThemeColors();

    // Utilise la couleur fournie, sinon utilise la couleur par défaut du thème
    const color = fillColor || themeColors.icon;

    return (
        <View style={[styles.container, style]}>
            <Svg width={width} height={height} viewBox="0 0 16 16" fill="none">
                <Path
                    d="M6.5 10.7L4 8.2v-.7L6.5 5l.71.7-1.64 1.65h5.57v1H5.57L7.22 10l-.72.7z"
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

export default ArrowLeftIcon;