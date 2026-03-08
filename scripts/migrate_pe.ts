import Database from 'better-sqlite3';
const db = new Database('football.db');

function migrate() {
  console.log("Migrating extra_points to attendance...");
  // Move extra_points to attendance
  db.prepare('UPDATE performances SET attendance = extra_points WHERE extra_points > 0 AND attendance = 0').run();
  
  // Note: lost_points is already derived from yellow_cards/red_cards in the new query,
  // and I already set yellow_cards/red_cards in the previous turn's script.
  // So PP should already be correct if the card counts were set.
  
  console.log("Migration complete.");
}

migrate();
