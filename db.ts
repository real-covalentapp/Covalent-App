
import { QuestionnaireData } from './types';

// Using a fresh, unique bucket ID to ensure no collisions with previous versions
const BUCKET_ID = 'covalent_prod_final_v5_global';
const BASE_URL = `https://kvdb.io/A8Y4k9P7pG6J1z8wM2n3/`;

export const db = {
  async saveSubmission(submission: QuestionnaireData): Promise<boolean> {
    // 1. Local backup
    const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    localStorage.setItem('covalent_submissions', JSON.stringify([submission, ...local]));

    try {
      // 2. Critical: Fetch remote with cache busting to get the ABSOLUTE latest
      const response = await fetch(`${BASE_URL}${BUCKET_ID}?t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      let remote: QuestionnaireData[] = [];
      if (response.ok) {
        const text = await response.text();
        remote = text ? JSON.parse(text) : [];
      }

      // 3. Merge EVERYTHING (Local cache + Remote + Current submission)
      // This ensures that even if a device was offline, its old submissions eventually get pushed.
      const allSubmissions = [submission, ...local, ...remote];
      const merged = allSubmissions.reduce((acc: QuestionnaireData[], curr) => {
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

      if (!pushResponse.ok) throw new Error("Cloud push failed");
      
      localStorage.setItem('covalent_submissions', JSON.stringify(merged));
      return true;
    } catch (err) {
      console.error('CRITICAL SYNC ERROR:', err);
      return false;
    }
  },

  async getAllSubmissions(): Promise<QuestionnaireData[]> {
    try {
      // Use timestamp query to bypass any carrier or browser level caching
      const response = await fetch(`${BASE_URL}${BUCKET_ID}?t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Registry unreachable");
      
      const remote = await response.json();
      const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
      
      // Merge local with remote to ensure any unsynced local data is visible to the admin
      const merged = [...local, ...remote].reduce((acc: QuestionnaireData[], curr) => {
        if (!acc.find(item => item.id === curr.id)) acc.push(curr);
        return acc;
      }, []);
      
      localStorage.setItem('covalent_submissions', JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Network issue, falling back to local storage.');
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
