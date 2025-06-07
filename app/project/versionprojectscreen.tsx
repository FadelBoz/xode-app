import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProjectVersion {
  id: string;
  version: string;
  icon: string; // URL to version icon (pear in the image)
}

const VersionProjectScreen = () => {
  const router = useRouter();
  const projectName = "Project"; // Example project name

  const versions: ProjectVersion[] = [
    { id: '1', version: 'V.1.2.3', icon: 'https://via.placeholder.com/60/FFFFFF/000000?Text=🍐' },
    { id: '2', version: 'V.1.5.6', icon: 'https://via.placeholder.com/60/FFFFFF/000000?Text=🍐' },
    { id: '3', version: 'V.1.7.8', icon: 'https://via.placeholder.com/60/FFFFFF/000000?Text=🍐' },
    { id: '4', version: 'V.6.8.9', icon: 'https://via.placeholder.com/60/FFFFFF/000000?Text=🍐' },
  ]; // The image shows pears as icons

  const renderItem = ({ item }: { item: ProjectVersion }) => (
    <View style={styles.versionCard}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.versionText}>{item.version}</Text>
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
              <Text style={styles.headerTextHighlight}>Version</Text>
            </View>
          ),
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Version</Text>
      </View>
      <FlatList
        data={versions}
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
    backgroundColor: '#F0F0F0', // Light gray background
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
    color: '#000000',
    fontWeight: '500',
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pageTitle: {
    fontSize: 28, // Larger title as per image
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center', // Centered title
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000', // Black cards
    borderRadius: 8,
    padding: 20, // More padding
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: 40, // Smaller icon
    height: 40,
    borderRadius: 20,
    marginRight: 20,
    backgroundColor: '#FFFFFF', // White background for the icon
  },
  versionText: {
    fontSize: 18, // Larger text for version
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default VersionProjectScreen;