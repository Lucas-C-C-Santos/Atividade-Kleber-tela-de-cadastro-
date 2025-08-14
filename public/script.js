const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Conexão com SQLite
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
    } else {
        console.log("Banco de dados conectado com sucesso.");
    }
});

// Criar tabela se não existir
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT UNIQUE,
    senha TEXT
)`);

// Rota POST para cadastrar
app.post("/usuarios", (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Preencha todos os campos" });
    }

    db.run(`INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
        [nome, email, senha],
        function (err) {
            if (err) {
                return res.status(500).json({ error: "Erro ao cadastrar usuário" });
            }
            res.json({ id: this.lastID, nome, email });
        }
    );
});

// Rota GET para listar
app.get("/usuarios", (req, res) => {
    db.all(`SELECT id, nome, email FROM usuarios`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        res.json(rows);
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
