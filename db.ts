
import { QuestionnaireData } from './types';

/**
 * COVALENT CLOUD REGISTRY
 * Uses a public anonymous KV store to sync submissions across devices.
 * In a production environment, this would be replaced by a secure private database.
 */

// A stable unique key for your specific cohort instance
const BUCKET_ID = 'covalent_cohort_v1_global';
const BASE_URL = `https://kvdb.io/A8Y4k9P7pG6J1z8wM2n3/`; // Shared public bucket for the prototype

export const db = {
  async saveSubmission(submission: QuestionnaireData) {
    try {
      // 1. Get existing submissions from the cloud
      const current = await this.getAllSubmissions();
      
      // 2. Append new submission
      const updated = [submission, ...current];
      
      // 3. Save back to the global cloud
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        body: JSON.stringify(updated),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Cloud sync failed');
      
      // Backup to localStorage
      localStorage.setItem('covalent_backup', JSON.stringify(submission));
    } catch (err) {
      console.error('Persistence error:', err);
      // Fallback: Store locally if cloud is down
      const existing = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
      localStorage.setItem('covalent_submissions', JSON.stringify([submission, ...existing]));
    }
  },

  async getAllSubmissions(): Promise<QuestionnaireData[]> {
    try {
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Cloud offline, reading local cache');
      return JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    }
  },

  async clearAll() {
    try {
      await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.removeItem('covalent_submissions');
    } catch (err) {
      console.error(err);
    }
  }
};
