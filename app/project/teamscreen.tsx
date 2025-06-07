import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TeamMember {
  id: string;
  nom: string;
  email: string;
  avatar: string; // URL to avatar image
}

const TeamScreen = () => {
  const router = useRouter();
  const projectName = "Project"; // Example project name from image context

  const teamMembers: TeamMember[] = [
    { id: '1', nom: 'Jean Dupont', email: 'jean.dupont@example.com', avatar: 'https://via.placeholder.com/60/FFD700/000000?Text=JD' },
    { id: '2', nom: 'Alice Martin', email: 'alice.martin@example.com', avatar: 'https://via.placeholder.com/60/90EE90/000000?Text=AM' },
    { id: '3', nom: 'Pierre Bernard', email: 'pierre.bernard@example.com', avatar: 'https://via.placeholder.com/60/ADD8E6/000000?Text=PB' },
    { id: '4', nom: 'Sophie Dubois', email: 'sophie.dubois@example.com', avatar: 'https://via.placeholder.com/60/FFA07A/000000?Text=SD' },
    { id: '5', nom: 'Luc Moreau', email: 'luc.moreau@example.com', avatar: 'https://via.placeholder.com/60/DDA0DD/000000?Text=LM' },
  ]; // Replace with actual data, the image shows pears as avatars

  const renderItem = ({ item }: { item: TeamMember }) => (
    <View style={styles.memberCard}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>Nom: {item.nom}</Text>
        <Text style={styles.memberEmail}>Email: {item.email}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
       <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
               <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Text style={styles.backButtonText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.headerTextPrimary}>XD</Text>
              <Text style={styles.headerTextSeparator}> / </Text>
              <Text style={styles.headerTextSecondary}>{projectName}</Text>
              <Text style={styles.headerTextSeparator}> / </Text>
              <Text style={styles.headerTextHighlight}>Team</Text>
            </View>
          ),
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Team Membre</Text>
        {/* Consider making "Team Membre" part of the FlatList HeaderComponent if it should scroll */}
      </View>
      <FlatList
        data={teamMembers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F0F0', // Light gray background for the whole screen
  },
  // Header styles
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTextPrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  headerTextSeparator: {
    fontSize: 20,
    color: '#A0A0A0',
    marginHorizontal: 5,
  },
  headerTextSecondary: {
    fontSize: 20,
    color: '#505050',
  },
  headerTextHighlight: {
    fontSize: 20,
    color: '#000000', // Current screen name highlighted
    fontWeight: '500',
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20, // Space from header
    paddingBottom: 10,
    backgroundColor: '#FFFFFF', // White background for this title section
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center', // As per image, it seems centered under header
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000', // Black cards as per image
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25, // Circular avatar
    marginRight: 15,
    backgroundColor: '#FFFFFF', // White background for the pear image
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: '#E0E0E0', // Lighter text for email
  },
});

export default TeamScreen;