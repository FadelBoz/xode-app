import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type UsersIconProps = ViewProps & {
    strokeColor?: string;
    width: string;
    height: string;
};

export function UsersIcon({ style, strokeColor, width, height }: UsersIconProps) {
    const themeColors = useThemeColors();

    const color = strokeColor || themeColors.icon;

    return (
        <View style={[styles.container, style]}>
            <Svg width={width} height={height} viewBox="0 0 32 32" fill="none">
                <Circle
                    cx="16"
                    cy="13"
                    r="5"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M23 28A7 7 0 0 0 9 28Z"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M24 14a5 5 0 1 0-4-8"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M25 24h6a7 7 0 0 0-7-7"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M12 6a5 5 0 1 0-4 8"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <Path
                    d="M8 17a7 7 0 0 0-7 7H7"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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

export default UsersIcon;
