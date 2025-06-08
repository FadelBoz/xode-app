// xode-app/hooks/useProjectLoader.ts

import { useState, useEffect } from 'react';
import { API_URL } from '@/configs/global';
import { saveProjectData } from '@/utils/projectStorage';
import { getToken } from '@/utils/storage'; // AJOUT: Importer la fonction pour récupérer le token

type UseProjectLoaderReturn = {
  isLoading: boolean;
  error: string | null;
  progress: number;
  loadingMessage: string;
};

export const useProjectLoader = (projectUrl?: string): UseProjectLoaderReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initialisation...');

  useEffect(() => {
    const loadProject = async () => {
      // 1. Valider l'URL en entrée
      if (!projectUrl || !projectUrl.startsWith('xd://')) {
        setError("URL du projet invalide.");
        setLoadingMessage("Erreur");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // AJOUT: Récupérer le token d'authentification
        setLoadingMessage('Authentification...');
        setProgress(10);
        const token = await getToken();
        if (!token) {
          throw new Error("Utilisateur non authentifié. Impossible de charger le projet.");
        }

        // 2. Préparer l'URL de l'API
        const publicUrl = projectUrl.replace('xd://', '');
        // MODIFICATION: Utilisation du bon endpoint défini dans api.php
        const endpoint = `${API_URL}mobile/project-data/${publicUrl}`; 

        setLoadingMessage('Connexion au serveur...');
        setProgress(25);

        // 3. Effectuer l'appel API avec le token
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                // AJOUT: Header d'autorisation
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur serveur (Status: ${response.status})`);
        }
        
        setLoadingMessage('Téléchargement des données...');
        setProgress(60);

        const projectData = await response.json();
        
        // 4. Sauvegarder les données dans le cache local
        setLoadingMessage('Sauvegarde du projet...');
        // La fonction `saveProjectData` s'attend maintenant à recevoir la réponse de l'API
        await saveProjectData(projectData);
        setProgress(100);
        
        setLoadingMessage('Build terminé !');

      } catch (err: any) {
        console.error("Erreur dans useProjectLoader:", err);
        setError(err.message || "Une erreur inconnue est survenue.");
        setLoadingMessage("Échec du chargement");
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectUrl]);

  return { isLoading, error, progress, loadingMessage };
};