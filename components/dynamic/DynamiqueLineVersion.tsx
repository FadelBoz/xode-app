// xode-app/components/dynamic/DynamicLineVersion.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { FolderIcon } from '@/components/ui/FolderIcon';

// Définition des types pour les props du composant
type VersionItem = {
  version: string;
  id: string;
  date: string;
};

type DynamicLineVersionProps = {
  data: VersionItem[];
};

export function DynamicLineVersion({ data }: DynamicLineVersionProps) {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 10,
    },
    timelineGutter: {
      alignItems: 'center',
      marginRight: 16,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.input,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    line: {
      width: 1,
      // La hauteur est gérée par flex dans le parent
      flex: 1,
      overflow: 'hidden',
      // Simuler une ligne pointillée
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: colors.border,
      marginVertical: 8,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    versionText: {
      marginBottom: 8,
    },
    detailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap', // Permet le retour à la ligne sur petits écrans
    },
  });

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          {/* Colonne de gauche avec l'icône et la ligne */}
          <View style={styles.timelineGutter}>
            <View style={styles.iconContainer}>
              <FolderIcon fillColor={colors.primary} />
            </View>
            {index < data.length - 1 && <View style={styles.line} />}
          </View>

          {/* Contenu de droite avec les informations */}
          <View style={styles.contentContainer}>
            <TextComponent variante="subtitle2" style={styles.versionText}>
              {item.version}
            </TextComponent>
            <View style={styles.detailsContainer}>
              <TextComponent color={colors.muted} variante="body5">ID: {item.id}</TextComponent>
              <TextComponent color={colors.muted} variante="body5">{item.date}</TextComponent>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}