import Database from 'better-sqlite3';

const db = new Database('football.db');

// Ensure schema is up to date
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position TEXT NOT NULL CHECK(position IN ('Linha', 'Goleiro'))
  );

  CREATE TABLE IF NOT EXISTS rounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS performances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    round_id INTEGER NOT NULL,
    goals INTEGER DEFAULT 0,
    yellow_cards INTEGER DEFAULT 0,
    goals_conceded INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    red_cards INTEGER DEFAULT 0,
    attendance INTEGER DEFAULT 0,
    repechage INTEGER DEFAULT 0,
    extra_points INTEGER DEFAULT 0,
    lost_points INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (round_id) REFERENCES rounds(id),
    UNIQUE(player_id, round_id)
  );
`);

const playersData = [
  { name: "ADRIANO DENIS", r1: 11, r2: 6, pe: 5, v: 2 },
  { name: "WISLEI", r1: 10, r2: 6, pe: 4, v: 2 },
  { name: "RENE", r1: 12, r2: 3, pe: 7, v: 1, e: 1 },
  { name: "BILL", r1: 9, r2: 6, pe: 6, v: 1, e: 1 },
  { name: "ORESTES", r1: 12, r2: 2, pe: 6, v: 1, e: 1 },
  { name: "LEANDRO", r1: 8, r2: 6, pe: 5, v: 1, e: 1 },
  { name: "GODOLFINO", r1: 11, r2: 2, pe: 5, v: 1, e: 1 },
  { name: "ALVARO", r1: 7, r2: 6, pe: 4, v: 1, e: 1 },
  { name: "GABRIEL VAZ", r1: 7, r2: 6, pe: 4, v: 1, e: 1 },
  { name: "JAIME", r1: 7, r2: 6, pe: 4, v: 1, e: 1 },
  { name: "WANDER", r1: 7, r2: 6, pe: 4, v: 1, e: 1 },
  { name: "GAVILAN", r1: 7, r2: 6, pe: 1, v: 2 },
  { name: "NILSON", r1: 6, r2: 6, pe: 6, v: 1 },
  { name: "JOÃO GUILHERME", r1: 6, r2: 6, v: 2 },
  { name: "HENRIQUE", r1: 9, r2: 2, pe: 6, d: 2 },
  { name: "DYEGO", r1: 9, r2: 2, pe: 3, v: 1, e: 1 },
  { name: "ALEXANDRE OLIVOTO", r1: 7, r2: 2, pe: 3, pp: 2, v: 1, e: 1, am: 1 },
  { name: "JESSE", r1: 7, r2: 2, pe: 4, e: 1, d: 1 },
  { name: "NYKOLAS", r1: 3, r2: 6, pe: 3, v: 1 },
  { name: "CLODOALDO", r1: 7, r2: 2, pe: 1, v: 1, e: 1 },
  { name: "RANGEL", r1: 7, r2: 2, pe: 1, v: 1, d: 2 },
  { name: "HELTON", r1: 3, r2: 6, pe: 1, v: 1, e: 1 },
  { name: "EVERTON SIQUEIRA", r1: 3, r2: 6, v: 1, e: 1 },
  { name: "CLAUDIO", r1: 6, r2: 2, pe: 4, d: 2 },
  { name: "LEANDRO FONSECA", r1: 8, r2: 0, pe: 2, v: 1 },
  { name: "DEYVID", r1: 2, r2: 6, v: 1, e: 1 },
  { name: "JEFERSON", r1: 2, r2: 6, v: 1, e: 1 },
  { name: "GABRIEL SICRED", r1: 2, r2: 6, v: 1, e: 1 },
  { name: "WELLINTON BRUNO", r1: 2, r2: 6, v: 1, e: 1 },
  { name: "FABIO ARUTH", r1: 5, r2: 2, pe: 2, e: 1, d: 1 },
  { name: "JOÃO HENRIQUE", r1: 1, r2: 6, pe: 1, v: 1 },
  { name: "LEO", r1: 1, r2: 6, pe: 1, v: 1 },
  { name: "NELSON", r1: 7, r2: 0, pe: 1, v: 1 },
  { name: "CLEMENTINO", r1: 6, r2: 0, pe: 6 },
  { name: "EDSON", r1: 6, r2: 0, pe: 6 },
  { name: "EVERTON ROSSI", r1: 6, r2: 0, pe: 4, e: 1 },
  { name: "CLAUBER", r1: 6, r2: 0, v: 1 },
  { name: "DIEGO BOTTEGA", r1: 6, r2: 0, v: 1 },
  { name: "MARCIO", r1: 6, r2: 0, v: 1 },
  { name: "RENATO PEREIRA", r1: 0, r2: 6, v: 1 },
  { name: "MELARA", r1: 3, r2: 3, pe: 1, e: 1, d: 1 },
  { name: "FABIO SICRED", r1: 6, r2: 0, v: 1 },
  { name: "THIAGO DIB", r1: 0, r2: 6, v: 1 },
  { name: "FABIO RODRIGO", r1: 0, r2: 6, v: 1 },
  { name: "VITOR SICRED", r1: 0, r2: 6, v: 1 },
  { name: "EVANDRO", r1: 0, r2: 6, v: 1 },
  { name: "EDILSON CRISTIANO", r1: 3, r2: 2, pe: 3, pp: 4, v: 1, ve: 1 },
  { name: "RAFAEL MIOLA", r1: 3, r2: 2, pe: 3, pp: 2, d: 2, am: 1 },
  { name: "PETERSON", r1: 5, r2: 0, pe: 5 },
  { name: "HUGO", r1: 5, r2: 0, pe: 5 },
  { name: "GENILDO", r1: 5, r2: 0, pe: 3, v: 1 },
  { name: "GABRIEL DE SÁ", r1: 3, r2: 2, pe: 3, v: 1 },
  { name: "FERNANDO SANTISTA", r1: 5, r2: 0, pe: 3, v: 1 },
  { name: "HILARIO", r1: 3, r2: 2, pe: 3, v: 1 },
  { name: "ROBINHO CAIXA", r1: 3, r2: 2, e: 1, d: 1 },
  { name: "YURI", r1: 3, r2: 2, e: 1, d: 1 },
  { name: "ELINEI", r1: 4, r2: 0, pe: 4 },
  { name: "IAN", r1: 4, r2: 0, pe: 2, v: 1 },
  { name: "PATRICK", r1: 4, r2: 0, pe: 2, v: 1 },
  { name: "JHONATA", r1: 2, r2: 2, d: 2 },
  { name: "PEDRO HENRIQUE", r1: 2, r2: 2, d: 2 },
  { name: "BRUNO YURI", r1: 1, r2: 2, pe: 0, pp: 2, e: 1, d: 1, am: 1 },
  { name: "EDNALDO", r1: 3, r2: 0, pe: 3 },
  { name: "EDVALDO", r1: 3, r2: 0, pe: 3 },
  { name: "PAULO AURELIO", r1: 3, r2: 0, pe: 3 },
  { name: "DANILO BB", r1: 3, r2: 0, pe: 3 },
  { name: "MAILSON", r1: 3, r2: 0, pe: 3 },
  { name: "FELIPE BABA", r1: 1, r2: 2, pe: 1, v: 1, e: 1 },
  { name: "GABRIEL VALIAT", r1: 3, r2: 0, pe: 1, v: 1 },
  { name: "ALAN", r1: 2, r2: 0, pe: 2 },
  { name: "JEAN OLIVEIRA", r1: 2, r2: 0, pe: 2 },
  { name: "JOÃO VITOR", r1: 2, r2: 0, pe: 2 },
  { name: "PEDRO LUIZ", r1: 2, r2: 0, v: 1 },
  { name: "AJALA", r1: 2, r2: 0, v: 1 },
  { name: "WAGNER BORGO", r1: 2, r2: 0, v: 1 },
  { name: "RAFAEL RICARDO", r1: 0, r2: 2 },
  { name: "RAFAEL CAMPESTRINI", r1: 0, r2: 2, pe: 1, v: 1 },
  { name: "RENAN", r1: 0, r2: 2, pe: 1, v: 1 },
  { name: "BRUNO DE PAULA", r1: 1, r2: 0, pe: 1 },
  { name: "DUNGA", r1: 1, r2: 0, pe: 1 },
  { name: "FABIO COELHO", r1: 1, r2: 0, pe: 1 },
  { name: "IGOR", r1: 1, r2: 0, pe: 1 },
  { name: "MATHEUS HENRIQUE", r1: 1, r2: 0, pe: 1 },
  { name: "MAYCK", r1: 1, r2: 0, pe: 1 },
  { name: "PEDRO HENRIQUE PP", r1: 1, r2: 0, pe: 1 },
  { name: "RENATO OLIVEIRA", r1: 1, r2: 0, pe: 1 },
  { name: "VINICIUS", r1: 1, r2: 0, pe: 1 },
  { name: "ELITO", r1: 1, r2: 0, pe: 1 },
  { name: "GUSTAVO MERC.", r1: 1, r2: 0, pe: 1 },
  { name: "JADIR", r1: 1, r2: 0, pe: 1 },
  { name: "ANTHONI", r1: 1, r2: 0, pe: 1 },
  { name: "LEONARDO", r1: 0, r2: 0, pp: 2, v: 1, am: 1 },
  { name: "MARCIO", r1: 0, r2: 0, pp: 2, v: 1, am: 1 }
];

const goalkeepersData = [
  { name: "AFONSO", r1: 12, r2: 7, pe: 7, v: 2 },
  { name: "EDMUNDO", r1: 3, r2: 7, pe: 2, v: 1, e: 1 },
  { name: "EDILSON", r1: 8, r2: 2, pe: 5, e: 1, d: 1 },
  { name: "FELIPE", r1: 6, r2: 0, v: 1 },
  { name: "JOSE", r1: 0, r2: 6, v: 1 },
  { name: "ZE LUIZ", r1: 3, r2: 2, pe: 1, d: 2 },
  { name: "CARLOS EDUARDO", r1: 3, r2: 2, e: 1, d: 1 }
];

// Artilheiros (Goals) - Mapping to players
// Note: We don't know which round the goals were scored in, so we'll add them to Round 2 for now,
// or split them. Let's add them to Round 1 to be safe, or check if they played.
// Actually, let's just add them to Round 1 for simplicity so they show up in the leaderboard.
const goalsData: Record<string, number> = {
  "CLODOALDO": 5,
  "JOÃO GUILHERME": 5,
  "RENE": 4,
  "JHONATA": 4,
  "DEYVID": 2,
  "CLAUDIO": 2,
  "WISLEY": 2, // Note spelling difference: WISLEI vs WISLEY. I'll map WISLEY to WISLEI.
  "VALIAT": 2, // GABRIEL VALIAT
  "DIB": 2, // THIAGO DIB
  "BILL": 2,
  "WELLINTON BRUNO": 2,
  "GABRIEL SICRED": 2,
  "IAN": 1,
  "MELARA": 1,
  "ALVARO": 1,
  "PEDRO HENRIQUE": 1,
  "NYKOLAS": 1,
  "NILSON": 1,
  "FELIPE BABA": 1,
  "EVERTON SIQUEIRA": 1,
  "JOÃO HENRIQUE": 1,
  "GABRIEL DE SÁ": 1,
  "RENAN": 1,
  "LEO": 1,
  "ADRIANO DENIS": 1
};

const nameMapping: Record<string, string> = {
  "WISLEY": "WISLEI",
  "VALIAT": "GABRIEL VALIAT",
  "DIB": "THIAGO DIB"
};

// Goleiros (Goals Conceded) - Mapping to goalkeepers
// Again, adding to Round 1 for simplicity.
const goalsConcededData: Record<string, number> = {
  "FELIPE": 2,
  "AFONSO": 4,
  "EDMUNDO": 5,
  "EDILSON": 6,
  "CARLOS EDUARDO": 6,
  "ZE LUIZ": 12,
  "JOSE": 6
};

function seed() {
  console.log("Seeding database...");
  
  // Create Rounds 1 to 8
  const roundsStmt = db.prepare('INSERT OR IGNORE INTO rounds (id, name) VALUES (?, ?)');
  for (let i = 1; i <= 8; i++) {
    roundsStmt.run(i, `Rodada ${i}`);
  }

  // Insert Players
  const insertPlayer = db.prepare('INSERT INTO players (name, position) VALUES (?, ?)');
  const getPlayer = db.prepare('SELECT id FROM players WHERE name = ?');
  
  // Insert Performance
  const insertPerf = db.prepare(`
    INSERT INTO performances (player_id, round_id, points, goals, yellow_cards, goals_conceded, wins, draws, losses, red_cards, attendance, repechage, extra_points, lost_points)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(player_id, round_id) DO UPDATE SET
    points = excluded.points,
    goals = excluded.goals,
    yellow_cards = excluded.yellow_cards,
    goals_conceded = excluded.goals_conceded,
    wins = excluded.wins,
    draws = excluded.draws,
    losses = excluded.losses,
    red_cards = excluded.red_cards,
    attendance = excluded.attendance,
    repechage = excluded.repechage,
    extra_points = excluded.extra_points,
    lost_points = excluded.lost_points
  `);

  db.transaction(() => {
    // Process Linha Players
    for (const p of playersData as any[]) {
      let player = getPlayer.get(p.name) as { id: number } | undefined;
      if (!player) {
        const info = insertPlayer.run(p.name, 'Linha');
        player = { id: Number(info.lastInsertRowid) };
      }

      // Round 1
      let goals = 0;
      if (goalsData[p.name]) {
        goals = goalsData[p.name];
        delete goalsData[p.name];
      } else {
        for (const [key, val] of Object.entries(nameMapping)) {
           if (val === p.name && goalsData[key]) {
             goals = goalsData[key];
             delete goalsData[key];
             break;
           }
        }
      }

      const basePointsR1 = p.r1 - (p.pe || 0) + (p.pp || 0);
      insertPerf.run(player.id, 1, basePointsR1, goals, p.am || 0, 0, p.v || 0, p.e || 0, p.d || 0, p.ve || 0, 0, 0, p.pe || 0, p.pp || 0);
      
      // Round 2
      const basePointsR2 = p.r2;
      insertPerf.run(player.id, 2, basePointsR2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }

    // Process Goalkeepers
    for (const p of goalkeepersData as any[]) {
      let player = getPlayer.get(p.name) as { id: number } | undefined;
      if (!player) {
        const info = insertPlayer.run(p.name, 'Goleiro');
        player = { id: Number(info.lastInsertRowid) };
      }

      // Round 1
      let conceded = 0;
      if (goalsConcededData[p.name]) {
        conceded = goalsConcededData[p.name];
      }
      
      const basePointsR1 = p.r1 - (p.pe || 0) + (p.pp || 0);
      insertPerf.run(player.id, 1, basePointsR1, 0, p.am || 0, conceded, p.v || 0, p.e || 0, p.d || 0, p.ve || 0, 0, 0, p.pe || 0, p.pp || 0);
      
      const basePointsR2 = p.r2;
      insertPerf.run(player.id, 2, basePointsR2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
  })();

  console.log("Seeding complete.");
}

seed();
