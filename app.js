const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lê o arquivo de dados
function lerDados() {
    const caminho = path.join(__dirname, 'data.json');
    const conteudo = fs.readFileSync(caminho, 'utf-8');
    return JSON.parse(conteudo);
}

// Salva o objeto de dados inteiro de volta no data.json
function salvarDados(dados) {
    const caminho = path.join(__dirname, 'data.json');
    fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
}

// Gera o próximo id disponível de uma lista (maior id + 1)
function proximoId(lista) {
    return lista.length ? Math.max(...lista.map(item => item.id)) + 1 : 1;
}

// Cria as 5 rotas (GET todos, GET por id, POST, PUT, DELETE) para um recurso.
// caminho = nome usado na URL (ex: 'jogos'), chave = nome usado no data.json (ex: 'games')
function criarRotasCRUD(caminho, chave, nomeErro) {
    // GET /api/<caminho> - lista tudo
    app.get(`/api/${caminho}`, (req, res) => {
        const dados = lerDados();
        res.status(200).json(dados[chave]);
    });

    // GET /api/<caminho>/:id - um item pelo id
    app.get(`/api/${caminho}/:id`, (req, res) => {
        const dados = lerDados();
        const item = dados[chave].find(i => i.id === Number(req.params.id));
        if (!item) {
            return res.status(404).json({ erro: `${nomeErro} não encontrado` });
        }
        res.status(200).json(item);
    });

    // POST /api/<caminho> - cria um novo item e salva no data.json
    app.post(`/api/${caminho}`, (req, res) => {
        const dados = lerDados();
        const novoItem = { ...req.body, id: proximoId(dados[chave]) };
        dados[chave].push(novoItem);
        salvarDados(dados);
        res.status(201).json(novoItem);
    });

    // PUT /api/<caminho>/:id - atualiza um item existente e salva no data.json
    app.put(`/api/${caminho}/:id`, (req, res) => {
        const dados = lerDados();
        const indice = dados[chave].findIndex(i => i.id === Number(req.params.id));
        if (indice === -1) {
            return res.status(404).json({ erro: `${nomeErro} não encontrado` });
        }
        dados[chave][indice] = { ...dados[chave][indice], ...req.body, id: dados[chave][indice].id };
        salvarDados(dados);
        res.status(200).json(dados[chave][indice]);
    });

    // DELETE /api/<caminho>/:id - remove um item e salva no data.json
    app.delete(`/api/${caminho}/:id`, (req, res) => {
        const dados = lerDados();
        const indice = dados[chave].findIndex(i => i.id === Number(req.params.id));
        if (indice === -1) {
            return res.status(404).json({ erro: `${nomeErro} não encontrado` });
        }
        const [removido] = dados[chave].splice(indice, 1);
        salvarDados(dados);
        res.status(200).json(removido);
    });
}

// GET / - boas vindas
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'Bem vindo à API GamerClass',
        status: 'sucesso',
        rotas: ['/api/jogos', '/api/times', '/api/competidores', '/api/confrontos'],
    });
});

criarRotasCRUD('jogos', 'games', 'Jogo');
criarRotasCRUD('times', 'teams', 'Time');
criarRotasCRUD('competidores', 'competitors', 'Competidor');
criarRotasCRUD('confrontos', 'matches', 'Confronto');

// Rota não encontrada
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        mensagem: 'Verifique o método (GET, POST, PUT, DELETE) e a URL',
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});