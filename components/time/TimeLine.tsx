import React from 'react';
import { View, StyleSheet } from 'react-native';

type TimelineProps = {
    borderColor ?: string , 
    backgroundColor ?: string, 
    count :number
}

export function Timeline({count, borderColor, backgroundColor}:TimelineProps ){
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    line: {
      width: 2,
      height: 40,
      backgroundColor: borderColor, 
    },
    circle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: borderColor, 
      backgroundColor: backgroundColor,
      marginVertical: 10,
    },
  });

  const elements = [];
  for (let i = 0; i < count; i++) {
    elements.push(<View key={`circle-${i}`} style={styles.circle} />);
    elements.push(<View key={`line-${i}`} style={styles.line} />);

  }
  elements.push(<View key={`line-${count}`} style={styles.line} />);

  return <View style={styles.container}>{elements}</View>;
}
