// Real jersey numbers for well-known players: name -> number, or [[fromSeason, number], ...] when it changed.
// (Not in the stats dataset; everyone else gets a stable generated number. Editable in-game later.)
window.HL = window.HL || {};
HL.JERSEY_NUMBERS = {
  'Michael Jordan': [[1984, 23], [1994, 45], [1995, 23]], 'LeBron James': [[2003, 23], [2010, 6], [2014, 23], [2021, 6], [2023, 23]],
  'Kobe Bryant': [[1996, 8], [2006, 24]], 'Stephen Curry': 30, 'Kevin Durant': [[2007, 35], [2019, 7], [2023, 35]], 'Nikola Jokić': 15,
  'Giannis Antetokounmpo': 34, 'Shai Gilgeous-Alexander': 2, 'Luka Dončić': 77, 'Victor Wembanyama': 1, 'Jayson Tatum': 0, 'Jaylen Brown': 7,
  'Anthony Edwards': 5, 'Jalen Brunson': 11, 'Devin Booker': 1, 'Donovan Mitchell': 45, 'Tyrese Haliburton': 0, 'Joel Embiid': 21,
  'Kawhi Leonard': 2, 'James Harden': [[2009, 13], [2021, 13], [2022, 1]], 'Russell Westbrook': 0, 'Chris Paul': 3, 'Anthony Davis': 3,
  'Damian Lillard': 0, 'Kyrie Irving': [[2011, 2], [2017, 11]], 'Jimmy Butler III': 22, 'Paul George': [[2010, 24], [2014, 13]], 'Zion Williamson': 1,
  'Ja Morant': 12, 'Trae Young': 11, 'Cade Cunningham': 2, 'Paolo Banchero': 5, 'Tyrese Maxey': 0, 'Karl-Anthony Towns': 32,
  'Bam Adebayo': 13, 'Domantas Sabonis': 11, 'De\'Aaron Fox': 5, 'Jamal Murray': 27, 'Pascal Siakam': 43, 'Cooper Flagg': 32,
  'Larry Bird': 33, 'Magic Johnson': 32, 'Kareem Abdul-Jabbar': 33, 'Bill Russell': 6, 'Wilt Chamberlain': 13, 'Shaquille O\'Neal': [[1992, 32], [1996, 34], [2004, 32]],
  'Tim Duncan': 21, 'Dirk Nowitzki': 41, 'Kevin Garnett': [[1995, 21], [2007, 5], [2013, 2], [2015, 21]], 'Paul Pierce': 34, 'Steve Nash': 13,
  'Jason Kidd': [[1994, 5], [2001, 5]], 'John Stockton': 12, 'Karl Malone': 32, 'Hakeem Olajuwon': 34, 'David Robinson': 50, 'Patrick Ewing': 33,
  'Charles Barkley': 34, 'Scottie Pippen': 33, 'Dennis Rodman': [[1986, 10], [1993, 10], [1995, 91]], 'Isiah Thomas': 11, 'Julius Erving': 6,
  'Jerry West': 44, 'Oscar Robertson': [[1960, 14], [1970, 1]], 'Elgin Baylor': 22, 'Bob Cousy': 14, 'John Havlicek': 17, 'Moses Malone': [[1976, 24], [1982, 2]],
  'Allen Iverson': 3, 'Dwyane Wade': 3, 'Carmelo Anthony': [[2003, 15], [2011, 7]], 'Tracy McGrady': 1, 'Vince Carter': 15, 'Ray Allen': [[1996, 34], [2007, 20]],
  'Reggie Miller': 31, 'Gary Payton': 20, 'Clyde Drexler': 22, 'Dominique Wilkins': 21, 'Kevin McHale': 32, 'Dwight Howard': 12, 'Pau Gasol': 16,
  'Manu Ginóbili': 20, 'Tony Parker': 9, 'Chris Webber': 4, 'Yao Ming': 11, 'Klay Thompson': 11, 'Draymond Green': 23, 'Kyle Lowry': 7,
  'Derrick Rose': 1, 'Blake Griffin': 32, 'Alonzo Mourning': 33, 'Grant Hill': 33, 'Penny Hardaway': 1, 'Anfernee Hardaway': 1,
  'Bob Pettit': 9, 'George Mikan': 99, 'Walt Frazier': 10, 'Willis Reed': 19, 'Earl Monroe': 15, 'Pete Maravich': 7, 'George Gervin': 44,
  'Rick Barry': 24, 'Dave Cowens': 18, 'Bill Walton': 32, 'Bob McAdoo': 11, 'Elvin Hayes': 11, 'Wes Unseld': 41, 'Nate Thurmond': 42,
  'Sam Jones': 24, 'Hal Greer': 15, 'Dolph Schayes': 4, 'James Worthy': 42, 'Dennis Johnson': 3, 'Robert Parish': '00', 'Adrian Dantley': 4,
  'Bernard King': 30, 'Alex English': 2, 'Tim Hardaway': 10, 'Chris Mullin': 17, 'Mitch Richmond': 2, 'Kevin Johnson': 7, 'Tom Chambers': 24,
  'Nikola Vučević': 9, 'Rudy Gobert': 27, 'Lauri Markkanen': 23, 'Kristaps Porziņģis': 8, 'Jrue Holiday': [[2009, 11], [2013, 11], [2020, 21], [2023, 4], [2025, 5]],
};
HL.jerseyFor = function (p, season) {
  const v = HL.JERSEY_NUMBERS[p.name];
  if (v == null) return null;
  if (typeof v === 'number') return v;
  let n = v[0][1];
  for (const [from, num] of v) if ((season || 9999) >= from) n = num;
  return n;
};
