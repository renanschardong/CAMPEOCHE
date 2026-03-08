const db = require('better-sqlite3')('football.db');

const playersData = [
  { name: 'ADRIANO DENIS', r1: 11, r2: 6, goals: 1 },
  { name: 'WISLEI', r1: 10, r2: 6, goals: 2 },
  { name: 'RENE', r1: 12, r2: 3, goals: 4 },
  { name: 'BILL', r1: 9, r2: 6, goals: 2 },
  { name: 'ORESTES', r1: 12, r2: 2, goals: 0 },
  { name: 'LEANDRO', r1: 8, r2: 6, goals: 0 },
  { name: 'GODOLFINO', r1: 11, r2: 2, goals: 0 },
  { name: 'ALVARO', r1: 7, r2: 6, goals: 1 },
  { name: 'GABRIEL VAZ', r1: 7, r2: 6, goals: 0 },
  { name: 'JAIME', r1: 7, r2: 6, goals: 0 },
  { name: 'WANDER', r1: 7, r2: 6, goals: 0 },
  { name: 'GAVILAN', r1: 7, r2: 6, goals: 0 },
  { name: 'NILSON', r1: 6, r2: 6, goals: 1 },
  { name: 'JOÃO GUILHERME', r1: 6, r2: 6, goals: 5 },
  { name: 'HENRIQUE', r1: 9, r2: 2, goals: 0 },
  { name: 'DYEGO', r1: 9, r2: 2, goals: 0 },
  { name: 'ALEXANDRE OLIVOTO', r1: 7, r2: 2, goals: 0 },
  { name: 'JESSE', r1: 7, r2: 2, goals: 0 },
  { name: 'NYKOLAS', r1: 3, r2: 6, goals: 1 },
  { name: 'CLODOALDO', r1: 7, r2: 2, goals: 5 },
  { name: 'RANGEL', r1: 7, r2: 2, goals: 0 },
  { name: 'HELTON', r1: 3, r2: 6, goals: 0 },
  { name: 'EVERTON SIQUEIRA', r1: 3, r2: 6, goals: 1 },
  { name: 'CLAUDIO', r1: 6, r2: 2, goals: 2 },
  { name: 'LEANDRO FONSECA', r1: 8, r2: 0, goals: 0 },
  { name: 'DEYVID', r1: 2, r2: 6, goals: 2 },
  { name: 'JEFERSON', r1: 2, r2: 6, goals: 0 },
  { name: 'GABRIEL SICRED', r1: 2, r2: 6, goals: 2 },
  { name: 'WELLINTON BRUNO', r1: 2, r2: 6, goals: 2 },
  { name: 'FABIO ARUTH', r1: 5, r2: 2, goals: 0 },
  { name: 'JOÃO HENRIQUE', r1: 1, r2: 6, goals: 1 },
  { name: 'LEO', r1: 1, r2: 6, goals: 1 },
  { name: 'NELSON', r1: 7, r2: 0, goals: 0 },
  { name: 'CLEMENTINO', r1: 6, r2: 0, goals: 0 },
  { name: 'EDSON', r1: 6, r2: 0, goals: 0 },
  { name: 'EVERTON ROSSI', r1: 6, r2: 0, goals: 0 },
  { name: 'CLAUBER', r1: 6, r2: 0, goals: 0 },
  { name: 'DIEGO BOTTEGA', r1: 6, r2: 0, goals: 0 },
  { name: 'MARCIO', r1: 6, r2: 0, goals: 0 },
  { name: 'RENATO PEREIRA', r1: 0, r2: 6, goals: 0 },
  { name: 'MELARA', r1: 3, r2: 3, goals: 1 },
  { name: 'FABIO SICRED', r1: 6, r2: 0, goals: 0 },
  { name: 'THIAGO DIB', r1: 0, r2: 6, goals: 2 },
  { name: 'FABIO RODRIGO', r1: 0, r2: 6, goals: 0 },
  { name: 'VITOR SICRED', r1: 0, r2: 6, goals: 0 },
  { name: 'EVANDRO', r1: 0, r2: 6, goals: 0 },
  { name: 'EDILSON CRISTIANO', r1: 3, r2: 2, goals: 0 },
  { name: 'RAFAEL MIOLA', r1: 3, r2: 2, goals: 0 },
  { name: 'PETERSON', r1: 5, r2: 0, goals: 0 },
  { name: 'HUGO', r1: 5, r2: 0, goals: 0 },
  { name: 'GENILDO', r1: 5, r2: 0, goals: 0 },
  { name: 'GABRIEL DE SÁ', r1: 3, r2: 2, goals: 1 },
  { name: 'FERNANDO SANTISTA', r1: 5, r2: 0, goals: 0 },
  { name: 'HILARIO', r1: 3, r2: 2, goals: 0 },
  { name: 'ROBINHO CAIXA', r1: 3, r2: 2, goals: 0 },
  { name: 'YURI', r1: 3, r2: 2, goals: 0 },
  { name: 'ELINEI', r1: 4, r2: 0, goals: 0 },
  { name: 'IAN', r1: 4, r2: 0, goals: 1 },
  { name: 'PATRICK', r1: 4, r2: 0, goals: 0 },
  { name: 'JHONATA', r1: 2, r2: 2, goals: 4 },
  { name: 'PEDRO HENRIQUE', r1: 2, r2: 2, goals: 1 },
  { name: 'BRUNO YURI', r1: 1, r2: 2, goals: 0 },
  { name: 'EDNALDO', r1: 3, r2: 0, goals: 0 },
  { name: 'EDVALDO', r1: 3, r2: 0, goals: 0 },
  { name: 'PAULO AURELIO', r1: 3, r2: 0, goals: 0 },
  { name: 'DANILO BB', r1: 3, r2: 0, goals: 0 },
  { name: 'MAILSON', r1: 3, r2: 0, goals: 0 },
  { name: 'FELIPE BABA', r1: 1, r2: 2, goals: 1 },
  { name: 'GABRIEL VALIAT', r1: 3, r2: 0, goals: 2 },
  { name: 'ALAN', r1: 2, r2: 0, goals: 0 },
  { name: 'JEAN OLIVEIRA', r1: 2, r2: 0, goals: 0 },
  { name: 'JOÃO VITOR', r1: 2, r2: 0, goals: 0 },
  { name: 'PEDRO LUIZ', r1: 2, r2: 0, goals: 0 },
  { name: 'AJALA', r1: 2, r2: 0, goals: 0 },
  { name: 'WAGNER BORGO', r1: 2, r2: 0, goals: 0 },
  { name: 'RAFAEL RICARDO', r1: 0, r2: 2, goals: 0 },
  { name: 'RAFAEL CAMPESTRINI', r1: 0, r2: 2, goals: 0 },
  { name: 'RENAN', r1: 0, r2: 2, goals: 1 },
  { name: 'BRUNO DE PAULA', r1: 1, r2: 0, goals: 0 },
  { name: 'DUNGA', r1: 1, r2: 0, goals: 0 },
  { name: 'FABIO COELHO', r1: 1, r2: 0, goals: 0 },
  { name: 'IGOR', r1: 1, r2: 0, goals: 0 },
  { name: 'MATHEUS HENRIQUE', r1: 1, r2: 0, goals: 0 },
  { name: 'MAYCK', r1: 1, r2: 0, goals: 0 },
  { name: 'PEDRO HENRIQUE PP', r1: 1, r2: 0, goals: 0 },
  { name: 'RENATO OLIVEIRA', r1: 1, r2: 0, goals: 0 },
  { name: 'VINICIUS', r1: 1, r2: 0, goals: 0 },
  { name: 'ELITO', r1: 1, r2: 0, goals: 0 },
  { name: 'GUSTAVO MERC.', r1: 1, r2: 0, goals: 0 },
  { name: 'JADIR', r1: 1, r2: 0, goals: 0 },
  { name: 'ANTHONI', r1: 1, r2: 0, goals: 0 },
  { name: 'LEONARDO', r1: 0, r2: 0, goals: 0 },
  { name: 'MARCIO', r1: 0, r2: 0, goals: 0 }
];

const goalkeepersData = [
  { name: 'AFONSO', r1: 12, r2: 7, goals_conceded: 4 },
  { name: 'EDMUNDO', r1: 3, r2: 7, goals_conceded: 5 },
  { name: 'EDILSON', r1: 8, r2: 2, goals_conceded: 6 },
  { name: 'FELIPE', r1: 6, r2: 0, goals_conceded: 2 },
  { name: 'JOSE', r1: 0, r2: 6, goals_conceded: 0 },
  { name: 'ZE LUIZ', r1: 3, r2: 2, goals_conceded: 12 },
  { name: 'CARLOS EDUARDO', r1: 3, r2: 2, goals_conceded: 6 }
];

try {
  // Create rounds if they don't exist
  db.exec("INSERT OR IGNORE INTO rounds (id, name) VALUES (1, 'Rodada 1'), (2, 'Rodada 2')");

  const insertPlayer = db.prepare('INSERT INTO players (name, position) VALUES (?, ?)');
  const insertPerformance = db.prepare(`
    INSERT INTO performances (player_id, round_id, points, goals, goals_conceded)
    VALUES (?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    // Clear existing data
    db.exec('DELETE FROM performances');
    db.exec('DELETE FROM players');

    // Insert Linha players
    for (const p of playersData) {
      const info = insertPlayer.run(p.name, 'Linha');
      const playerId = info.lastInsertRowid;
      
      if (p.r1 > 0 || p.goals > 0) {
        insertPerformance.run(playerId, 1, p.r1, p.goals, 0);
      }
      if (p.r2 > 0) {
        insertPerformance.run(playerId, 2, p.r2, 0, 0);
      }
    }

    // Insert Goleiros
    for (const g of goalkeepersData) {
      const info = insertPlayer.run(g.name, 'Goleiro');
      const playerId = info.lastInsertRowid;
      
      if (g.r1 > 0 || g.goals_conceded > 0) {
        insertPerformance.run(playerId, 1, g.r1, 0, g.goals_conceded);
      }
      if (g.r2 > 0) {
        insertPerformance.run(playerId, 2, g.r2, 0, 0);
      }
    }
  })();
  
  console.log('Data loaded successfully!');
} catch (error) {
  console.error('Error loading data:', error);
}
