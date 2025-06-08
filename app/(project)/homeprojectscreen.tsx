// xode-app/app/project/homeprojectscreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { CardComponent } from '@/components/ui/CardComponent';
import { ButtonComponent } from '@/components/ui/ButtonComponent';
import { CertificateIcon } from '@/components/ui/CertificateIcon';
import StarIcon from '@/components/ui/StarIcon';
import ChatBubbleIcon from '@/components/ui/ChatBubbleIcon';
import CloudDownloadIcon from '@/components/ui/CloudDownload';
import { ExchangeAltIcon } from '@/components/ui/ExchangeAltIcon';
import HashtagIcon from '@/components/ui/HashTagIcon';
import UsersIcon from '@/components/ui/UsersIcon';
import { DynamicLine } from '@/components/dynamic/DynamicLine';
import { DynamicLineVersion } from '@/components/dynamic/DynamiqueLineVersion';

// --- Types ---
type TeamMember = { id: string; name: string; email: string; avatar: any; };
type ProjectVersion = { id: string; version: string; date: string; }; 
type Server = { id: string; avatar: any; name: string; };

const HomeProjectScreen = () => { 
  const colors = useThemeColors();
  const router = useRouter();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState('1');

  // --- Données simulées ---
  const servers: Server[] = [
    { id: '1', name: 'Projet A', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '2', name: 'Projet B', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '3', name: 'Projet C', avatar: require('@/assets/images/partial-react-logo.png') },
  ];
  const projectDetails = { name: 'Async - Community | Xode Template', members: 4, id: '#xdvm' };
  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Albert', email: 'albert@example.com', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '2', name: 'Gilbert', email: 'gilbert@example.com', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '3', name: 'Rigobert', email: 'rigo@example.com', avatar: require('@/assets/images/partial-react-logo.png') },
    { id: '4', name: 'Guillaume', email: 'guillaume@example.com', avatar: require('@/assets/images/partial-react-logo.png') },
  ];
  
  const versions: ProjectVersion[] = [
    { id: 'v.1', version: 'v2.1.0', date: '05/06/2025' },
    { id: 'v.2', version: 'v2.0.1', date: '01/05/2025' },
    { id: 'v.3', version: 'v1.9.5', date: '15/04/2025' },
    { id: 'v.4', version: 'v1.8.0', date: '02/03/2025' },
  ];

  const handleSectionToggle = (sectionName: 'team' | 'version') => {
      setOpenSection(prevOpenSection => 
          prevOpenSection === sectionName ? null : sectionName
      );
  };

  // --- Fonctions de rendu ---
  const renderSidebar = () => (
    <CardComponent style={[styles.sidebar, { backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
        <TouchableOpacity style={[styles.serverIconWrapper, { backgroundColor: colors.input }]}>
          <ChatBubbleIcon fillColor={colors.icon} width='24' height='24' />
        </TouchableOpacity>
        <CardComponent style={[styles.separator, { backgroundColor: colors.input }]} />
        {servers.map(server => (
          <TouchableOpacity key={server.id} onPress={() => setActiveServer(server.id)} style={styles.serverIconWrapper}>
            {activeServer === server.id && <CardComponent style={[styles.activeServerIndicator, { backgroundColor: colors.text }]} />}
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
    </CardComponent>
  );

  // CORRECTION : Remplacement de FlatList par un .map() pour éviter l'erreur de nesting
  const renderListView = (title: string, data: any[], renderItem: (item: any, index: number) => JSX.Element) => (
      <View style={styles.dropdownContent}>
        <View style={[styles.listHeader, { borderBottomColor: colors.border }]}>
            <TextComponent variante='subtitle3' color={colors.muted}># {title}</TextComponent>
        </View>
        {data.map((item, index) => (
          <View key={item.id}>
            {renderItem(item, index)}
          </View>
        ))}
      </View>
  );
  
  const renderMainContent = () => (
    <CardComponent style={styles.mainContent}>
      <ScrollView style={{flex:1,backgroundColor:colors.background2, marginTop:15, borderTopLeftRadius: 20}}>
        <CardComponent style={styles.detailsView}>
          <Image source={
            require('@/assets/images/partial-react-logo.png')} 
            style={{width:'100%', height:170}} // Hauteur fixe pour l'image
            blurRadius={15}
          />
          <CardComponent style={{backgroundColor:colors.background2, padding:13}}>
            <CardComponent style={styles.detailsCard}>
            <CardComponent style={{flexDirection:'row', backgroundColor:colors.background2, gap:4,  alignItems: 'center'}}>
                {/* MODIFICATIONS APPLIQUÉES ICI */}
                <TextComponent 
                    variante="headline"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flex: 1 }} // <-- Ajout crucial pour la flexibilité
                >
                    {projectDetails.name}
                </TextComponent>
                
                <StarIcon fillColor={colors.accent} width='16' height='16'/>
                <MaterialIcons name="chevron-right" size={24} color={colors.iconNoSelected} />
            </CardComponent>
              <CardComponent style={styles.detailsSubline}>
                  <TextComponent variante='body5' color={colors.muted}>Membres: {projectDetails.members}</TextComponent>
                  <TextComponent variante='body5' color={colors.muted}>ID: {projectDetails.id}</TextComponent>
              </CardComponent>
            </CardComponent>

            <CardComponent style={styles.actionsContainer}>
              <CardComponent style={[styles.downloadButton,{backgroundColor:colors.input}]}>
                <CloudDownloadIcon height='24' width='24'/>
                <ButtonComponent
                    title="Ajouter en local" 
                    onPress={() => {}} // N'oubliez pas l'événement onPress
                    style={{backgroundColor:'transparent'}} // Doit être 'transparent' et non 'none'
                    textStyle={{color: colors.primaryForeground}}
                />
              </CardComponent>
              <TouchableOpacity>
                  {/* <MaterialIcons name="refresh" size={30} color={colors.icon} /> */}
                  <ExchangeAltIcon fillColor={colors.icon} width='25' height='25' />
              </TouchableOpacity>
            </CardComponent>
            <CardComponent style={{width:'100%', height:0.5, backgroundColor:colors.iconNoSelected}}>
            </CardComponent>
            
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border }]} onPress={() => handleSectionToggle('team')}>
              <HashtagIcon fillColor={ openSection === 'team' ? colors.icon: colors.iconNoSelected} width='16' height='16'/>
              <TextComponent  color= { openSection === 'team' ? colors.icon: colors.iconNoSelected} variante={ openSection === 'team' ? 'headline': 'headline2'}> 🔥| Team</TextComponent>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border, borderBottomColor: openSection !== 'version' ? colors.border : 'transparent' }]} onPress={() => handleSectionToggle('version')}>
              <HashtagIcon fillColor={ openSection === 'version' ? colors.icon: colors.iconNoSelected} width='16' height='16'/>
              <TextComponent color= { openSection === 'version' ? colors.icon: colors.iconNoSelected} variante={ openSection === 'version' ? 'headline': 'headline2'}> 🌪️ | Version</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border, borderBottomColor: openSection !== 'version' ? colors.border : 'transparent' }]} onPress={() => handleSectionToggle('version')}>
              <HashtagIcon fillColor={ colors.iconNoSelected} width='16' height='16'/>
              <TextComponent color= { colors.iconNoSelected} variante='headline2'> 🗯️ | Chat</TextComponent>
            </TouchableOpacity>
            {openSection === 'version' && (
              <View style={styles.dynamicLineContainer}>
                  <DynamicLineVersion data={versions} />
              </View>
            )}
            {openSection === 'team' && (
              <View style={styles.dynamicLineContainer}>
                <DynamicLine
                  borderColor={colors.iconNoSelected}
                  backgroundColor={colors.background2}
                  data={teamMembers.map(member => ({
                    title: member.name,
                    email: member.email, // On passe l'email
                    avatar: member.avatar // On passe l'avatar
                  }))}
                />
              </View>
            )}
          </CardComponent>
        </CardComponent>
      </ScrollView>
    </CardComponent>
  );

  const styles = StyleSheet.create({
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
    detailsView: { flex:1 , backgroundColor:colors.background2},
    detailsCard: {
      marginBottom: 10,
      backgroundColor:colors.background2
    },
    detailsSubline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor:colors.background2
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      backgroundColor:colors.background2, 
    },
    downloadButton: {
      flex: 1, 
      flexDirection:'row',
      marginRight: 16,
      paddingVertical: 4,
      borderRadius:20, 
      alignItems:'center', 
      justifyContent:'center'
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingHorizontal: 12,
      gap: 5
    },
    dropdownContent: {
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: '#E3E5E8', 
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
      backgroundColor:colors.background2
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    dynamicLineContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.background2
    },
  });

  return (
    <SafeAreaView style = {{backgroundColor: colors.background2, flex: 1}}>
      <CardComponent style={styles.container}>
        {renderSidebar()}
        {renderMainContent()}
      </CardComponent>
    </SafeAreaView>
  );
};

export default HomeProjectScreen;