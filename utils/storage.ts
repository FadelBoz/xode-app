// utils/storage.ts
import * as FileSystem from 'expo-file-system';

const userFile = FileSystem.documentDirectory + 'user.json';

export async function saveUser(user: { email: string; token?: string }) {
  await FileSystem.writeAsStringAsync(userFile, JSON.stringify(user));
}

export async function getUser(): Promise<null | { email: string; token?: string }> {
  try {
    const content = await FileSystem.readAsStringAsync(userFile);
    return JSON.parse(content);
  } catch (e) {
    return null; // fichier non trouvé ou corrompu
  }
}

export async function deleteUserFile() {
  await FileSystem.deleteAsync(userFile, { idempotent: true });
}
