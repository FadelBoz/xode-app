// xode-app/services/ProjectService.ts

import { API_URL } from "@/configs/global";
import { getToken } from "@/utils/storage";
import { Project, saveProjectData } from "@/utils/projectStorage";

/**
 * Récupère les données les plus récentes d'un projet depuis l'API,
 * les sauvegarde dans le cache local et les retourne.
 * @param publicUrl L'URL publique du projet à rafraîchir.
 * @returns Les données complètes et à jour du projet.
 */
export const refreshProjectData = async (publicUrl: string): Promise<Project> => {
  console.log(`Rafraîchissement du projet: ${publicUrl}`);
  
  const token = await getToken();
  if (!token) throw new Error("Utilisateur non authentifié.");

  const endpoint = `${API_URL}mobile/project-data/${publicUrl}`;

  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Erreur serveur (${response.status})`);
  }

  const projectDataFromApi = await response.json();

  // La fonction saveProjectData s'occupe de mettre à jour le cache
  await saveProjectData(projectDataFromApi);

  // On retourne les données fraîchement sauvegardées (avec le `lastAccessed` mis à jour)
  // Il faut ré-importer la fonction pour avoir la version complète
  const { getProjectData } = require('@/utils/projectStorage');
  const freshProjectData = await getProjectData(projectDataFromApi.id);

  if (!freshProjectData) {
      throw new Error("Impossible de récupérer le projet après la sauvegarde.");
  }
  
  return freshProjectData;
};