import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type ArrowUpRightIconProps = ViewProps & {
    fillColor?: string;
};

export function ArrowIcon({ style,fillColor }: ArrowUpRightIconProps) {
    const colors = useThemeColors();
    const effectiveStrokeColor = fillColor ;

    return (
        <View style={[styles.container, style]}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <G id="arrow-up-right-outline-icon">
                    <Path
                        id="Icon"
                        d="M7 17L17 7M17 7H7M17 7V17"
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

export default ArrowIcon;
