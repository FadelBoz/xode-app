import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type ActivityIconProps = ViewProps & {
    fillColor?: string; 
};

export function ActivityIcon({ style, fillColor }: ActivityIconProps) {
    const colors = useThemeColors();
    const effectiveFillColor = fillColor || colors.icon; // Default if fillColor not provided

    return (
        <View style={[styles.container, style]}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path
                    d="M22 12H18L15 21L9 3L6 12H2"
                    stroke={effectiveFillColor}
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
        borderRadius: 2,
    },
});

export default ActivityIcon;
