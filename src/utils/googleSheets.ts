import Papa from 'papaparse';

export const fetchSheetData = <T>(url: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    // Zkusit načíst z cache
    const cacheKey = `sheet_cache_${url}`;
    const cachedItem = sessionStorage.getItem(cacheKey);
    
    if (cachedItem) {
      try {
        const parsedItem = JSON.parse(cachedItem);
        const now = new Date().getTime();
        // 60000 ms = 1 minuta
        if (parsedItem.timestamp && (now - parsedItem.timestamp < 60000)) {
          return resolve(parsedItem.data as T[]);
        }
      } catch (e) {
        console.error("Failed to parse cached data", e);
      }
    }

    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => {
        // Uložit do cache s timestampem
        try {
          const cacheData = {
            timestamp: new Date().getTime(),
            data: results.data
          };
          sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
        } catch (e) {
          console.error("Failed to save to cache", e);
        }
        resolve(results.data as T[]);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
};

export const isPlayerActive = (player: any): boolean => {
  if (!player || typeof player !== 'object') return false;
  const name = player['Jméno'] || player['jméno'] || player['Name'] || player['name'];
  if (!name || String(name).trim() === '') return false;
  
  const keys = Object.keys(player);
  
  // Check absence keys (e.g. Není přítomen)
  const absenceKey = keys.find(k => 
    /^(není\s+přítomen|neni\s+pritomen|nepřítomen|nepritomen|nepřítomný|nepritomny|absent)$/i.test(k.trim())
  );
  if (absenceKey) {
    const val = String(player[absenceKey]).trim().toLowerCase();
    if (val === 'true' || val === 'ano' || val === '1' || val === 'yes') {
      return false;
    }
  }

  // Check presence keys (e.g. Přítomen, Aktivní)
  const presenceKey = keys.find(k => 
    /^(přítomen|pritomen|aktivní|aktivni|hraje|přítomný|pritomny|present|active)$/i.test(k.trim())
  );
  if (presenceKey) {
    const val = String(player[presenceKey]).trim().toLowerCase();
    if (val === 'false' || val === 'ne' || val === '0' || val === 'no') {
      return false;
    }
  }

  return true;
};

