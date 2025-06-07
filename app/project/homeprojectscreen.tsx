import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { CardComponent } from '@/components/ui/CardComponent';
import { ButtonComponent } from '@/components/ui/ButtonComponent';

// --- Types ---
type TeamMember = { id: string; name: string; avatar: any; };
type ProjectVersion = { id: string; version: string; };
type Server = { id: string; avatar: any; name: string; };

const HomeProjectScreen = () => { 
  const colors = useThemeColors();
  const router = useRouter();
  // CHANGEMENT: L'état gère maintenant la section ouverte (ou null si aucune)
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState('1');

  // --- Données simulées ---
  const servers: Server[] = [
    { id: '1', name: 'Projet A', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '2', name: 'Projet B', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '3', name: 'Projet C', avatar: require('@/assets/images/partial-react-logo.png') },
  ];
  const projectDetails = { name: 'Nom Projet', members: 4, id: 'XODE-404' };
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Albert', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '2', name: 'Gilbert', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '3', name: 'Rigobert', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '4', name: 'Guillaume', avatar: require('@/assets/images/partial-react-logo.png') },
  ];
  const versions: ProjectVersion[] = [
    { id: '1', version: 'v2.1.0' }, { id: '2', version: 'v2.0.1' },
    { id: '3', version: 'v1.9.5' }, { id: '4', version: 'v1.8.0' },
  ];

  // --- CHANGEMENT: Fonction pour gérer l'ouverture/fermeture des sections ---
  const handleSectionToggle = (sectionName: 'team' | 'version') => {
      setOpenSection(prevOpenSection => 
          prevOpenSection === sectionName ? null : sectionName
      );
  };

  // --- Fonctions de rendu ---

  const renderSidebar = () => (
    <View style={[styles.sidebar, { backgroundColor: colors.background2 }]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
        <TouchableOpacity style={styles.serverIconWrapper} onPress={() => router.push('/project/chatscreen')}>
            <MaterialIcons name="chat" size={28} color={colors.primary} />
        </TouchableOpacity>
        <View style={[styles.separator, { backgroundColor: colors.input }]} />
        {servers.map(server => (
          <TouchableOpacity key={server.id} onPress={() => setActiveServer(server.id)} style={styles.serverIconWrapper}>
            {activeServer === server.id && <View style={[styles.activeServerIndicator, { backgroundColor: colors.text }]} />}
            <Image source={server.avatar} style={styles.serverIcon} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.serverIconWrapper, { backgroundColor: colors.input }]}>
          <MaterialIcons name="add" size={24} color={colors.validatedGreen} />
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styles.serverIconWrapper}>
        <MaterialIcons name="settings" size={24} color={colors.iconNoSelected} />
      </TouchableOpacity>
    </View>
  );

  const renderListView = (title: string, data: any[], renderItem: (item: any) => JSX.Element) => (
      <View style={styles.dropdownContent}>
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            ListHeaderComponent={() => (
                <View style={[styles.listHeader, { borderBottomColor: colors.border }]}>
                    <TextComponent variante='subtitle3' color={colors.muted}># {title}</TextComponent>
                </View>
            )}
            renderItem={({ item }) => renderItem(item)}
        />
      </View>
  );
  
  const renderMainContent = () => (
    <View style={styles.mainContent}>
      {/* Utilisation de ScrollView pour que le contenu ne soit pas coupé */}
      <ScrollView>
        <View style={styles.detailsView}>
          <CardComponent style={styles.detailsCard}>
            <TextComponent variante="subtitle1">Nom Projet: {projectDetails.name}</TextComponent>
            <View style={styles.detailsSubline}>
                <TextComponent color={colors.muted}>Membres: {projectDetails.members}</TextComponent>
                <TextComponent color={colors.muted}>ID: {projectDetails.id}</TextComponent>
            </View>
          </CardComponent>

          <View style={styles.actionsContainer}>
            <ButtonComponent 
                title="Télécharger" 
                style={[styles.downloadButton, {backgroundColor: colors.primary}]} 
                textStyle={{color: colors.primaryForeground}}
            />
            <TouchableOpacity>
                <MaterialIcons name="refresh" size={30} color={colors.icon} />
            </TouchableOpacity>
          </View>

          {/* CHANGEMENT: Section "Team" devient un dropdown */}
          <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border }]} onPress={() => handleSectionToggle('team')}>
            <TextComponent variante="subtitle2">Team</TextComponent>
            <MaterialIcons name={openSection === 'team' ? "expand-more" : "chevron-right"} size={24} color={colors.iconNoSelected} />
          </TouchableOpacity>
          {openSection === 'team' && renderListView('Team', teamMembers, (item: TeamMember) => (
              <View style={styles.listItem}>
                  <Image source={item.avatar} style={styles.avatar} />
                  <TextComponent variante='body2'>{item.name}</TextComponent>
              </View>
          ))}
          
          {/* CHANGEMENT: Section "Version" devient un dropdown */}
          <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border, borderBottomColor: openSection !== 'version' ? colors.border : 'transparent' }]} onPress={() => handleSectionToggle('version')}>
            <TextComponent variante="subtitle2">Version</TextComponent>
            <MaterialIcons name={openSection === 'version' ? "expand-more" : "chevron-right"} size={24} color={colors.iconNoSelected} />
          </TouchableOpacity>
          {openSection === 'version' && renderListView('Version', versions, (item: ProjectVersion) => (
              <View style={styles.listItem}>
                  <TextComponent variante='body2' color={colors.primary} style={{marginRight: 12}}>#</TextComponent>
                  <TextComponent variante='body2'>{item.version}</TextComponent>
              </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {renderSidebar()}
        {renderMainContent()}
      </View>
    </SafeAreaView>
  );
};


// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 70, paddingVertical: 10, alignItems: 'center' },
  serverIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  serverIcon: { width: '100%', height: '100%', borderRadius: 24 },
  activeServerIndicator: {
    position: 'absolute',
    left: -10,
    width: 4,
    height: 30,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  separator: { height: 2, width: '50%', marginVertical: 5 },
  mainContent: { flex: 1 },
  detailsView: { padding: 20 },
  detailsCard: {
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsSubline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
  },
  actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  downloadButton: {
      flex: 1, 
      marginRight: 16,
      paddingVertical: 12,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  dropdownContent: {
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#E3E5E8', // Correspond à `colors.border` en thème clair
  },
  listHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
  },
  listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
  },
  avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
  },
});

export default HomeProjectScreen;