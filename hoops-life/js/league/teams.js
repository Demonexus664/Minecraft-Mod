// The 30 NBA franchises. Logos load at runtime from ESPN's CDN (not stored in the repo).
window.HL = window.HL || {};

HL.TEAMS = [
  // abbr, espn code, city, name, conf, div, primary, secondary, arena
  ['ATL', 'atl', 'Atlanta', 'Hawks', 'East', 'Southeast', '#E03A3E', '#C1D32F', 'State Farm Arena'],
  ['BOS', 'bos', 'Boston', 'Celtics', 'East', 'Atlantic', '#007A33', '#BA9653', 'TD Garden'],
  ['BKN', 'bkn', 'Brooklyn', 'Nets', 'East', 'Atlantic', '#2b2b2b', '#FFFFFF', 'Barclays Center'],
  ['CHA', 'cha', 'Charlotte', 'Hornets', 'East', 'Southeast', '#1D1160', '#00788C', 'Spectrum Center'],
  ['CHI', 'chi', 'Chicago', 'Bulls', 'East', 'Central', '#CE1141', '#000000', 'United Center'],
  ['CLE', 'cle', 'Cleveland', 'Cavaliers', 'East', 'Central', '#860038', '#FDBB30', 'Rocket Arena'],
  ['DAL', 'dal', 'Dallas', 'Mavericks', 'West', 'Southwest', '#00538C', '#B8C4CA', 'American Airlines Center'],
  ['DEN', 'den', 'Denver', 'Nuggets', 'West', 'Northwest', '#0E2240', '#FEC524', 'Ball Arena'],
  ['DET', 'det', 'Detroit', 'Pistons', 'East', 'Central', '#C8102E', '#1D42BA', 'Little Caesars Arena'],
  ['GSW', 'gs', 'Golden State', 'Warriors', 'West', 'Pacific', '#1D428A', '#FFC72C', 'Chase Center'],
  ['HOU', 'hou', 'Houston', 'Rockets', 'West', 'Southwest', '#CE1141', '#C4CED4', 'Toyota Center'],
  ['IND', 'ind', 'Indiana', 'Pacers', 'East', 'Central', '#002D62', '#FDBB30', 'Gainbridge Fieldhouse'],
  ['LAC', 'lac', 'LA', 'Clippers', 'West', 'Pacific', '#C8102E', '#1D428A', 'Intuit Dome'],
  ['LAL', 'lal', 'Los Angeles', 'Lakers', 'West', 'Pacific', '#552583', '#FDB927', 'Crypto.com Arena'],
  ['MEM', 'mem', 'Memphis', 'Grizzlies', 'West', 'Southwest', '#5D76A9', '#12173F', 'FedExForum'],
  ['MIA', 'mia', 'Miami', 'Heat', 'East', 'Southeast', '#98002E', '#F9A01B', 'Kaseya Center'],
  ['MIL', 'mil', 'Milwaukee', 'Bucks', 'East', 'Central', '#00471B', '#EEE1C6', 'Fiserv Forum'],
  ['MIN', 'min', 'Minnesota', 'Timberwolves', 'West', 'Northwest', '#0C2340', '#78BE20', 'Target Center'],
  ['NOP', 'no', 'New Orleans', 'Pelicans', 'West', 'Southwest', '#0C2340', '#C8102E', 'Smoothie King Center'],
  ['NYK', 'ny', 'New York', 'Knicks', 'East', 'Atlantic', '#006BB6', '#F58426', 'Madison Square Garden'],
  ['OKC', 'okc', 'Oklahoma City', 'Thunder', 'West', 'Northwest', '#007AC1', '#EF3B24', 'Paycom Center'],
  ['ORL', 'orl', 'Orlando', 'Magic', 'East', 'Southeast', '#0077C0', '#C4CED4', 'Kia Center'],
  ['PHI', 'phi', 'Philadelphia', '76ers', 'East', 'Atlantic', '#006BB6', '#ED174C', 'Wells Fargo Center'],
  ['PHX', 'phx', 'Phoenix', 'Suns', 'West', 'Pacific', '#1D1160', '#E56020', 'Footprint Center'],
  ['POR', 'por', 'Portland', 'Trail Blazers', 'West', 'Northwest', '#E03A3E', '#000000', 'Moda Center'],
  ['SAC', 'sac', 'Sacramento', 'Kings', 'West', 'Pacific', '#5A2D81', '#63727A', 'Golden 1 Center'],
  ['SAS', 'sa', 'San Antonio', 'Spurs', 'West', 'Southwest', '#000000', '#C4CED4', 'Frost Bank Center'],
  ['TOR', 'tor', 'Toronto', 'Raptors', 'East', 'Atlantic', '#CE1141', '#000000', 'Scotiabank Arena'],
  ['UTA', 'utah', 'Utah', 'Jazz', 'West', 'Northwest', '#002B5C', '#F9A01B', 'Delta Center'],
  ['WAS', 'wsh', 'Washington', 'Wizards', 'East', 'Southeast', '#002B5C', '#E31837', 'Capital One Arena'],
].map((t, i) => ({
  id: i, abbr: t[0], espn: t[1], city: t[2], name: t[3], conf: t[4], div: t[5],
  color: t[6], color2: t[7], arena: t[8],
  // Market size drives revenue, hype and free-agent appeal later on.
  market: ({ NYK: 10, LAL: 10, GSW: 9, LAC: 8, CHI: 9, BOS: 8, BKN: 8, MIA: 8, PHI: 7, DAL: 7, HOU: 7, TOR: 7, PHX: 6, ATL: 6, WAS: 6, DEN: 5, POR: 4, SAC: 4, MIN: 5, CLE: 4, DET: 5, ORL: 5, CHA: 4, IND: 4, MIL: 4, OKC: 3, SAS: 4, MEM: 3, NOP: 3, UTA: 3 })[t[0]],
}));

HL.teamLogoUrl = (team) => team.espn ? `https://a.espncdn.com/i/teamlogos/nba/500/${team.espn}.png` : null;
HL.teamFull = (team) => `${team.city} ${team.name}`;
