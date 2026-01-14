/**
 * Utilitaire pour gérer le localStorage de manière type-safe
 */

export class LocalStorageUtil {
  /**
   * Sauvegarde un élément dans le localStorage
   * @param key Clé du localStorage
   * @param value Valeur à sauvegarder (sera sérialisée en JSON)
   */
  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde dans localStorage (${key}):`, error);
    }
  }

  /**
   * Récupère un élément du localStorage
   * @param key Clé du localStorage
   * @returns L'élément désérialisé ou null s'il n'existe pas
   */
  static getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Erreur lors de la lecture du localStorage (${key}):`, error);
      return null;
    }
  }

  /**
   * Supprime un élément du localStorage
   * @param key Clé du localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression du localStorage (${key}):`, error);
    }
  }

  /**
   * Vide complètement le localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du vidage du localStorage:', error);
    }
  }

  /**
   * Vérifie si une clé existe dans le localStorage
   * @param key Clé du localStorage
   */
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
