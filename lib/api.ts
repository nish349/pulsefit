const SHEETS_API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL || '';

export const api = {
    // Generic Fetch
    async fetchData(type: 'Plans' | 'Maintenance' | 'Members' | 'Leads' | 'Staff'): Promise<any[] | null> {
        if (!SHEETS_API_URL) return null;

        try {
            // Append ?type=... to URL
            const url = `${SHEETS_API_URL}?type=${type}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${type}`);
            return await response.json();
        } catch (error) {
            console.error(`API Fetch Error (${type}):`, error);
            return null;
        }
    },

    // Generic Save
    async saveData(type: 'Plans' | 'Maintenance' | 'Members' | 'Leads' | 'Staff', data: any[]): Promise<boolean> {
        if (!SHEETS_API_URL) return false;

        try {
            const payload = {
                type, // "Plans", "Maintenance", etc.
                data
            };
            
            // Apps Script Web App "Anyone" usually requires no-cors for simple POSTs 
            // but we send text/plain to avoid preflight issues if possible.
            await fetch(SHEETS_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            });
            
            return true;
        } catch (error) {
            console.error(`API Save Error (${type}):`, error);
            return false;
        }
    }
};
