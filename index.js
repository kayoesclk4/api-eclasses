const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulação de Banco de Dados
let state = {
    competitors: [
        { id: 1, name: "João Silva", nickname: "Jao444", teamId: 1 },
        { id: 2, name: "Ana Costa", nickname: "Anaa", teamId: 2 }
    ],
    teams: [
        { id: 1, name: "Ninjas", color: "#6366f1" },
        { id: 2, name: "Fênix", color: "#f43f5e" }
    ],
    games: [
        { id: 1, name: "CS2", genre: "FPS" },
        { id: 2, name: "Counter-Strike", genre: "FPS" }
    ],
    matches: [
        { id: 1, gameId: 1, team1Id: 1, team2Id: 2, score1: 0, score2: 0, date: new Date().toISOString(), status: 'scheduled' }
    ]
};

// Rota Raiz
app.get('/', (req, res) => {
    const totalUsuarios = state.competitors.length;
    res.send(`Bem vindo a API E-Classes, existem ${totalUsuarios} usuarios cadastrados`);
});

// Pegar todo o estado
app.get('/state', (req, res) => {
    res.json(state);
});

// Rotas individuais
app.get('/competitors', (req, res) => res.json(state.competitors));
app.get('/teams', (req, res) => res.json(state.teams));
app.get('/games', (req, res) => res.json(state.games));
app.get('/matches', (req, res) => res.json(state.matches));

app.listen(PORT, () => {
    console.log(`API E-Classes rodando em http://localhost:${PORT}`);
});
