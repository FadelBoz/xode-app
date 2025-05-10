import React from 'react';
import { View, ViewStyle, StyleSheet,TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { type ViewProps } from 'react-native';
type MenuIconProps = ViewProps & {
    fillColor?:string
}

export function ix({ style, fillColor }: MenuIconProps) {

    return (
        <View style={styles.container}>
           
            <Svg width="35" height="35" viewBox="0 0 100 80" fill="none">
                <Rect x="35" y="20" width="45" height="10" rx="5" fill={fillColor} />
                <Rect x="10" y="40" width="70" height="10" rx="5" fill={fillColor} />
            </Svg>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
    },
});
export default ix;
