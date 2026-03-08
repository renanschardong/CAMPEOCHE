import Database from 'better-sqlite3';

const db = new Database('football.db');

const stats = [
  { name: "ADRIANO DENIS", v: 2, e: 0, d: 0 },
  { name: "WISLEI", v: 2, e: 0, d: 0 },
  { name: "RENE", v: 1, e: 0, d: 1 },
  { name: "BILL", v: 1, e: 1, d: 0 },
  { name: "ORESTES", v: 1, e: 0, d: 1 },
  { name: "LEANDRO", v: 1, e: 1, d: 0 },
  { name: "GODOLFINO", v: 1, e: 0, d: 1 },
  { name: "ALVARO", v: 1, e: 1, d: 0 },
  { name: "GABRIEL VAZ", v: 1, e: 0, d: 1 },
  { name: "JAIME", v: 1, e: 1, d: 0 },
  { name: "WANDER", v: 1, e: 1, d: 0 },
  { name: "GAVILAN", v: 2, e: 0, d: 0 },
  { name: "NILSON", v: 1, e: 0, d: 0 },
  { name: "JOÃO GUILHERME", v: 2, e: 0, d: 0 },
  { name: "HENRIQUE", v: 0, e: 1, d: 2 },
  { name: "DYEGO", v: 1, e: 1, d: 0 },
  { name: "ALEXANDRE OLIVOTO", v: 1, e: 0, d: 1, am: 1 },
  { name: "JESSE", v: 0, e: 1, d: 1 },
  { name: "NYKOLAS", v: 1, e: 0, d: 0 },
  { name: "CLODOALDO", v: 1, e: 0, d: 1 },
  { name: "RANGEL", v: 1, e: 0, d: 2 },
  { name: "HELTON", v: 1, e: 0, d: 1 },
  { name: "EVERTON SIQUEIRA", v: 1, e: 1, d: 0 },
  { name: "CLAUDIO", v: 0, e: 0, d: 2 },
  { name: "LEANDRO FONSECA", v: 1, e: 0, d: 0 },
  { name: "DEYVID", v: 1, e: 0, d: 1 },
  { name: "JEFERSON", v: 1, e: 0, d: 1 },
  { name: "GABRIEL SICRED", v: 1, e: 0, d: 1 },
  { name: "WELLINTON BRUNO", v: 1, e: 0, d: 1 },
  { name: "FABIO ARUTH", v: 0, e: 1, d: 1 },
  { name: "JOÃO HENRIQUE", v: 1, e: 0, d: 0 },
  { name: "LEO", v: 1, e: 0, d: 0 },
  { name: "NELSON", v: 1, e: 0, d: 0 },
  { name: "EVERTON ROSSI", v: 0, e: 0, d: 1 },
  { name: "CLAUBER", v: 1, e: 0, d: 0 },
  { name: "DIEGO BOTTEGA", v: 1, e: 0, d: 0 },
  { name: "MARCIO", v: 1, e: 0, d: 0 }, // First MARCIO
  { name: "RENATO PEREIRA", v: 1, e: 0, d: 0 },
  { name: "MELARA", v: 0, e: 1, d: 1 },
  { name: "FABIO SICRED", v: 1, e: 0, d: 0 },
  { name: "THIAGO DIB", v: 1, e: 0, d: 0 },
  { name: "FABIO RODRIGO", v: 1, e: 0, d: 0 },
  { name: "VITOR SICRED", v: 1, e: 0, d: 0 },
  { name: "EVANDRO", v: 1, e: 0, d: 0 },
  { name: "EDILSON CRISTIANO", v: 1, e: 0, d: 0, am: 2 },
  { name: "RAFAEL MIOLA", v: 0, e: 0, d: 2, am: 1 },
  { name: "GENILDO", v: 0, e: 0, d: 1 },
  { name: "GABRIEL DE SÁ", v: 0, e: 0, d: 1 },
  { name: "FERNANDO SANTISTA", v: 0, e: 0, d: 1 },
  { name: "HILARIO", v: 0, e: 0, d: 1 },
  { name: "ROBINHO CAIXA", v: 1, e: 1, d: 0 },
  { name: "YURI", v: 1, e: 1, d: 0 },
  { name: "IAN", v: 0, e: 0, d: 1 },
  { name: "PATRICK", v: 0, e: 0, d: 1 },
  { name: "JHONATA", v: 0, e: 0, d: 2 },
  { name: "PEDRO HENRIQUE", v: 0, e: 0, d: 2 },
  { name: "BRUNO YURI", v: 1, e: 1, d: 0, am: 1 },
  { name: "FELIPE BABA", v: 0, e: 0, d: 1 },
  { name: "GABRIEL VALIAT", v: 0, e: 0, d: 1 },
  { name: "PEDRO LUIZ", v: 0, e: 0, d: 1 },
  { name: "AJALA", v: 0, e: 0, d: 1 },
  { name: "WAGNER BORGO", v: 0, e: 0, d: 1 },
  { name: "RAFAEL CAMPESTRINI", v: 0, e: 0, d: 1 },
  { name: "RENAN", v: 0, e: 0, d: 1 },
  { name: "LEONARDO", v: 0, e: 0, d: 1, am: 1 },
  { name: "MARCIO", v: 0, e: 0, d: 1, am: 1 }, // Second MARCIO
  // Goleiros
  { name: "AFONSO", v: 2, e: 0, d: 0 },
  { name: "EDMUNDO", v: 1, e: 1, d: 0 },
  { name: "EDILSON", v: 1, e: 1, d: 0 },
  { name: "FELIPE", v: 1, e: 0, d: 0 },
  { name: "JOSE", v: 1, e: 0, d: 0 },
  { name: "ZE LUIZ", v: 0, e: 0, d: 2 },
  { name: "CARLOS EDUARDO", v: 1, e: 1, d: 0 }
];

function updateStats() {
  console.log("Updating stats...");
  
  const getPlayer = db.prepare('SELECT id FROM players WHERE name = ? ORDER BY id ASC');
  const updatePerf = db.prepare(`
    UPDATE performances 
    SET wins = ?, draws = ?, losses = ?, yellow_cards = ?
    WHERE player_id = ? AND round_id = 2
  `);
  const insertPerf = db.prepare(`
    INSERT INTO performances (player_id, round_id, wins, draws, losses, yellow_cards)
    VALUES (?, 2, ?, ?, ?, ?)
  `);

  const nameCounts: Record<string, number> = {};

  for (const s of stats) {
    // Initialize count for this name if not exists
    if (nameCounts[s.name] === undefined) {
      nameCounts[s.name] = 0;
    }
    
    const players = getPlayer.all(s.name) as { id: number }[];
    
    if (players.length === 0) {
      console.log(`Player not found: ${s.name}`);
      continue;
    }

    // Get the player corresponding to the current occurrence count
    const currentIndex = nameCounts[s.name];
    
    if (currentIndex >= players.length) {
      console.log(`More stats entries for ${s.name} than players in DB. Skipping.`);
      continue;
    }

    const playerId = players[currentIndex].id;
    
    // Update Round 2 performance
    const result = updatePerf.run(s.v, s.e, s.d, s.am || 0, playerId);
    
    if (result.changes === 0) {
      console.log(`No performance record for ${s.name} (ID: ${playerId}) in Round 2. Creating one...`);
      insertPerf.run(playerId, s.v, s.e, s.d, s.am || 0);
    } else {
      // console.log(`Updated ${s.name} (ID: ${playerId})`);
    }

    // Increment count for this name
    nameCounts[s.name]++;
  }

  console.log("Stats update complete.");
}

updateStats();
