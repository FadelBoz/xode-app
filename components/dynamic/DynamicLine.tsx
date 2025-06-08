// xode-app/components/dynamic/DynamicLine.tsx

import React from 'react';
// AJOUT: Importer le composant Image
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

// MODIFICATION: Mise à jour des props attendues
type TimelineProps = {
  borderColor?: string;
  backgroundColor?: string;
  data: { 
    title: string; 
    email: string; // "date" est remplacé par "email"
    avatar?: any;  // Ajout de la prop optionnelle pour l'avatar
  }[]; 
  count?: number;
};

export function DynamicLine({ data, count = data.length, borderColor, backgroundColor }: TimelineProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
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
      backgroundColor: borderColor || colors.border,
    },
    // Le style du cercle est conservé comme fallback
    circle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: borderColor || colors.primary,
      backgroundColor: backgroundColor || colors.card,
      marginVertical: 10,
    },
    // AJOUT: Style pour l'avatar
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16, // La moitié de la taille pour un cercle parfait
      marginVertical: 10
    },
    contentContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 10, // Un peu d'espace
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text, 
      marginBottom: 4,
    },
    // Le style pour la date est réutilisé pour l'email
    date: {
      fontSize: 12,
      color: colors.muted
    },
  });

  const elements = [];

  for (let i = 0; i < count; i++) {
    const item = data[i]; 

    elements.push(
      <View key={`timeline-item-${i}`} style={{ flexDirection: 'row' }}>
        <View style={styles.timelineContainer}>
          {/* MODIFICATION: Affiche l'image si elle existe, sinon le cercle */}
          {item.avatar ? (
            <Image source={item.avatar} style={styles.avatar} />
          ) : (
            <View style={styles.circle} />
          )}
          {/* On affiche la ligne seulement si ce n'est pas le dernier élément */}
          {i < count - 1 && <View style={styles.line} />}
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          {/* MODIFICATION: Affiche l'email au lieu de la date */}
          <Text style={styles.date}>{item.email}</Text>
        </View>
      </View>
    );
  }

  return <View style={styles.container}>{elements}</View>;
}