import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeColors } from '@/hooks/useThemeColors';

type CertificateIconProps = ViewProps & {
  fillColor?: string;
  width: string;
  height: string;
};

export function CertificateIcon({ style, fillColor, width, height }: CertificateIconProps) {
  const themeColors = useThemeColors();
  const color = fillColor || themeColors.icon;

  return (
    <View style={[styles.container, style]}>
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <Path
          d="M24 0v24H0V0h24Z"
          fill="none"
        />
        <Path
          d="M12.593 23.258l-.011.002-.071.036-.019.004-.015-.004-.071-.036a.017.017 0 0 0-.023.01l-.004.011-.017.427.005.021.011.013.103.074.015.004.012-.004.104-.074.013-.016.003-.017-.017-.427a.016.016 0 0 0-.008-.012Zm.265-.113-.014.002-.184.093-.01.01-.003.011.017.43.005.013.008.007.2.093c.012.004.023 0 .028-.007l.004-.014-.034-.615a.016.016 0 0 0-.02-.013Zm-.715.002a.02.02 0 0 0-.028.006l-.006.014-.034.615c-.001.012.007.021.017.024l.016-.001.2-.093.009-.008.004-.012.018-.43-.003-.012a.019.019 0 0 0-.014-.013Z"
          fill={color}
        />
        <Path
          d="M10.586 2.101a1.5 1.5 0 0 1 2.7 0L15.314 4H18a2 2 0 0 1 2 2v2.686l1.899 1.9a1.5 1.5 0 0 1 0 2.121L20 15.314V18a2 2 0 0 1-2 2h-2.686l-1.9 1.899a1.5 1.5 0 0 1-2.121 0L8.686 20H6a2 2 0 0 1-2-2v-2.686l-1.9-1.9a1.5 1.5 0 0 1 0-2.121L4 8.686V6a2 2 0 0 1 2-2h2.686l1.9-1.899Zm4.493 6.882a.75.75 0 0 1 1.06 1.06l-4.881 4.881a.75.75 0 0 1-1.06 0l-2.404-2.404a.75.75 0 1 1 1.06-1.06l1.768 1.767 4.457-4.457Z"
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
