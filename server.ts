import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log('INITIALIZING DATABASE...');
const db = new Database('football.db');
console.log('DATABASE CONNECTED.');

try {
  // Initialize Database
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

    INSERT OR IGNORE INTO rounds (id, name) VALUES (1, 'Rodada 1');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (2, 'Rodada 2');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (3, 'Rodada 3');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (4, 'Rodada 4');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (5, 'Rodada 5');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (6, 'Rodada 6');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (7, 'Rodada 7');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (8, 'Rodada 8');
    INSERT OR IGNORE INTO rounds (id, name) VALUES (9, 'RODADA DA FINAL');

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
      extra_points INTEGER DEFAULT 0,
      lost_points INTEGER DEFAULT 0,
      FOREIGN KEY (player_id) REFERENCES players(id),
      FOREIGN KEY (round_id) REFERENCES rounds(id),
      UNIQUE(player_id, round_id)
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      win_points INTEGER DEFAULT 6,
      draw_points INTEGER DEFAULT 3,
      loss_points INTEGER DEFAULT 2,
      yellow_card_points INTEGER DEFAULT -2,
      red_card_points INTEGER DEFAULT -4,
      championship_name TEXT DEFAULT 'CAMPEOCHE - 2026'
    );
    
    INSERT OR IGNORE INTO settings (id, win_points, draw_points, loss_points, yellow_card_points, red_card_points, championship_name)
    VALUES (1, 6, 3, 2, -2, -4, 'CAMPEOCHE - 2026');
    
    UPDATE settings SET yellow_card_points = -2, red_card_points = -4 WHERE id = 1;

    CREATE TABLE IF NOT EXISTS backups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      moderator TEXT NOT NULL
    );
  `);

  try {
    db.exec('ALTER TABLE performances ADD COLUMN points INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN wins INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN draws INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN losses INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN red_cards INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN attendance INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN repechage INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec('ALTER TABLE performances ADD COLUMN extra_points INTEGER DEFAULT 0');
  } catch (e) {}
  try {
    db.exec("ALTER TABLE settings ADD COLUMN championship_name TEXT DEFAULT 'CAMPEOCHE - 2026'");
  } catch (e) {}
} catch (error) {
  console.error('DATABASE INITIALIZATION ERROR:', error);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => res.send('OK'));

  // Set language header for Brazil
  app.use((req, res, next) => {
    res.setHeader('Content-Language', 'pt-BR');
    next();
  });

  // API Routes
  
  // Get settings
  app.get('/api/settings', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM settings WHERE id = 1');
      const settings = stmt.get();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Failed to fetch settings' });
    }
  });

  // Update settings
  app.post('/api/settings', (req, res) => {
    const { win_points, draw_points, loss_points, yellow_card_points, red_card_points, championship_name } = req.body;
    
    try {
      const stmt = db.prepare(`
        UPDATE settings 
        SET win_points = ?, draw_points = ?, loss_points = ?, yellow_card_points = ?, red_card_points = ?, championship_name = ?
        WHERE id = 1
      `);
      stmt.run(win_points, draw_points, loss_points, yellow_card_points, red_card_points, championship_name);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });
  
  // Get all players
  app.get('/api/players', (req, res) => {
    const stmt = db.prepare('SELECT * FROM players ORDER BY name');
    const players = stmt.all();
    res.json(players);
  });

  // Create player
  app.post('/api/players', (req, res) => {
    const { name, position } = req.body;
    if (!name || !position) return res.status(400).json({ error: 'Name and position required' });
    
    try {
      const stmt = db.prepare('INSERT INTO players (name, position) VALUES (?, ?)');
      const info = stmt.run(name, position);
      res.json({ id: info.lastInsertRowid, name, position });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create player' });
    }
  });

  // Bulk create players
  app.post('/api/players/bulk', (req, res) => {
    const { players } = req.body;
    if (!Array.isArray(players)) return res.status(400).json({ error: 'Players array required' });
    
    try {
      const insert = db.prepare('INSERT INTO players (name, position) VALUES (?, ?)');
      const insertMany = db.transaction((players) => {
        for (const player of players) {
          insert.run(player.name, player.position);
        }
      });
      insertMany(players);
      res.json({ success: true, count: players.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to bulk create players' });
    }
  });

  // Delete player
  app.delete('/api/players/:id', (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM players WHERE id = ?');
      stmt.run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete player' });
    }
  });

  // Update player name
  app.put('/api/players/:id', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    
    try {
      const stmt = db.prepare('UPDATE players SET name = ? WHERE id = ?');
      stmt.run(name, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update player' });
    }
  });

  // Delete all players
  app.delete('/api/players', (req, res) => {
    try {
      const deletePerformances = db.prepare('DELETE FROM performances');
      const deletePlayers = db.prepare('DELETE FROM players');
      
      const transaction = db.transaction(() => {
        deletePerformances.run();
        deletePlayers.run();
      });
      
      transaction();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete all players' });
    }
  });

  // Get all rounds
  app.get('/api/rounds', (req, res) => {
    const stmt = db.prepare('SELECT * FROM rounds ORDER BY id');
    const rounds = stmt.all();
    res.json(rounds);
  });

  // Create round
  app.post('/api/rounds', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    
    try {
      const stmt = db.prepare('INSERT INTO rounds (name) VALUES (?)');
      const info = stmt.run(name);
      res.json({ id: info.lastInsertRowid, name });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create round' });
    }
  });

  // Get performances for a round (or all if no round specified)
  app.get('/api/performances', (req, res) => {
    const { round_id } = req.query;
    let query = `
      SELECT p.*, pl.name as player_name, pl.position as player_position, r.name as round_name
      FROM performances p
      JOIN players pl ON p.player_id = pl.id
      JOIN rounds r ON p.round_id = r.id
    `;
    
    const params = [];
    if (round_id) {
      query += ' WHERE p.round_id = ?';
      params.push(round_id);
    }
    
    const stmt = db.prepare(query);
    const performances = stmt.all(...params);
    res.json(performances);
  });

  // Upsert performance
  app.post('/api/performances', (req, res) => {
    const { player_id, round_id, goals, yellow_cards, goals_conceded, points, wins, draws, losses, red_cards, extra_points } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO performances (player_id, round_id, goals, yellow_cards, goals_conceded, points, wins, draws, losses, red_cards, extra_points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id, round_id) DO UPDATE SET
        goals = excluded.goals,
        yellow_cards = excluded.yellow_cards,
        goals_conceded = excluded.goals_conceded,
        points = excluded.points,
        wins = excluded.wins,
        draws = excluded.draws,
        losses = excluded.losses,
        red_cards = excluded.red_cards,
        extra_points = excluded.extra_points
      `);
      stmt.run(
        player_id, 
        round_id, 
        goals || 0, 
        yellow_cards || 0, 
        goals_conceded || 0, 
        points || 0,
        wins || 0,
        draws || 0,
        losses || 0,
        red_cards || 0,
        extra_points || 0
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save performance' });
    }
  });

  // Bulk upsert performances
  app.post('/api/performances/bulk', (req, res) => {
    const { performances } = req.body;
    if (!Array.isArray(performances)) return res.status(400).json({ error: 'Performances array required' });
    
    try {
      const stmt = db.prepare(`
        INSERT INTO performances (player_id, round_id, goals, yellow_cards, goals_conceded, points, wins, draws, losses, red_cards, extra_points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(player_id, round_id) DO UPDATE SET
        goals = excluded.goals,
        yellow_cards = excluded.yellow_cards,
        goals_conceded = excluded.goals_conceded,
        points = excluded.points,
        wins = excluded.wins,
        draws = excluded.draws,
        losses = excluded.losses,
        red_cards = excluded.red_cards,
        extra_points = excluded.extra_points
      `);
      
      const upsertMany = db.transaction((perfs) => {
        for (const p of perfs) {
          stmt.run(
            p.player_id, 
            p.round_id, 
            p.goals || 0, 
            p.yellow_cards || 0, 
            p.goals_conceded || 0, 
            p.points || 0,
            p.wins || 0,
            p.draws || 0,
            p.losses || 0,
            p.red_cards || 0,
            p.extra_points || 0
          );
        }
      });
      
      upsertMany(performances);
      res.json({ success: true, count: performances.length });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to bulk save performances' });
    }
  });

  // Reset all stats
  app.delete('/api/stats', (req, res) => {
    try {
      const stmt = db.prepare('DELETE FROM performances');
      stmt.run();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to reset stats' });
    }
  });

  // Get aggregated stats (Leaderboards)
  app.get('/api/stats/leaderboard', (req, res) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          pl.id, 
          pl.name, 
          pl.position,
          SUM(p.goals) as total_goals,
          SUM(p.yellow_cards) as total_yellow_cards,
          SUM(p.goals_conceded) as total_goals_conceded,
          SUM(
            (CASE WHEN p.round_id = 8 THEN 2 ELSE 1 END) * (
              (p.wins * s.win_points) + 
              (p.draws * s.draw_points) + 
              (p.losses * s.loss_points)
            ) + 
            p.extra_points + 
            (p.yellow_cards * s.yellow_card_points) + 
            (p.red_cards * s.red_card_points)
          ) as total_points,
          SUM(p.wins) as total_wins,
          SUM(p.draws) as total_draws,
          SUM(p.losses) as total_losses,
          SUM(p.red_cards) as total_red_cards,
          SUM(p.extra_points) as total_extra_points,
          SUM(ABS(p.yellow_cards * s.yellow_card_points) + ABS(p.red_cards * s.red_card_points)) as total_lost_points,
          COUNT(p.round_id) as matches_played,
          SUM(CASE WHEN p.round_id = 1 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r1,
          SUM(CASE WHEN p.round_id = 2 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r2,
          SUM(CASE WHEN p.round_id = 3 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r3,
          SUM(CASE WHEN p.round_id = 4 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r4,
          SUM(CASE WHEN p.round_id = 5 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r5,
          SUM(CASE WHEN p.round_id = 6 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r6,
          SUM(CASE WHEN p.round_id = 7 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r7,
          SUM(CASE WHEN p.round_id = 8 THEN 
            2 * ((p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points)) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r8,
          SUM(CASE WHEN p.round_id = 9 THEN 
            (p.wins * s.win_points) + (p.draws * s.draw_points) + (p.losses * s.loss_points) + 
            p.extra_points + (p.yellow_cards * s.yellow_card_points) + (p.red_cards * s.red_card_points)
          ELSE 0 END) as r9
        FROM players pl
        LEFT JOIN performances p ON pl.id = p.player_id
        CROSS JOIN settings s ON s.id = 1
        GROUP BY pl.id
      `);
      const stats = stmt.all();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  });

  // Get backups
  app.get('/api/backups', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM backups ORDER BY created_at DESC LIMIT 5');
      const backups = stmt.all();
      res.json(backups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch backups' });
    }
  });

  // Create backup
  app.post('/api/backups', async (req, res) => {
    const { moderator } = req.body;
    if (!moderator) return res.status(400).json({ error: 'Moderator name required' });

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.db`;
      
      // SQLite Backup API or simple file copy
      // Using VACUUM INTO for a clean backup
      db.prepare(`VACUUM INTO '${filename}'`).run();

      const stmt = db.prepare('INSERT INTO backups (filename, moderator) VALUES (?, ?)');
      stmt.run(filename, moderator);

      res.json({ success: true, filename });
    } catch (error) {
      console.error('Backup error:', error);
      res.status(500).json({ error: 'Failed to create backup' });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production (if we were building for prod)
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('FAILED TO START SERVER:', err);
  process.exit(1);
});
