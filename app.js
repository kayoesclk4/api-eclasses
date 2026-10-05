require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Configure SUPABASE_URL e SUPABASE_KEY no arquivo .env');
    process.exit(1);
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

const recursos = {
    jogos: { tabela: 'games', nome: 'Jogo' },
    times: { tabela: 'teams', nome: 'Time' },
    competidores: { tabela: 'competitors', nome: 'Competidor' },
    confrontos: { tabela: 'matches', nome: 'Confronto' }
};

function numeroId(valor) {
    return Number(valor);
}

function limparDados(dados, camposPermitidos) {
    const resultado = {};
    for (const campo of camposPermitidos) {
        if (dados[campo] !== undefined) resultado[campo] = dados[campo];
    }
    return resultado;
}

const campos = {
    jogos: ['name', 'genre'],
    times: ['name', 'color'],
    competidores: ['name', 'nickname', 'teamId'],
    confrontos: ['gameId', 'team1Id', 'team2Id', 'score1', 'score2', 'status', 'date']
};

function criarRotasCRUD(caminho) {
    const recurso = recursos[caminho];
    const tabela = recurso.tabela;

    app.get(`/api/${caminho}`, async (req, res) => {
        const { data, error } = await supabase.from(tabela).select('*').order('id');
        if (error) return res.status(500).json({ erro: error.message });
        res.status(200).json(data);
    });

    app.get(`/api/${caminho}/:id`, async (req, res) => {
        const { data, error } = await supabase
            .from(tabela)
            .select('*')
            .eq('id', numeroId(req.params.id))
            .single();

        if (error || !data) {
            return res.status(404).json({ erro: `${recurso.nome} não encontrado` });
        }

        res.status(200).json(data);
    });

    app.post(`/api/${caminho}`, async (req, res) => {
        const dados = limparDados(req.body, campos[caminho]);
        const { data, error } = await supabase
            .from(tabela)
            .insert(dados)
            .select()
            .single();

        if (error) return res.status(400).json({ erro: error.message });
        res.status(201).json(data);
    });

    app.put(`/api/${caminho}/:id`, async (req, res) => {
        const id = numeroId(req.params.id);
        const dados = limparDados(req.body, campos[caminho]);

        const { data, error } = await supabase
            .from(tabela)
            .update(dados)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ erro: `${recurso.nome} não encontrado` });
        }

        res.status(200).json(data);
    });

    app.delete(`/api/${caminho}/:id`, async (req, res) => {
        const id = numeroId(req.params.id);

        const { data, error } = await supabase
            .from(tabela)
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ erro: `${recurso.nome} não encontrado` });
        }

        res.status(200).json(data);
    });
}

app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'Bem vindo à API E-Classes',
        status: 'sucesso',
        banco: 'Supabase',
        rotas: Object.keys(recursos).map(nome => `/api/${nome}`)
    });
});

for (const caminho of Object.keys(recursos)) {
    criarRotasCRUD(caminho);
}

app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada',
        mensagem: 'Verifique o método e a URL.'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
