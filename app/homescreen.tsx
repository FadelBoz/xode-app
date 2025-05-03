import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router'; // Ajoutez cette importation

const HomeScreen = () => {
  const [isUrlInputVisible, setIsUrlInputVisible] = useState(false);
  const router = useRouter(); // Ajoutez cette ligne
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1D21" />
      
      {/* App Bar */}
      <View style={styles.appBar}>
        <View style={styles.appBarContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/XODE.png')}
              style={styles.logo}
              resizeMode="contain" 
            />
            <Text style={styles.appBarTitle}>XD preview</Text>
          </View>
        </View>
      </View>
      
      {/* Development Servers Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.serverIcon}>
            <Text style={styles.serverIconText}>$~</Text>
          </View>
          <Text style={styles.sectionTitle}>Development</Text>
          <TouchableOpacity>
            <Text style={styles.helpText}>HELP</Text>
          </TouchableOpacity>
        </View>
        
        {/* Sign In Card */}
        <View style={styles.signInCard}>
          <TouchableOpacity style={styles.signInPrompt}>
            <Text style={styles.signInText}>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat laboriosam sint 
              unde porro eveniet voluptatem rerum veritatis reprehenderit consequatur suscipit architecto
               ea saepe tenetur atque ullam deleniti repellendus, non magnam!
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.urlOption}
            onPress={() => setIsUrlInputVisible(!isUrlInputVisible)}
          >
            <Text style={styles.urlOptionText}>
              {isUrlInputVisible ? '▼' : '▶'} Enter URL manually
            </Text>
          </TouchableOpacity>
          
          {isUrlInputVisible && (
            <View style={styles.urlInputContainer}>
              <TextInput
                style={styles.urlInput}
                placeholder="exp://"
                placeholderTextColor="#8D8D8D"
                defaultValue="exp://"
              />
              <TouchableOpacity style={styles.connectButton}>
                <Text style={styles.connectButtonText}>Connect</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.qrOption}
            onPress={() => router.push('/scanscreen')} // Modifiez cette ligne
          >
            <View style={styles.qrIconContainer}>
              <Text style={styles.qrIcon}>▢</Text>
            </View>
            <Text style={styles.qrOptionText}>Scan QR code</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Recently Opened Section */}
      <View style={styles.recentSection}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recently opened</Text>
          <TouchableOpacity>
            <Text style={styles.clearButton}>CLEAR</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.recentItem}>
          <View style={styles.appIconContainer}>
            <Image 
              source={{ uri: 'https://cdn.jsdelivr.net/gh/expo/expo-cli@master/assets/fig/icon.png' }} 
              style={styles.appIcon} 
            />
          </View>
          <Text style={styles.appName}>xode-app</Text>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  appBar: {
    backgroundColor: '#1A1D21',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  appBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  serverIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#2A2D31',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  serverIconText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
  },
  helpText: {
    color: '#8D8D8D',
    fontSize: 12,
  },
  signInCard: {
    backgroundColor: '#1A1D21',
    borderRadius: 8,
    overflow: 'hidden',
  },
  signInPrompt: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  urlOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  urlOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 4,
  },
  urlInputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2D31',
  },
  urlInput: {
    backgroundColor: '#2A2D31',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  connectButton: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  qrOption: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrIconContainer: {
    marginRight: 8,
  },
  qrIcon: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  qrOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  recentSection: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recentTitle: {
    color: '#8D8D8D',
    fontSize: 14,
  },
  clearButton: {
    color: '#8D8D8D',
    fontSize: 14,
  },
  recentItem: {
    backgroundColor: '#1A1D21',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appIcon: {
    width: 24,
    height: 24,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    color: '#8D8D8D',
    fontSize: 24,
  },
});

export default HomeScreen;