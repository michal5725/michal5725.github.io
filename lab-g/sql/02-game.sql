DROP TABLE IF EXISTS game;

CREATE TABLE game (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      title TEXT NOT NULL,
                      developer TEXT NOT NULL
);