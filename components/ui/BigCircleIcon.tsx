import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type ConcentricCirclesIconProps = ViewProps & {
    colors?: {
        innerCircle?: string;
        middleCircle?: string;
        outerMiddleCircle?: string;
        outerCircle?: string;
    };
};

export function BigCirclesIcon({ style, colors }: ConcentricCirclesIconProps) {
    const colo = useThemeColors();

    // Assign colors or use defaults from the theme
    const circleColors = {
        innerCircle: colors?.innerCircle || colo.card,
        middleCircle: colors?.middleCircle || colo.cardForeground ,
        outerMiddleCircle: colors?.outerMiddleCircle || colo.secondary,
        outerCircle: colors?.outerCircle || colo.secondaryForeground,
    };

    return (
        <View style={[styles.container, style]}>
            <Svg width="1000" height="1000" viewBox="0 0 300 300" fill="none">
                <Circle
                    cx="98"
                    cy="96"
                    r="52"
                    stroke={circleColors.innerCircle}
                    strokeWidth="1.5"
                />
                <Circle
                    cx="98"
                    cy="96"
                    r="66"
                    stroke={circleColors.middleCircle}
                    strokeWidth="2"
                />
                <Circle
                    cx="98"
                    cy="96"
                    r="80"
                    stroke={circleColors.outerMiddleCircle}
                    strokeWidth="2.5"
                />
                <Circle
                    cx="98"
                    cy="96"
                    r="94"
                    stroke={circleColors.outerCircle}
                    strokeWidth="3"
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

export default BigCirclesIcon;
