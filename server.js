const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("banco.db");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Cria tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
)`);

// Rota para listar usuários
app.get("/usuarios", (req, res) => {
    db.all("SELECT id, nome, email FROM usuarios", (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

// Rota para cadastrar usuário (responde rápido)
app.post("/usuarios", (req, res) => {
    const { nome, email, senha } = req.body;
    db.run(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha],
        function (err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }
            res.json({ id: this.lastID, nome, email });
        }
    );
});

// Inicia servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
