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

// Rotas individuais para consulta rápida
app.get('/competitors', (req, res) => res.json(state.competitors));
app.get('/teams', (req, res) => res.json(state.teams));
app.get('/games', (req, res) => res.json(state.games));
app.get('/matches', (req, res) => res.json(state.matches));

// Salvar itens (POST)
app.post('/save/:type', (req, res) => {
    const type = req.params.type;
    if (state[type]) {
        const newItem = { 
            id: Date.now(), 
            ...req.body 
        };
        
        // Conversão de tipos necessária para IDs vindo do formulário
        if (newItem.teamId) newItem.teamId = parseInt(newItem.teamId);
        if (newItem.gameId) newItem.gameId = parseInt(newItem.gameId);
        if (newItem.team1Id) newItem.team1Id = parseInt(newItem.team1Id);
        if (newItem.team2Id) newItem.team2Id = parseInt(newItem.team2Id);
        if (newItem.score1) newItem.score1 = parseInt(newItem.score1);
        if (newItem.score2) newItem.score2 = parseInt(newItem.score2);

        state[type].push(newItem);
        res.status(201).json(newItem);
    } else {
        res.status(400).json({ error: "Tipo inválido" });
    }
});

// Finalizar partida (PUT)
app.put('/matches/:id/finish', (req, res) => {
    const id = parseInt(req.params.id);
    const match = state.matches.find(m => m.id === id);
    if (match) {
        match.status = 'finished';
        match.score1 = Math.floor(Math.random() * 5); // Simula um placar
        match.score2 = Math.floor(Math.random() * 5);
        res.json(match);
    } else {
        res.status(404).json({ error: "Partida não encontrada" });
    }
});

app.listen(PORT, () => {
    console.log(`API E-Classes rodando em http://localhost:${PORT}`);
});
