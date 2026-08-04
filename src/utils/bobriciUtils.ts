import { fetchSheetData } from '../utils/googleSheets';

const formatImageUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  
  // Převede klasický odkaz z Google Disku na přímý odkaz pro obrázek
  const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Využíváme novější lh3.googleusercontent.com formát, který spolehlivě funguje v <img> tazích bez blokování
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  
  return url;
};

export interface BobrikData {
  Jméno: string;
  Popis: string;
  Fotka?: string;
  [key: string]: string | undefined;
}

export interface PlayerProfile {
  name: string;
  description: string;
  photoUrl: string | null;
  completedBadges: string[];
  currentTasks: string[];
  totalCompleted: number;
  rank?: number;
}

export interface BadgeDetail {
  name: string;
  story: string;
  task: string;
}

const BOBRICI_PLAYERS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=1725078774&single=true&output=csv';
const BOBRICI_UKOLY_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQntCMPoKCiaMzKn0L1XvfK8LvqlG4pMrUFGvjPRacX7YozNaOJvlomX0hQNajBZCGqC2fo15q1nIkD/pub?gid=669033936&single=true&output=csv';

export const getBobriciData = async () => {
  const [rawPlayers, rawUkoly] = await Promise.all([
    fetchSheetData<BobrikData>(BOBRICI_PLAYERS_URL),
    fetchSheetData<any>(BOBRICI_UKOLY_URL)
  ]);
  
  const filteredPlayers = rawPlayers.filter(row => row.Jméno);
  const allKeys = Object.keys(filteredPlayers[0] || {});
  const badgeNames = allKeys.filter(key => key !== 'Jméno' && key !== 'Popis' && key !== 'Fotka');

  const badgeDetails: BadgeDetail[] = rawUkoly
    .filter((row: any) => row.Název)
    .map((row: any) => ({
      name: row.Název,
      story: row.Příběh || '',
      task: row.Úkol || ''
    }));

  const players: PlayerProfile[] = filteredPlayers.map(row => {
    const completedBadges: string[] = [];
    const currentTasks: string[] = [];

    badgeNames.forEach(badge => {
      const status = row[badge]?.toUpperCase().trim();
      if (status === 'DONE' || status === 'ANO' || status === 'TRUE') {
        completedBadges.push(badge);
      } else if (status === 'WORKING') {
        currentTasks.push(badge);
      }
    });

    return {
      name: row.Jméno,
      description: row.Popis || '',
      photoUrl: formatImageUrl(row.Fotka),
      completedBadges,
      currentTasks,
      totalCompleted: completedBadges.length
    };
  });

  const sortedForRank = [...players].sort((a, b) => b.totalCompleted - a.totalCompleted);
  players.forEach(p => {
    p.rank = sortedForRank.findIndex(s => s.name === p.name) + 1;
  });

  return {
    players,
    badgeNames,
    badgeDetails
  };
};
