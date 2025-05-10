import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Linking, GestureResponderEvent, TextProps } from 'react-native';

type LinkProps = TextProps & {
    url: string;                  // The URL to open when the link is pressed
    style?: object;               // Custom style for the text link
    onPress?: (event: GestureResponderEvent) => void;  // Optional custom press handler
    children: React.ReactNode;    // Content inside the link (text or children)
};

export function LinkC({ url, style, onPress, children, ...props }: LinkProps) {
    const handlePress = (event: GestureResponderEvent) => {
        if (onPress) {
            onPress(event);
        } else {
            Linking.openURL(url).catch((err) => {
                console.error("Failed to open URL:", err);
            });
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <Text style={[styles.link, style]} {...props}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    link: {
        color: '#5865F2', 
        textDecorationLine:"none"
    },
});
