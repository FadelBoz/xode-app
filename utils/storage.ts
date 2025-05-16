// utils/storage.ts
import * as FileSystem from 'expo-file-system';

const userFile = FileSystem.documentDirectory + 'users.json';

type StoredUser = {
  id?: number;
  name?: string;
  email: string;
  token: string;
};

/**
 * Sauvegarde les données de l'utilisateur (email, nom, id, token) dans un fichier local.
 */
export async function saveUser(user: StoredUser) {
  await FileSystem.writeAsStringAsync(userFile, JSON.stringify(user));
}

/**
 * Récupère les données utilisateur stockées localement.
 * Retourne null si le fichier est introuvable ou corrompu.
 */
export async function getUser(): Promise<StoredUser | null> {
  try {
    const content = await FileSystem.readAsStringAsync(userFile);
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

/**
 * Récupère uniquement le token utilisateur depuis le fichier local.
 */
export async function getToken(): Promise<string | null> {
  const user = await getUser();
  return user?.token ?? null;
}

/**
 * Supprime les données utilisateur (utilisé pour la déconnexion).
 */
export async function deleteUserFile() {
  await FileSystem.deleteAsync(userFile, { idempotent: true });
}

/**
 * Méthode de déconnexion : supprime les infos utilisateur et redirige si besoin.
 */
export async function logout() {
  await deleteUserFile();
  // Ajoute ici une redirection si nécessaire, ex. router.replace('/login')
}

/**
 * Retourne le chemin du dossier de stockage de l'application.
 */
export function getAppDirectoryPath(): string {
  return FileSystem.documentDirectory ?? '';
}
