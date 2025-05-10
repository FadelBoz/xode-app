import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
type TimelineProps = {
  borderColor?: string;
  backgroundColor?: string;
  data: { title: string; date: string }[]; 
  count?: number;

};

export function DynamicLine({ data, count = data.length, borderColor, backgroundColor }: TimelineProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      display:'flex',
      flexDirection: 'column', 
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    timelineContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10, 
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
    contentContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.primary, 
      marginBottom: 4,
    },
    date: {
      fontSize: 12,
      color: colors.primary
    },
  });

  const elements = [];

  for (let i = 0; i < count; i++) {
    const item = data[i]; 

    elements.push(
      <View key={`timeline-item-${i}`} style={{ flexDirection: 'row' }}>
        <View style={styles.timelineContainer}>
          <View style={styles.circle} />
          {i < count && <View style={styles.line} />}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    );
  }

  return <View style={styles.container}>{elements}</View>;
}
