const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const dbFile = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
  )`);
});

function isEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

app.post('/usuarios', (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Campos obrigatórios.' });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ error: 'E-mail inválido.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter ao menos 6 caracteres.' });
    }

    const stmt = db.prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)');
    stmt.run([nome.trim(), email.trim().toLowerCase(), senha], function (err) {
      if (err) {
        if (String(err).includes('UNIQUE')) {
          return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      }
      return res.status(201).json({ id: this.lastID, nome, email });
    });
    stmt.finalize();
  } catch (e) {
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
});

app.get('/usuarios', (req, res) => {
  db.all('SELECT id, nome, email FROM usuarios ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
    return res.json(rows);
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
