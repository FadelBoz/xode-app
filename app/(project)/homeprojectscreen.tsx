// xode-app/app/project/homeprojectscreen.tsx

// AJOUT: Imports nécessaires pour la gestion d'état et le chargement
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useThemeColors } from '@/hooks/useThemeColors';
import { TextComponent } from '@/components/text/TextComponent';
import { CardComponent } from '@/components/ui/CardComponent';
import { ButtonComponent } from '@/components/ui/ButtonComponent';
import StarIcon from '@/components/ui/StarIcon';
import ChatBubbleIcon from '@/components/ui/ChatBubbleIcon';
import CloudDownloadIcon from '@/components/ui/CloudDownload';
import { ExchangeAltIcon } from '@/components/ui/ExchangeAltIcon';
import HashtagIcon from '@/components/ui/HashTagIcon';
import { DynamicLine } from '@/components/dynamic/DynamicLine';
import { DynamicLineVersion } from '@/components/dynamic/DynamiqueLineVersion';

// AJOUT: Importer le type et la fonction de chargement depuis le storage
import { Project, getLastActiveProject, TeamMember } from '@/utils/projectStorage';
import { color } from '@/constants/color';

// --- Types ---
type Server = { id: string; avatar: any; name: string; };

const HomeProjectScreen = () => { 
  const colors = useThemeColors();
  const router = useRouter();

  // --- États pour les données réelles et la logique UI ---
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [activeServer, setActiveServer] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<TeamMember | null>(null);

  // AJOUT: Logique pour charger les données réelles au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        const activeProject = await getLastActiveProject();
        setProject(activeProject);
        if (activeProject) {
          setActiveServer(String(activeProject.id));
        }
      } catch (e) {
        console.error("Erreur lors du chargement des données du projet depuis le cache", e);
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSectionToggle = (sectionName: 'team' | 'version' | 'description') => {
      setOpenSection(prevOpenSection => 
          prevOpenSection === sectionName ? null : sectionName
      );
  };
  // NOTE: Les styles n'ont pas été modifiés, ils sont juste déplacés pour la lisibilité.
  const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
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
    imageHeader: {width:'100%', height:170},
    contentPadding: {backgroundColor:colors.background2, padding:13},
    detailsCard: {
      marginBottom: 10,
      backgroundColor:colors.background2
    },
    titleContainer: {flexDirection:'row', backgroundColor:colors.background2, gap:4,  alignItems: 'center'},
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
    mainSeparator: {width:'100%', height:0.5, backgroundColor:colors.iconNoSelected},
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: 5,
      paddingHorizontal: 12,
      gap: 5
    },
    dynamicLineContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: colors.background2
    },
  });
  // --- Gardes pour le chargement et l'état d'erreur ---
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <TextComponent>Aucun projet n'a pu être chargé.</TextComponent>
        <ButtonComponent title="Retour" onPress={() => router.back()} style={{marginTop: 20}} />
      </SafeAreaView>
    );
  }

  // --- Fonctions de rendu utilisant les données réelles ---
  const renderSidebar = () => (
    <CardComponent style={[styles.sidebar, { backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
        <TouchableOpacity style={[styles.serverIconWrapper, { backgroundColor: colors.input }]} onPress={()=>{
          router.replace({
              pathname: '/chatscreen'
            });
          }}>
          <ChatBubbleIcon fillColor={colors.icon} width='24' height='24' />
        </TouchableOpacity>
        <CardComponent style={[styles.separator, { backgroundColor: colors.input }]} />
        {project.team.map(member => (
          <TouchableOpacity key={member.id} onPress={() => setActiveUser(member)} style={styles.serverIconWrapper}>
            {activeUser?.id === member.id && <CardComponent style={[styles.activeServerIndicator, { backgroundColor: colors.text }]} />}
            <Image 
              source={member.avatarUrl ? { uri: member.avatarUrl } : require('@/assets/images/react-logo.png')} 
              style={styles.serverIcon} 
            />
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
  
  const renderMainContent = () => (
    <CardComponent style={styles.mainContent}>
      <ScrollView style={{flex:1,backgroundColor:colors.background2, marginTop:5, borderTopLeftRadius: 20}}>
        <CardComponent style={styles.detailsView}>
          <Image 
            source={project.projectImage ? { uri: project.projectImage } : require('@/assets/images/partial-react-logo.png')} 
            style={{width:'100%', height:170}}
            blurRadius={15}
          />
          <CardComponent style={{backgroundColor:colors.background2, padding:13}}>
            <CardComponent style={styles.detailsCard}>
            <CardComponent style={{flexDirection:'row', backgroundColor:colors.background2, gap:4,  alignItems: 'center'}}>
                <TextComponent 
                    variante="headline"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ flex: 1 }}
                >
                    {project.name}
                </TextComponent>
                <StarIcon fillColor={colors.accent} width='16' height='16'/>
                <MaterialIcons name="chevron-right" size={24} color={colors.iconNoSelected} />
            </CardComponent>
              <CardComponent style={styles.detailsSubline}>
                  <TextComponent variante='body5' color={colors.muted}>Membres: {project.team.length}</TextComponent>
                  <TextComponent variante='body5' color={colors.muted}>ID: {project.publicUrl}</TextComponent>
              </CardComponent>
            </CardComponent>

            <CardComponent style={styles.actionsContainer}>
              <CardComponent style={[styles.downloadButton,{backgroundColor:colors.input}]}>
                <CloudDownloadIcon height='24' width='24'/>
                <ButtonComponent
                    title="Ajouter en local" 
                    onPress={() => {}}
                    style={{backgroundColor:'transparent'}}
                    textStyle={{color: colors.primaryForeground}}
                />
              </CardComponent>
              <TouchableOpacity>
                  <ExchangeAltIcon fillColor={colors.icon} width='25' height='25' />
              </TouchableOpacity>
            </CardComponent>
            <CardComponent style={{width:'100%', height:0.5, backgroundColor:colors.input}} />
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border }]} onPress={() => handleSectionToggle('team')}>
              <HashtagIcon fillColor={ openSection === 'team' ? colors.icon: colors.iconNoSelected} width='16' height='16'/>
              <TextComponent  color= { openSection === 'team' ? colors.icon: colors.iconNoSelected} variante={ openSection === 'team' ? 'headline': 'headline2'}> 🔥| Team</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border}]} onPress={() => handleSectionToggle('description')}>
              <HashtagIcon fillColor={ openSection === 'description' ? colors.icon: colors.iconNoSelected} width='16' height='16'/>
              <TextComponent color= { openSection === 'description' ? colors.icon: colors.iconNoSelected} variante='headline2'> 🗯️ | Description</TextComponent>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, { borderTopColor: colors.border}]} onPress={() => handleSectionToggle('version')}>
              <HashtagIcon fillColor={ openSection === 'version' ? colors.icon: colors.iconNoSelected} width='16' height='16'/>
              <TextComponent color= { openSection === 'version' ? colors.icon: colors.iconNoSelected} variante={ openSection === 'version' ? 'headline': 'headline2'}> 🌪️ | Version</TextComponent>
            </TouchableOpacity>
            <CardComponent style={{width:'100%', height:0.5, backgroundColor:colors.input, marginTop:8}} />
            {openSection === 'team' && (
              <View style={styles.dynamicLineContainer}>
                <DynamicLine
                  borderColor={colors.iconNoSelected}
                  backgroundColor={colors.background2}
                  data={project.team.map(member => ({
                    title: member.name,
                    email: member.email,
                    avatar: member.avatarUrl ? { uri: member.avatarUrl } : require('@/assets/images/react-logo.png')
                  }))}
                />
              </View>
            )}
            {openSection === 'version' && project.versions && project.versions.length > 0 && (
              <View style={styles.dynamicLineContainer}>
                  <DynamicLineVersion data={project.versions.map(v => ({
                      id: String(v.id),
                      version: v.versionNumber,
                      date: new Date(v.createdAt).toLocaleDateString()
                    }))} />
              </View>
            )}
            {openSection === 'description' && project.description && project.description.length > 0 && (
              <View style={{flex:1, alignItems:'center', marginTop:10}}>
               <TextComponent color={colors.icon}>{project.description}</TextComponent>
              </View>
            )}
          </CardComponent>
        </CardComponent>
      </ScrollView>
    </CardComponent>
  );

  return (
    <SafeAreaView style = {{backgroundColor: colors.background, flex: 1}}>
      <CardComponent style={styles.container}>
        {renderSidebar()}
        {renderMainContent()}
      </CardComponent>
    </SafeAreaView>
  );
};

export default HomeProjectScreen;