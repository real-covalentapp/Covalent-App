import { QuestionnaireData } from './types';

// Using a fresh bucket ID for a clean slate to avoid synchronization "islands" from previous versions
const BUCKET_ID = 'covalent_master_sync_v10_final';
const BASE_URL = `https://kvdb.io/A8Y4k9P7pG6J1z8wM2n3/`;

export const db = {
  async saveSubmission(submission: QuestionnaireData): Promise<boolean> {
    try {
      // 1. Fetch current global state directly from cloud, strictly bypassing cache
      const getResponse = await fetch(`${BASE_URL}${BUCKET_ID}?t=${Date.now()}`, {
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });
      
      let remoteList: QuestionnaireData[] = [];
      if (getResponse.ok) {
        const text = await getResponse.text();
        remoteList = text ? JSON.parse(text) : [];
      }

      // 2. Merge current submission with the remote list. 
      // De-duplication by ID is critical if a user hits submit twice or on separate devices.
      const updatedList = [submission, ...remoteList];
      const uniqueList = Array.from(new Map(updatedList.map(item => [item.id, item])).values());

      // 3. Push back the full global list
      const pushResponse = await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        body: JSON.stringify(uniqueList),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!pushResponse.ok) throw new Error("Cloud push failed");
      
      return true;
    } catch (err) {
      console.error('Critical sync failure:', err);
      // Still allow local persistence as a safety net
      const local = JSON.parse(localStorage.getItem('covalent_fallback') || '[]');
      localStorage.setItem('covalent_fallback', JSON.stringify([submission, ...local]));
      return false;
    }
  },

  async getAllSubmissions(): Promise<QuestionnaireData[]> {
    try {
      // Admin dashboard MUST only rely on the cloud to ensure all devices show the same count
      const response = await fetch(`${BASE_URL}${BUCKET_ID}?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error("Could not reach cloud registry");
      
      const remoteData = await response.json();
      return Array.isArray(remoteData) ? remoteData : [];
    } catch (err) {
      console.error("Failed to fetch global registry:", err);
      // Only as a absolute last resort show local data
      return JSON.parse(localStorage.getItem('covalent_fallback') || '[]');
    }
  },

  async clearAll() {
    try {
      await fetch(`${BASE_URL}${BUCKET_ID}`, {
        method: 'POST',
        body: JSON.stringify([]),
        headers: { 'Content-Type': 'application/json' }
      });
      localStorage.removeItem('covalent_fallback');
    } catch (err) {
      console.error("Registry clear failed:", err);
    }
  }
};