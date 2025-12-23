
import { QuestionnaireData } from './types';

const BUCKET_ID = 'covalent_cohort_v1_sync_final';
const BASE_URL = `https://kvdb.io/A8Y4k9P7pG6J1z8wM2n3/`;

export const db = {
  async saveSubmission(submission: QuestionnaireData) {
    console.log("Saving submission...", submission.id);
    
    // 1. Save locally first (Immediate feedback)
    const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
    const updatedLocal = [submission, ...local];
    localStorage.setItem('covalent_submissions', JSON.stringify(updatedLocal));

    try {
      // 2. Fetch remote to merge
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`);
      let remote: QuestionnaireData[] = [];
      if (response.ok) {
        const text = await response.text();
        remote = text ? JSON.parse(text) : [];
      }

      // 3. Merge avoiding duplicates
      const merged = [...updatedLocal, ...remote].reduce((acc: QuestionnaireData[], curr) => {
        if (!acc.find(item => item.id === curr.id)) acc.push(curr);
        return acc;
      }, []);

      // 4. Push to cloud
      await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        body: JSON.stringify(merged),
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log("Cloud sync successful");
    } catch (err) {
      console.error('Cloud sync failed, staying local:', err);
      // We don't throw here so the user can still finish their flow locally
    }
  },

  async getAllSubmissions(): Promise<QuestionnaireData[]> {
    try {
      const response = await fetch(`${BASE_URL}${BUCKET_ID}`, { cache: 'no-store' });
      if (!response.ok) throw new Error("Cloud unreachable");
      
      const remote = await response.json();
      const local = JSON.parse(localStorage.getItem('covalent_submissions') || '[]');
      
      // Merge local and remote
      const merged = [...local, ...remote].reduce((acc: QuestionnaireData[], curr) => {
        if (!acc.find(item => item.id === curr.id)) acc.push(curr);
        return acc;
      }, []);
      
      // Update local cache
      localStorage.setItem('covalent_submissions', JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Sync failed, using local cache:', err);
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
      console.error("Clear failed:", err);
    }
  }
};
