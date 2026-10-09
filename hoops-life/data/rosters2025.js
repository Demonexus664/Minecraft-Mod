// Real NBA rosters, 2025-26 opening night (approximate; editable in-game).
// Format per line: Name | Pos | Age | Height(in) | OVR | Archetype | Salary $M (optional) | Games out injured (optional)
// Archetypes: scorer, sniper, slasher, playmaker, 3d, twoway, defguard, pointfwd,
//             rimbig, stretchbig, postbig, defbig, unicorn, pointcenter
window.HL = window.HL || {};

HL.ROSTERS_2025 = {
  ATL: `Trae Young|PG|27|73|87|playmaker+sniper|46.0
Dyson Daniels|SG|22|79|82|defguard|25.0
Jalen Johnson|PF|23|81|85|pointfwd|30.0
Kristaps Porziņģis|C|30|87|82|unicorn|30.7
Onyeka Okongwu|C|24|80|78|defbig|15.0
Zaccharie Risacher|SF|20|80|74|3d|13.1
Nickeil Alexander-Walker|SG|27|77|78|3d|14.1
Luke Kennard|SG|29|77|74|sniper|11.0
Mouhamed Gueye|PF|22|82|70|defbig
Vít Krejčí|SG|25|80|72|3d
Caleb Houstan|SF|22|80|67|sniper
Asa Newell|PF|20|81|68|rimbig
N'Faly Dante|C|24|83|65|rimbig
Keaton Wallace|PG|26|75|65|playmaker`,

  BOS: `Jayson Tatum|SF|27|80|95|scorer+twoway|54.1|70
Jaylen Brown|SG|29|78|88|scorer|53.1
Derrick White|PG|31|76|85|twoway|28.1
Payton Pritchard|PG|27|73|80|sniper|14.1
Anfernee Simons|SG|26|75|80|scorer|27.7
Neemias Queta|C|26|84|74|rimbig
Sam Hauser|SF|27|79|75|sniper|10.0
Josh Minott|PF|23|80|69|3d
Hugo González|SF|19|78|68|3d
Baylor Scheierman|SG|25|78|67|sniper
Luka Garza|C|26|82|68|postbig
Xavier Tillman|C|26|79|67|defbig
Jordan Walsh|SF|21|78|67|3d
Chris Boucher|PF|32|81|70|stretchbig`,

  BKN: `Michael Porter Jr.|SF|27|82|82|scorer|38.3
Cam Thomas|SG|24|75|80|scorer|6.0
Nic Claxton|C|26|83|79|defbig|25.4
Noah Clowney|PF|21|82|72|stretchbig
Terance Mann|SG|28|77|74|twoway|15.5
Day'Ron Sharpe|C|24|81|72|rimbig
Egor Dëmin|PG|19|81|72|playmaker
Ziaire Williams|SF|24|81|72|3d
Drake Powell|SG|20|78|69|3d
Nolan Traore|PG|19|76|67|playmaker
Ben Saraf|PG|19|78|66|playmaker
Danny Wolf|PF|21|83|69|stretchbig
Haywood Highsmith|SF|28|78|71|3d
Jalen Wilson|SF|25|78|67|3d`,

  CHA: `LaMelo Ball|PG|24|79|87|playmaker|37.9
Brandon Miller|SF|23|81|84|scorer|11.4
Miles Bridges|PF|27|79|81|slasher|25.0
Kon Knueppel|SG|20|78|76|sniper
Collin Sexton|SG|26|75|78|scorer|18.9
Grant Williams|PF|26|78|72|3d|13.0
Mason Plumlee|C|35|84|70|rimbig
Moussa Diabaté|C|23|82|72|rimbig
Josh Green|SG|24|78|72|3d
Tidjane Salaün|PF|20|81|67|3d
Ryan Kalkbrenner|C|23|85|70|defbig
Liam McNeeley|SF|19|79|68|sniper
Sion James|SG|22|78|67|3d
Pat Connaughton|SG|32|77|67|3d
Tre Mann|PG|24|75|72|scorer`,

  CHI: `Josh Giddey|PG|23|80|82|playmaker|25.0
Coby White|SG|25|77|81|scorer|12.9
Nikola Vučević|C|35|82|80|postbig|21.5
Matas Buzelis|SF|21|82|77|scorer
Patrick Williams|PF|24|79|73|3d|18.0
Ayo Dosunmu|SG|25|77|75|twoway
Kevin Huerter|SG|27|79|74|sniper|18.0
Tre Jones|PG|25|73|74|playmaker
Isaac Okoro|SF|24|77|73|3d|11.0
Jalen Smith|C|25|82|74|stretchbig
Zach Collins|C|27|83|70|stretchbig
Julian Phillips|SF|22|80|67|3d
Dalen Terry|SG|23|79|65|defguard
Noa Essengue|PF|18|82|67|slasher`,

  CLE: `Donovan Mitchell|SG|29|73|92|scorer|46.4
Darius Garland|PG|25|73|85|playmaker|39.4
Evan Mobley|PF|24|84|88|unicorn|46.4
Jarrett Allen|C|27|83|83|defbig|20.0
De'Andre Hunter|SF|27|80|78|3d|23.3
Max Strus|SF|29|77|76|sniper|15.9
Lonzo Ball|PG|27|78|75|defguard|10.0
Sam Merrill|SG|29|76|72|sniper
Dean Wade|PF|28|81|71|3d
Jaylon Tyson|SG|23|78|70|3d
Larry Nance Jr.|PF|32|80|70|rimbig
Craig Porter Jr.|PG|25|74|68|playmaker
Tyrese Proctor|PG|21|77|66|playmaker
Thomas Bryant|C|28|82|68|stretchbig`,

  DAL: `Anthony Davis|PF|32|82|90|defbig+postbig|54.1
Kyrie Irving|PG|33|74|89|scorer|36.5|55
Cooper Flagg|SF|18|81|80|twoway|14.0
Klay Thompson|SG|35|78|76|sniper|16.7
P.J. Washington|PF|27|79|78|3d|15.0
Daniel Gafford|C|27|82|78|rimbig|14.4
Dereck Lively II|C|21|85|79|defbig
D'Angelo Russell|PG|29|76|77|playmaker
Naji Marshall|SF|27|79|75|twoway
Max Christie|SG|22|77|74|3d
Caleb Martin|SF|30|77|70|3d
Dante Exum|PG|30|77|69|defguard
Brandon Williams|PG|26|74|68|scorer
Dwight Powell|C|34|82|67|rimbig`,

  DEN: `Nikola Jokić|C|30|83|98|pointcenter|55.2
Jamal Murray|PG|28|76|87|scorer|46.4
Aaron Gordon|PF|30|80|81|slasher|22.8
Christian Braun|SG|24|78|80|twoway
Cameron Johnson|SF|29|80|79|sniper|22.5
Jonas Valančiūnas|C|33|83|76|postbig|10.4
Tim Hardaway Jr.|SG|33|77|74|sniper
Bruce Brown|SG|29|76|73|twoway
Peyton Watson|SF|23|80|74|3d
Julian Strawther|SG|23|79|70|sniper
Zeke Nnaji|PF|24|81|68|rimbig
Jalen Pickett|PG|25|76|66|playmaker
DaRon Holmes II|PF|23|81|67|rimbig
Hunter Tyson|SF|25|80|64|sniper`,

  DET: `Cade Cunningham|PG|24|78|91|playmaker+scorer|46.4
Jalen Duren|C|22|82|82|rimbig
Ausar Thompson|SF|22|79|80|twoway
Tobias Harris|PF|33|80|77|scorer|26.6
Duncan Robinson|SF|31|79|75|sniper|16.0
Jaden Ivey|SG|23|76|78|slasher|10.1|15
Isaiah Stewart|C|24|80|76|defbig|15.0
Ronald Holland II|SF|20|79|73|twoway
Caris LeVert|SG|31|78|74|scorer|14.1
Marcus Sasser|PG|25|74|68|scorer
Paul Reed|C|26|81|70|rimbig
Javonte Green|SF|32|76|67|defguard
Chaz Lanier|SG|23|76|66|sniper
Bobi Klintman|SF|22|81|64|3d`,

  GSW: `Stephen Curry|PG|37|74|93|sniper+scorer|59.6
Jimmy Butler III|SF|36|79|86|slasher|54.1
Draymond Green|PF|35|78|80|pointfwd|25.9
Jonathan Kuminga|PF|23|79|78|slasher|22.5
Brandin Podziemski|SG|22|77|78|twoway
Moses Moody|SG|23|77|74|3d|11.6
Buddy Hield|SG|32|76|74|sniper
Al Horford|C|39|81|74|stretchbig
De'Anthony Melton|SG|27|74|73|defguard
Gary Payton II|SG|32|75|70|defguard
Quinten Post|C|25|84|70|stretchbig
Trayce Jackson-Davis|C|25|81|70|rimbig
Gui Santos|SF|23|80|66|3d
Will Richard|SG|22|76|66|3d`,

  HOU: `Kevin Durant|PF|37|83|90|scorer+sniper|54.7
Alperen Sengun|C|23|83|87|pointcenter|33.9
Amen Thompson|SF|22|79|85|twoway|8.9
Fred VanVleet|PG|31|72|80|playmaker|25.0|82
Jabari Smith Jr.|PF|22|83|79|stretchbig|20.0
Tari Eason|PF|24|80|79|twoway
Reed Sheppard|PG|21|74|76|sniper
Steven Adams|C|32|83|75|rimbig|12.6
Clint Capela|C|31|82|74|rimbig
Dorian Finney-Smith|PF|32|79|73|3d|10.9|20
Aaron Holiday|PG|29|72|70|sniper
Josh Okogie|SG|27|76|67|defguard
Jae'Sean Tate|SF|29|76|67|twoway
Jeff Green|PF|39|80|65|3d`,

  IND: `Tyrese Haliburton|PG|25|77|89|playmaker|45.6|82
Pascal Siakam|PF|31|80|86|scorer|45.6
Andrew Nembhard|PG|25|76|79|defguard|18.1
Aaron Nesmith|SF|26|77|77|3d|11.0
Bennedict Mathurin|SG|23|77|79|slasher|9.2
Obi Toppin|PF|27|81|74|slasher|14.5
T.J. McConnell|PG|33|73|75|playmaker|9.3
Jarace Walker|PF|22|80|72|twoway
Ben Sheppard|SG|24|78|69|3d
Isaiah Jackson|C|23|82|70|rimbig
Jay Huff|C|27|85|71|defbig
Johnny Furphy|SF|21|81|66|3d
Tony Bradley|C|27|82|66|rimbig
Kam Jones|PG|23|76|66|scorer`,

  LAC: `Kawhi Leonard|SF|34|79|88|twoway|50.0
James Harden|PG|36|77|87|playmaker+scorer|36.3
Ivica Zubac|C|28|84|84|defbig|18.1
Bradley Beal|SG|32|76|78|scorer|5.4
John Collins|PF|28|81|78|rimbig|26.6
Derrick Jones Jr.|SF|28|78|74|3d|9.5
Kris Dunn|PG|31|75|74|defguard
Brook Lopez|C|37|85|75|stretchbig|9.2
Chris Paul|PG|40|72|73|playmaker
Nicolas Batum|PF|36|80|70|3d
Bogdan Bogdanović|SG|33|77|74|sniper|16.0
Kobe Sanders|SG|23|78|66|playmaker
Jordan Miller|SF|25|79|66|slasher
Kobe Brown|PF|25|79|65|3d`,

  LAL: `Luka Dončić|PG|26|78|96|scorer+playmaker|46.0
LeBron James|SF|40|81|90|pointfwd+slasher|52.6|14
Austin Reaves|SG|27|77|84|scorer|13.9
Deandre Ayton|C|27|83|79|rimbig|8.1
Rui Hachimura|PF|27|80|77|3d|18.3
Marcus Smart|PG|31|75|75|defguard
Jaxson Hayes|C|25|84|71|rimbig
Jake LaRavia|SF|24|80|72|3d
Gabe Vincent|PG|29|75|69|defguard|11.5
Dalton Knecht|SF|24|78|70|sniper
Jarred Vanderbilt|PF|26|80|70|defbig|11.6
Maxi Kleber|PF|33|82|69|stretchbig|11.0
Bronny James|SG|21|74|62|defguard
Adou Thiero|SF|21|79|64|slasher`,

  MEM: `Ja Morant|PG|26|74|87|slasher|39.4
Jaren Jackson Jr.|PF|26|82|86|unicorn|25.0
Zach Edey|C|23|88|76|rimbig|5.8|25
Kentavious Caldwell-Pope|SG|32|77|75|3d|21.6
Santi Aldama|PF|24|84|75|stretchbig|17.7
Jaylen Wells|SF|22|79|74|3d
Ty Jerome|PG|28|77|76|scorer|9.0|30
Scotty Pippen Jr.|PG|25|73|72|defguard|8.0|40
Brandon Clarke|PF|29|80|71|rimbig|12.5
Vince Williams Jr.|SG|25|76|72|3d
GG Jackson|PF|21|81|69|scorer
Cedric Coward|SF|22|78|72|3d
Cam Spencer|SG|25|75|66|sniper
Jock Landale|C|29|83|67|rimbig
John Konchar|SG|29|77|66|defguard`,

  MIA: `Bam Adebayo|C|28|81|86|defbig|37.1
Tyler Herro|SG|25|77|85|scorer|31.0|25
Norman Powell|SG|32|75|81|scorer|20.5
Andrew Wiggins|SF|30|79|78|twoway|28.2
Jaime Jaquez Jr.|SF|24|78|76|slasher
Davion Mitchell|PG|27|72|74|defguard
Kel'el Ware|C|21|84|77|rimbig
Nikola Jović|PF|22|82|72|stretchbig
Terry Rozier|PG|31|73|72|scorer|26.6
Simone Fontecchio|SF|29|79|72|sniper
Pelle Larsson|SG|24|77|69|3d
Kasparas Jakučionis|PG|19|77|67|playmaker
Dru Smith|SG|27|75|66|defguard
Keshad Johnson|PF|24|78|64|slasher`,

  MIL: `Giannis Antetokounmpo|PF|30|83|96|slasher+defbig|54.1
Myles Turner|C|29|83|81|unicorn|27.0
Kyle Kuzma|PF|30|81|76|scorer|22.4
Bobby Portis|PF|30|82|76|stretchbig|13.4
Kevin Porter Jr.|PG|25|76|77|scorer|20
Ryan Rollins|PG|23|75|72|twoway
Gary Trent Jr.|SG|26|77|74|sniper
AJ Green|SG|25|76|71|sniper
Gary Harris|SG|31|76|68|3d
Taurean Prince|SF|31|78|70|3d
Cole Anthony|PG|25|74|71|scorer
Jericho Sims|C|27|82|66|rimbig
Andre Jackson Jr.|SG|24|78|65|defguard
Amir Coffey|SF|28|79|66|3d`,

  MIN: `Anthony Edwards|SG|24|76|93|scorer+slasher|45.6
Julius Randle|PF|30|81|83|scorer|33.3
Rudy Gobert|C|33|85|84|defbig|35.0
Jaden McDaniels|SF|24|81|80|3d|23.0
Naz Reid|C|26|81|79|stretchbig|25.0
Donte DiVincenzo|SG|28|76|77|sniper|11.4
Mike Conley|PG|38|73|72|playmaker|10.8
Rob Dillingham|PG|20|75|69|playmaker
Terrence Shannon Jr.|SG|25|78|69|slasher
Bones Hyland|PG|25|74|69|scorer
Joe Ingles|SF|38|80|65|sniper
Jaylen Clark|SG|24|77|66|defguard
Johnny Juzang|SG|24|79|64|sniper
Joan Beringer|C|18|83|63|defbig`,

  NOP: `Zion Williamson|PF|25|78|85|slasher|39.4
Trey Murphy III|SF|25|80|82|sniper|25.0
Dejounte Murray|PG|29|76|80|playmaker|29.5|50
Jordan Poole|SG|26|76|78|scorer|31.8
Herbert Jones|SF|27|80|79|3d|13.9
Saddiq Bey|SF|26|79|73|3d
Derik Queen|C|20|82|74|postbig
Jeremiah Fears|PG|19|76|74|slasher
Yves Missi|C|21|83|72|rimbig
Kevon Looney|C|29|81|69|rimbig
Jose Alvarado|PG|27|72|72|defguard
Jordan Hawkins|SG|23|77|68|sniper
Karlo Matković|C|24|83|66|rimbig
Micah Peavy|SG|24|79|66|defguard`,

  NYK: `Jalen Brunson|PG|29|74|91|scorer+playmaker|34.9
Karl-Anthony Towns|C|29|84|89|stretchbig|53.1
OG Anunoby|SF|28|79|84|3d|39.6
Mikal Bridges|SF|29|78|83|twoway|24.9
Josh Hart|SG|30|76|81|twoway|19.6
Mitchell Robinson|C|27|84|76|defbig|12.9
Miles McBride|PG|25|74|75|defguard
Jordan Clarkson|SG|33|76|75|scorer
Guerschon Yabusele|PF|29|80|73|stretchbig
Landry Shamet|SG|28|76|68|sniper
Pacôme Dadiet|SF|20|80|63|3d
Tyler Kolek|PG|24|73|64|playmaker
Mohamed Diawara|PF|20|81|63|3d
Ariel Hukporti|C|23|84|64|defbig`,

  OKC: `Shai Gilgeous-Alexander|PG|27|78|97|scorer+slasher|38.3
Jalen Williams|SF|24|78|87|twoway|4.8|10
Chet Holmgren|C|23|85|85|unicorn|13.7
Isaiah Hartenstein|C|27|84|79|rimbig|28.5
Luguentz Dort|SG|26|76|78|3d|17.7
Alex Caruso|SG|31|77|78|defguard|18.1
Cason Wallace|SG|22|76|77|defguard
Aaron Wiggins|SG|26|78|74|3d
Isaiah Joe|SG|26|76|74|sniper
Ajay Mitchell|PG|23|77|73|slasher
Kenrich Williams|SF|30|78|69|twoway
Jaylin Williams|C|23|82|70|stretchbig
Nikola Topić|PG|20|78|66|playmaker
Thomas Sorber|C|19|82|67|defbig|4.0|82`,

  ORL: `Paolo Banchero|PF|22|82|89|scorer|15.3
Franz Wagner|SF|24|82|86|slasher|38.6
Desmond Bane|SG|27|77|84|scorer|36.7
Jalen Suggs|PG|24|76|81|defguard|30.0
Wendell Carter Jr.|C|26|82|77|rimbig|18.1
Tyus Jones|PG|29|72|73|playmaker
Anthony Black|PG|21|79|74|defguard
Jonathan Isaac|PF|28|82|74|defbig|15.0
Goga Bitadze|C|26|83|72|defbig
Tristan da Silva|SF|24|80|70|3d
Moritz Wagner|C|28|83|70|stretchbig|11.0|20
Jett Howard|SF|22|80|64|sniper
Noah Penda|SF|20|79|65|twoway
Jase Richardson|SG|20|75|66|scorer`,

  PHI: `Joel Embiid|C|31|84|90|postbig+scorer|55.0
Tyrese Maxey|PG|24|74|88|scorer|37.9
Paul George|SF|35|80|82|scorer|51.7|10
VJ Edgecombe|SG|20|76|76|slasher
Kelly Oubre Jr.|SF|29|79|77|slasher|8.4
Quentin Grimes|SG|25|77|77|3d|8.7
Andre Drummond|C|32|83|71|rimbig
Jared McCain|PG|21|74|76|sniper|4.2|10
Dominick Barlow|PF|22|81|66|rimbig
Adem Bona|C|22|82|69|defbig
Justin Edwards|SF|21|79|65|3d
Eric Gordon|SG|36|75|67|sniper
Kyle Lowry|PG|39|72|66|playmaker
Trendon Watford|PF|25|81|70|pointfwd`,

  PHX: `Devin Booker|SG|29|77|90|scorer|53.1
Jalen Green|SG|23|76|81|scorer|33.3
Dillon Brooks|SF|29|78|77|3d|21.1
Mark Williams|C|23|87|77|rimbig|6.3
Grayson Allen|SG|30|76|75|sniper|16.9
Royce O'Neale|SF|32|78|73|3d|10.9
Ryan Dunn|SF|22|80|73|3d
Collin Gillespie|PG|26|73|72|sniper
Jordan Goodwin|PG|27|75|69|defguard
Oso Ighodaro|C|23|83|67|rimbig
Nick Richards|C|28|84|69|rimbig
Khaman Maluach|C|19|85|68|defbig
Rasheer Fleming|PF|21|81|66|3d
Nigel Hayes-Davis|PF|31|80|66|stretchbig`,

  POR: `Deni Avdija|SF|24|81|83|pointfwd|14.4
Jrue Holiday|PG|35|76|80|defguard|32.4
Shaedon Sharpe|SG|22|78|79|slasher|8.4
Scoot Henderson|PG|21|75|76|slasher|10.5|35
Donovan Clingan|C|21|86|79|defbig
Jerami Grant|PF|31|80|77|scorer|29.8
Toumani Camara|SF|25|80|77|3d
Robert Williams III|C|28|81|71|defbig|13.3|20
Kris Murray|PF|25|80|69|3d
Matisse Thybulle|SF|28|77|69|defguard|11.0|25
Yang Hansen|C|20|85|66|pointcenter
Damian Lillard|PG|35|74|86|scorer|14.0|82
Caleb Love|SG|24|76|64|scorer
Sidy Cissoko|SF|21|79|65|defguard`,

  SAC: `Domantas Sabonis|C|29|85|87|pointcenter|42.3
Zach LaVine|SG|30|77|84|scorer|47.5
DeMar DeRozan|SF|36|78|82|scorer|25.0
Russell Westbrook|PG|36|75|77|slasher
Dennis Schröder|PG|32|73|75|playmaker|14.1
Malik Monk|SG|27|75|78|scorer|18.8
Keegan Murray|PF|25|80|79|3d|11.1|20
Keon Ellis|SG|25|76|74|defguard
Precious Achiuwa|PF|26|80|69|rimbig
Dario Šarić|PF|31|82|66|stretchbig
Drew Eubanks|C|28|82|65|rimbig
Nique Clifford|SG|23|78|69|3d
Maxime Raynaud|C|22|85|66|stretchbig
Devin Carter|PG|23|74|67|defguard`,

  SAS: `Victor Wembanyama|C|21|88|93|unicorn+defbig|13.3
De'Aaron Fox|PG|27|75|86|slasher|37.0|12
Stephon Castle|SG|20|78|80|slasher
Dylan Harper|PG|19|78|77|slasher|11.0
Devin Vassell|SG|25|77|78|scorer|27.0
Harrison Barnes|SF|33|80|75|3d|19.0
Keldon Johnson|SF|26|77|75|slasher|17.5
Jeremy Sochan|PF|22|80|72|defbig
Julian Champagnie|SF|24|80|74|3d
Luke Kornet|C|30|86|72|defbig
Kelly Olynyk|C|34|83|69|stretchbig|13.4
Bismack Biyombo|C|33|81|65|defbig
Carter Bryant|SF|20|80|66|3d
Lindy Waters III|SG|28|78|64|sniper`,

  TOR: `Scottie Barnes|SF|24|81|87|pointfwd|38.7
Brandon Ingram|SF|28|80|83|scorer|38.0
Immanuel Quickley|PG|26|75|79|scorer|32.5
RJ Barrett|SG|25|78|80|slasher|27.7
Jakob Poeltl|C|30|85|79|defbig|19.5
Gradey Dick|SG|21|80|74|sniper
Ochai Agbaji|SG|25|77|70|3d
Jamal Shead|PG|23|72|71|defguard
Sandro Mamukelashvili|PF|26|81|69|stretchbig
Collin Murray-Boyles|PF|20|79|70|defbig
Ja'Kobe Walter|SG|21|77|67|3d
Jonathan Mogbo|PF|22|80|64|rimbig
Jamison Battle|SF|24|79|63|sniper
Garrett Temple|SG|39|77|60|defguard`,

  UTA: `Lauri Markkanen|PF|28|84|85|stretchbig|46.4
Keyonte George|PG|22|76|79|scorer
Walker Kessler|C|24|85|79|defbig
Jusuf Nurkić|C|31|84|74|postbig|19.4
Ace Bailey|SF|19|82|74|scorer
Isaiah Collier|PG|21|75|72|playmaker
Walter Clayton Jr.|PG|22|74|70|sniper
Brice Sensabaugh|SF|22|78|70|scorer
Kyle Anderson|SF|32|81|69|pointfwd
Kevin Love|PF|37|80|67|stretchbig
Svi Mykhailiuk|SG|28|79|67|sniper
Taylor Hendricks|PF|22|81|67|3d
Kyle Filipowski|C|22|83|69|pointcenter
Cody Williams|SF|21|80|65|3d`,

  WAS: `CJ McCollum|SG|34|75|79|scorer|30.7
Khris Middleton|SF|34|79|74|scorer|33.3
Alex Sarr|C|20|85|77|defbig|11.8
Bilal Coulibaly|SF|21|80|76|3d
Bub Carrington|PG|20|76|71|playmaker
Kyshawn George|SF|22|80|72|3d
Cam Whitmore|SF|21|79|72|slasher
Tre Johnson|SG|19|77|72|sniper
Corey Kispert|SF|26|78|72|sniper|13.9
Marvin Bagley III|PF|26|83|69|rimbig
Malaki Branham|SG|22|77|65|scorer
Will Riley|SF|19|80|65|scorer
Justin Champagnie|SF|24|78|65|3d
Tristan Vukcevic|C|22|84|63|stretchbig`,
};

HL.ROSTER_META = {
  season: 2025,
  label: '2025-26 opening night (approx.)',
};
