import Database from 'better-sqlite3';

const db = new Database('football.db');

const extraStats = [
  { name: "ADRIANO DENIS", pe: 5 },
  { name: "WISLEI", pe: 4 },
  { name: "RENE", pe: 7 },
  { name: "BILL", pe: 6 },
  { name: "ORESTES", pe: 6 },
  { name: "LEANDRO", pe: 5 },
  { name: "GODOLFINO", pe: 5 },
  { name: "ALVARO", pe: 4 },
  { name: "GABRIEL VAZ", pe: 4 },
  { name: "JAIME", pe: 4 },
  { name: "WANDER", pe: 4 },
  { name: "GAVILAN", pe: 1 },
  { name: "NILSON", pe: 6 },
  { name: "HENRIQUE", pe: 6 },
  { name: "DYEGO", pe: 3 },
  { name: "ALEXANDRE OLIVOTO", am: 1, pe: 3, pp: 2 },
  { name: "JESSE", pe: 4 },
  { name: "NYKOLAS", pe: 3 },
  { name: "CLODOALDO", pe: 1 },
  { name: "RANGEL", pe: 1 },
  { name: "HELTON", pe: 1 },
  { name: "CLAUDIO", pe: 4 },
  { name: "LEANDRO FONSECA", pe: 2 },
  { name: "EDILSON CRISTIANO", ve: 1, pe: 3, pp: 4 },
  { name: "RAFAEL MIOLA", am: 1, pe: 3, pp: 2 },
  { name: "PETERSON", pe: 5 },
  { name: "HUGO", pe: 5 },
  { name: "GENILDO", pe: 3 },
  { name: "GABRIEL DE SÁ", pe: 3 },
  { name: "FERNANDO SANTISTA", pe: 3 },
  { name: "HILARIO", pe: 3 },
  { name: "ELINEI", pe: 4 },
  { name: "IAN", pe: 2 },
  { name: "PATRICK", pe: 2 },
  { name: "BRUNO YURI", am: 1, pp: 2 },
  { name: "EDNALDO", pe: 3 },
  { name: "EDVALDO", pe: 3 },
  { name: "PAULO AURELIO", pe: 3 },
  { name: "DANILO BB", pe: 3 },
  { name: "MAILSON", pe: 3 },
  { name: "FELIPE BABA", pe: 1 },
  { name: "GABRIEL VALIAT", pe: 1 },
  { name: "ALAN", pe: 2 },
  { name: "JEAN OLIVEIRA", pe: 2 },
  { name: "JOÃO VITOR", pe: 2 },
  { name: "BRUNO DE PAULA", pe: 1 },
  { name: "DUNGA", pe: 1 },
  { name: "FABIO COELHO", pe: 1 },
  { name: "IGOR", pe: 1 },
  { name: "MATHEUS HENRIQUE", pe: 1 },
  { name: "MAYCK", pe: 1 },
  { name: "PEDRO HENRIQUE PP", pe: 1 },
  { name: "RENATO OLIVEIRA", pe: 1 },
  { name: "VINICIUS", pe: 1 },
  { name: "ELITO", pe: 1 },
  { name: "GUSTAVO MERC.", pe: 1 },
  { name: "JADIR", pe: 1 },
  { name: "ANTHONI", pe: 1 },
  { name: "LEONARDO", am: 1, pp: 2 },
  { name: "MARCIO", am: 1, pp: 2 }, // This will be the second Marcio
  // Goleiros
  { name: "AFONSO", pe: 7 },
  { name: "EDMUNDO", pe: 2 },
  { name: "EDILSON", pe: 5 },
  { name: "ZE LUIZ", pe: 1 }
];

function updateExtraStats() {
  console.log("Updating extra stats (AM, VE, PE, PP)...");
  
  const getPlayer = db.prepare('SELECT id FROM players WHERE name = ? ORDER BY id ASC');
  const updatePerf = db.prepare(`
    UPDATE performances 
    SET yellow_cards = yellow_cards + ?, red_cards = red_cards + ?, extra_points = ?, lost_points = ?
    WHERE player_id = ? AND round_id = 2
  `);
  const insertPerf = db.prepare(`
    INSERT INTO performances (player_id, round_id, yellow_cards, red_cards, extra_points, lost_points)
    VALUES (?, 2, ?, ?, ?, ?)
  `);

  const nameCounts: Record<string, number> = {};

  for (const s of extraStats) {
    // Special handling for Marcio - the one with stats is the second one in the list (index 97 in image)
    // In our DB, we have two Marcios.
    let targetIndex = 0;
    if (s.name === "MARCIO" && s.am) {
        targetIndex = 1; // The second Marcio
    }

    const players = getPlayer.all(s.name) as { id: number }[];
    
    if (players.length === 0) {
      console.log(`Player not found: ${s.name}`);
      continue;
    }

    if (targetIndex >= players.length) {
        console.log(`Target index ${targetIndex} for ${s.name} out of bounds. Using last available.`);
        targetIndex = players.length - 1;
    }

    const playerId = players[targetIndex].id;
    
    const am = s.am || 0;
    const ve = s.ve || 0;
    const pe = s.pe || 0;
    const pp = s.pp || 0;

    // Update Round 2 performance
    const result = updatePerf.run(am, ve, pe, pp, playerId);
    
    if (result.changes === 0) {
      insertPerf.run(playerId, am, ve, pe, pp);
    }
  }

  console.log("Extra stats update complete.");
}

updateExtraStats();
