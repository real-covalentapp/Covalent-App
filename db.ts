
import { QuestionnaireData } from './types';

// Unique bucket for the Covalent Global Registry
const BUCKET_ID = 'covalent_registry_v4_final';
const BASE_URL = `https://kvdb.io/A8Y4k9P7pG6J1z8wM2n3/`;

export const db = {
  async saveSubmission(submission: QuestionnaireData): Promise<boolean> {
    // 1. Save locally first as a fallback
    const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    const updatedLocal = [submission, ...local];
    localStorage.setItem('covalent_submissions', JSON.stringify(updatedLocal));

    try {
      // 2. Fetch latest remote data to merge
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      
      let remote: QuestionnaireData[] = [];
      if (response.ok) {
        const text = await response.text();
        remote = text ? JSON.parse(text) : [];
      }

      // 3. Merge avoiding duplicates by ID
      const merged = [...updatedLocal, ...remote].reduce((acc: QuestionnaireData[], curr) => {
        if (!acc.find(item => item.id === curr.id)) acc.push(curr);
        return acc;
      }, []);

      // 4. Push to Cloud
      const pushResponse = await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(merged),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!pushResponse.ok) throw new Error("Sync failed at the cloud level");
      
      localStorage.setItem('covalent_submissions', JSON.stringify(merged));
      return true;
    } catch (err) {
      console.error('Sync Error:', err);
      return false; // User still proceeds as data is in localStorage
    }
  },

  async getAllSubmissions(): Promise<QuestionnaireData[]> {
    try {
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Connection failed");
      
      const remote = await response.json();
      const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
      
      // Merge local unsynced with remote
      const merged = [...local, ...remote].reduce((acc: QuestionnaireData[], curr) => {
        if (!acc.find(item => item.id === curr.id)) acc.push(curr);
        return acc;
      }, []);
      
      localStorage.setItem('covalent_submissions', JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Network issue, using local cache.');
      return JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    }
  },

  async clearAll() {
    try {
      await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.removeItem('covalent_submissions');
    } catch (err) {
      console.error("Clear failed:", err);
    }
  }
};
