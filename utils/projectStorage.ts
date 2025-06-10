// xode-app/utils/projectStorage.ts

import * as FileSystem from 'expo-file-system';

// --- Définition des Types ---
// Ces types définissent la structure des données que nous allons sauvegarder.
// Ils sont basés sur le schéma de votre base de données.

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
};

export type ProjectVersion = {
  id: number;
  versionNumber: string;
  changelog: string | null;
  createdAt: string;
};

export type ProjectFile = {
  id: number;
  name: string;
  type: 'folder' | 'file' | string; // Type peut être plus spécifique
  path: string;
  url: string | null;
  parentId: number | null;
  // On pourrait ajouter un champ 'children' pour reconstruire l'arbre plus facilement
  children?: ProjectFile[];
};

// MODIFICATION: Mise à jour du type Project pour correspondre à la réponse de l'API
export type Project = {
    id: number;
    name: string;
    description: string | null;
    publicUrl: string;
    isStarred: boolean;
    projectImage: string | null;
    entryFilePath?: string; // AJOUT: Le chemin vers le fichier d'entrée, ex: "index.html"
    team: TeamMember[];
    versions: ProjectVersion[];
    files: ProjectFile[];
    lastAccessed: string;
  };

// AJOUT: Un type pour les listes, plus léger que le type Project complet.
export type ProjectSummary = {
  id: number;
  name: string;
  publicUrl: string;
};


// Ce type représente ce que l'API envoie VRAIMENT
type ProjectApiResponse = Omit<Project, 'lastAccessed' | 'versions' | 'files'>;

// C'est la structure principale de notre fichier de cache JSON
export type ProjectsCache = {
  lastActiveProjectId: number | null;
  projects: {
    [projectId: number]: Project; // Un dictionnaire de projets, avec l'ID comme clé
  };
};

// --- Constantes ---

const CACHE_FILE_NAME = 'projects_data.json';
const cacheFileUri = `${FileSystem.documentDirectory}${CACHE_FILE_NAME}`;

// --- Fonctions de base (privées au module) ---

/**
 * Lit et parse le fichier de cache.
 * Retourne un cache vide si le fichier n'existe pas ou est corrompu.
 */
const getProjectsCache = async (): Promise<ProjectsCache> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(cacheFileUri);
    if (!fileInfo.exists) {
      // Le fichier n'existe pas, on retourne une structure par défaut
      return { lastActiveProjectId: null, projects: {} };
    }
    const content = await FileSystem.readAsStringAsync(cacheFileUri);
    return JSON.parse(content) as ProjectsCache;
  } catch (error) {
    console.error("Erreur lors de la lecture du cache des projets:", error);
    // En cas d'erreur (ex: JSON corrompu), on repart d'un cache vide
    return { lastActiveProjectId: null, projects: {} };
  }
};

/**
 * Écrit l'objet de cache complet dans le fichier JSON.
 */
const saveProjectsCache = async (cache: ProjectsCache): Promise<void> => {
  try {
    const content = JSON.stringify(cache, null, 2); // Le '2' est pour une indentation propre (pretty-print)
    await FileSystem.writeAsStringAsync(cacheFileUri, content);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du cache des projets:", error);
  }
};


// --- Fonctions Publiques (API du module) ---

/**
 * Sauvegarde les données d'un projet spécifique dans le cache.
 * Met à jour le projet s'il existe déjà, ou l'ajoute s'il est nouveau.
 * @param projectData Les données complètes du projet à sauvegarder.
 */
export const saveProjectData = async (projectData: ProjectApiResponse): Promise<void> => {
    const cache = await getProjectsCache();
    
    // On complète l'objet avec les champs manquants avant de sauvegarder
    const projectToStore: Project = {
      ...projectData,
      versions: [], // On initialise avec un tableau vide
      files: [],    // On initialise avec un tableau vide
      lastAccessed: new Date().toISOString(),
    };
  
    cache.projects[projectData.id] = projectToStore;
    cache.lastActiveProjectId = projectData.id;
    
    await saveProjectsCache(cache);
  };

/**
 * Récupère les données d'un projet spécifique depuis le cache.
 * @param projectId L'ID du projet à récupérer.
 * @returns Les données du projet ou null s'il n'est pas trouvé.
 */
export const getProjectData = async (projectId: number): Promise<Project | null> => {
  const cache = await getProjectsCache();
  return cache.projects[projectId] || null;
};

/**
 * Récupère la liste de tous les projets en cache (détails de base).
 * Utile pour un écran "Projets récents".
 */
export const getAllCachedProjects = async (): Promise<ProjectSummary[]> => {
  const cache = await getProjectsCache();
  return Object.values(cache.projects)
      .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
      .map(p => ({
          id: p.id,
          name: p.name,
          publicUrl: p.publicUrl,
      }));
}


/**
 * Récupère les données du dernier projet actif.
 */
export const getLastActiveProject = async (): Promise<Project | null> => {
    const cache = await getProjectsCache();
    if (cache.lastActiveProjectId) {
        return cache.projects[cache.lastActiveProjectId] || null;
    }
    return null;
}

/**
 * Supprime un projet spécifique du cache.
 * @param projectId L'ID du projet à supprimer.
 */
export const removeProjectFromCache = async (projectId: number): Promise<void> => {
  const cache = await getProjectsCache();
  
  if (cache.projects[projectId]) {
    delete cache.projects[projectId];
    
    // Si le projet supprimé était le dernier actif, on réinitialise
    if (cache.lastActiveProjectId === projectId) {
      cache.lastActiveProjectId = null;
    }
    
    await saveProjectsCache(cache);
  }
};

/**
 * Vide complètement le cache de tous les projets.
 */
export const clearAllProjectsCache = async (): Promise<void> => {
  await saveProjectsCache({ lastActiveProjectId: null, projects: {} });
};