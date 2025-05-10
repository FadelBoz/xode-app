import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type DiscordIconProps = ViewProps & {
    fillColor?: string; // Optional fill color for the icon
};

export function DiscordIcon({ style, fillColor }: DiscordIconProps) {
    const colors = useThemeColors();
    const effectiveFillColor = fillColor || colors.icon; // Default if fillColor not provided

    return (
        <View style={[styles.container, style]}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                    d="M18.9556 6.25999C17.6518 5.67 16.2671 5.24 14.8218 5C14.6399 5.31 14.4377 5.73 14.2962 6.06C12.759 5.83999 11.2328 5.83999 9.71672 6.06C9.57521 5.73 9.36295 5.31 9.19112 5C7.73573 5.24 6.35105 5.67 5.05634 6.25999C2.4386 10.08 1.73111 13.81 2.08485 17.4899C3.82327 18.7399 5.50106 19.5 7.14953 20C7.55382 19.46 7.91768 18.8799 8.231 18.27C7.63468 18.05 7.06868 17.78 6.5229 17.4599C6.6644 17.36 6.8059 17.25 6.93729 17.14C10.2322 18.63 13.801 18.63 17.0555 17.14C17.197 17.25 17.3284 17.36 17.4699 17.4599C16.9241 17.78 16.3581 18.05 15.7618 18.27C16.0751 18.8799 16.439 19.46 16.8432 20C18.4907 19.5 20.1786 18.7399 21.9079 17.4899C22.3425 13.23 21.2196 9.53002 18.9556 6.25999ZM8.68581 15.22C7.6953 15.22 6.88674 14.33 6.88674 13.24C6.88674 12.15 7.67509 11.26 8.68581 11.26C9.68639 11.26 10.505 12.15 10.4848 13.24C10.4848 14.33 9.68639 15.22 8.68581 15.22ZM15.3272 15.22C14.3367 15.22 13.5271 14.33 13.5271 13.24C13.5271 12.15 14.3164 11.26 15.3272 11.26C16.3278 11.26 17.1464 12.15 17.1262 13.24C17.1262 14.33 16.3379 15.22 15.3272 15.22Z"
                    fill={effectiveFillColor}
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

export default DiscordIcon;
