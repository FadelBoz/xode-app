// xode-app/services/ProjectDownloader.ts

import * as FileSystem from 'expo-file-system';
import { Project, ProjectFile, ProjectSummary, getAllCachedProjects } from '@/utils/projectStorage';

// Type pour le callback de progression
type ProgressCallback = (progress: { current: number; total: number; fileName: string }) => void;

/**
 * Fonction récursive pour aplatir l'arborescence des fichiers et dossiers.
 * @param files L'arborescence hiérarchique des fichiers.
 * @returns Un objet contenant deux listes : une pour les dossiers et une pour les fichiers.
 */
const flattenFileTree = (files: ProjectFile[]): { folders: ProjectFile[]; files: ProjectFile[] } => {
  let allFolders: ProjectFile[] = [];
  let allFiles: ProjectFile[] = [];

  const traverse = (items: ProjectFile[]) => {
    for (const item of items) {
      if (item.type === 'folder') {
        allFolders.push(item);
        if (item.children && item.children.length > 0) {
          traverse(item.children);
        }
      } else {
        allFiles.push(item);
      }
    }
  };

  traverse(files);
  return { folders: allFolders, files: allFiles };
};

/**
 * Télécharge tous les fichiers d'un projet et les sauvegarde localement.
 * @param project Le projet à télécharger.
 * @param onProgress Un callback pour suivre la progression du téléchargement.
 */
export const downloadProjectLocally = async (project: Project, onProgress: ProgressCallback): Promise<void> => {
  // 1. Définir le dossier racine local pour ce projet
  const localProjectRoot = `${FileSystem.documentDirectory}projects/${project.publicUrl}`;
  
  // S'assurer que le dossier racine existe
  await FileSystem.makeDirectoryAsync(localProjectRoot, { intermediates: true });
  console.log(`Dossier racine créé à : ${localProjectRoot}`);

  // 2. Aplatir l'arborescence pour un traitement plus simple
  const { folders, files } = flattenFileTree(project.files);
  const totalFiles = files.length;
  console.log(`Préparation du téléchargement: ${folders.length} dossiers, ${totalFiles} fichiers.`);

  // 3. Créer toute la structure de dossiers locaux
  for (const folder of folders) {
    const folderPath = `${localProjectRoot}/${folder.path}`;
    await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
  }

  // 4. Télécharger chaque fichier un par un
  let downloadedCount = 0;
  for (const file of files) {
    if (!file.url) continue; // On ne peut pas télécharger un fichier sans URL

    downloadedCount++;
    const localUri = `${localProjectRoot}/${file.path}`;
    
    // Mettre à jour l'UI avec la progression
    onProgress({
      current: downloadedCount,
      total: totalFiles,
      fileName: file.name,
    });
    
    try {
      console.log(`Téléchargement de ${file.url} vers ${localUri}`);
      await FileSystem.downloadAsync(file.url, localUri);
    } catch (error) {
      console.error(`Erreur lors du téléchargement du fichier ${file.name}:`, error);
      // On pourrait choisir de continuer ou d'arrêter tout le processus
      throw new Error(`Échec du téléchargement pour le fichier : ${file.name}`);
    }
  }
};

/**
 * Récupère la liste des projets qui ont été téléchargés localement.
 * @returns Une promesse résolue avec un tableau de projets locaux.
 */
export const getLocalProjects = async (): Promise<ProjectSummary[]> => {
    try {
      const allCachedProjects = await getAllCachedProjects();
      const localProjects: ProjectSummary[] = []; // Utilise le type ProjectSummary
  
      for (const project of allCachedProjects) { // `project` est de type ProjectSummary
        const projectDirUri = `${FileSystem.documentDirectory}projects/${project.publicUrl}`;
        const dirInfo = await FileSystem.getInfoAsync(projectDirUri);
        
        if (dirInfo.exists && dirInfo.isDirectory) {
          localProjects.push(project); // L'erreur disparaît car les types correspondent
        }
      }
      
      return localProjects;
    } catch (error) {
      console.error("Erreur lors de la récupération des projets locaux:", error);
      return [];
    }
};
  
  /**
   * Supprime le dossier local d'un projet.
   * @param publicUrl L'URL publique du projet à supprimer.
   */
  export const deleteLocalProject = async (publicUrl: string): Promise<void> => {
    try {
      const projectDirUri = `${FileSystem.documentDirectory}projects/${publicUrl}`;
      console.log(`Suppression du dossier : ${projectDirUri}`);
      await FileSystem.deleteAsync(projectDirUri, { idempotent: true });
    } catch (error) {
      console.error(`Erreur lors de la suppression du projet ${publicUrl}:`, error);
      throw new Error("La suppression du projet local a échoué.");
    }
  };