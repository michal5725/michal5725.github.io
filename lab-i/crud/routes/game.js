const express = require('express');
const router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, '../database.db');
const db = new DatabaseSync(dbPath);

// Tabela zgodna z Twoim plikiem 02-game.sql
db.exec(`
    CREATE TABLE IF NOT EXISTS game (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        title TEXT NOT NULL,
                                        developer TEXT NOT NULL
    )
`);

// Jeśli istniejąca baza została utworzona wcześniej bez kolumny `developer`,
// ALTER TABLE doda ją teraz. CREATE TABLE IF NOT EXISTS nie zmienia już istniejącej tabeli,
// więc robimy dodatkowe sprawdzenie schematu i dodajemy kolumnę jeśli brakuje.
try {
    const cols = db.prepare("PRAGMA table_info('game')").all();
    const hasDeveloper = cols.some(c => c.name === 'developer');
    const hasDescription = cols.some(c => c.name === 'description');
    if (!hasDeveloper) {
        db.exec("ALTER TABLE game ADD COLUMN developer TEXT");
    }
    if (!hasDescription) {
        // Dodajemy kolumnę description; nie możemy dodać NOT NULL przez ALTER TABLE,
        // więc zostanie dodana jako NULLABLE. Wstawimy pusty string dla istniejących wierszy
        // jeśli chcemy zachować zgodność z NOT NULL constraint w oryginalnym schemacie.
        db.exec("ALTER TABLE game ADD COLUMN description TEXT");
        try {
            db.exec("UPDATE game SET description = '' WHERE description IS NULL");
        } catch (e) {
            // ignore
        }
    }
} catch (e) {
    // nie przerywamy działania aplikacji — błąd pokaże się w logach
    console.error('Błąd sprawdzania/dodawania kolumn w tabeli game:', e);
}

// LIST
router.get('/', (req, res) => {
    const stmt = db.prepare('SELECT * FROM game');
    res.render('game/index', { games: stmt.all() });
});

// CREATE
router.get('/create', (req, res) => {
    res.render('game/create');
});
router.post('/create', (req, res, next) => {
    try {
        const stmt = db.prepare('INSERT INTO game (title, developer, description) VALUES (?, ?, ?)');
        const description = req.body.description || '';
        stmt.run(req.body.title, req.body.developer, description);
        res.redirect('/game');
    } catch (err) { next(err); }
});

// READ
router.get('/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM game WHERE id = ?');
    res.render('game/show', { game: stmt.get(req.params.id) });
});

// UPDATE
router.get('/:id/edit', (req, res) => {
    const stmt = db.prepare('SELECT * FROM game WHERE id = ?');
    res.render('game/edit', { game: stmt.get(req.params.id) });
});
router.post('/:id/edit', (req, res) => {
    const stmt = db.prepare('UPDATE game SET title = ?, developer = ?, description = ? WHERE id = ?');
    const description = req.body.description || '';
    stmt.run(req.body.title, req.body.developer, description, req.params.id);
    res.redirect('/game');
});

// DELETE
router.post('/:id/delete', (req, res) => {
    const stmt = db.prepare('DELETE FROM game WHERE id = ?');
    stmt.run(req.params.id);
    res.redirect('/game');
});

module.exports = router;