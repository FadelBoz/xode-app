import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type ArrowRightIconProps = ViewProps & {
    fillColor?: string; // Optional stroke color for the paths
};

export function RightIcon({ style, fillColor }: ArrowRightIconProps) {
    const colors = useThemeColors();
    const effectiveStrokeColor = fillColor || colors.icon

    return (
        <View style={[styles.container, style]}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" role="img">
                <G id="arrow-right-outline-icon">
                    <Path
                        id="Icon"
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke={effectiveStrokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </G>
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

export default RightIcon;
