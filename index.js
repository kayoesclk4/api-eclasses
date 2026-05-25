const express = require('express' );
const cors = require('cors');
const app = express();
const PORT = 3000;

// ISSO É ESSENCIAL: deve vir antes de tudo
app.use(cors());
app.use(express.json());

// Log para te ajudar a debugar no terminal
app.use((req, res, next) => {
    console.log(`[${req.method}] acessando ${req.url}`);
    next();
});

let usuarios = [
    { id: 1, nome: "Joao Silva", email: "joao@eclass.com", matricula: "2023001" },
    { id: 2, nome: "Ana Costa", email: "ana@eclass.com", matricula: "2023002" },
    { id: 3, nome: "Pedro Mendes", email: "pedro@eclass.com", matricula: "2023003" }
];

// Rota Raiz
app.get('/', (req, res) => {
    res.send(`Bem vindo a API E-Class, existem ${usuarios.length} usuarios cadastrados`);
});

// GET Todos
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

// GET por Nome
app.get('/usuarios/nome/:nome', (req, res) => {
    const nome = req.params.nome.toLowerCase();
    const usuario = usuarios.find(u => u.nome.toLowerCase().includes(nome));
    if (usuario) return res.json(usuario);
    res.status(404).json({ erro: "Usuario nao encontrado" });
});

// POST (Criar)
app.post('/usuarios', (req, res) => {
    const { nome, email, matricula } = req.body;
    if (!nome || !email || !matricula) {
        return res.status(400).json({ erro: "Envie nome, email e matricula no corpo da requisicao" });
    }
    const novoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    const novoUsuario = { id: novoId, nome, email, matricula };
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
});

// PUT (Editar)
app.put('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ erro: "Usuario nao encontrado" });
    usuarios[index] = { ...usuarios[index], ...req.body };
    res.json(usuarios[index]);
});

// DELETE (Remover)
app.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ erro: "Usuario nao encontrado" });
    usuarios.splice(index, 1);
    res.json({ mensagem: "Usuario deletado com sucesso" });
});

app.listen(PORT, () => {
    console.log(`API E-Class rodando em http://localhost:${PORT}` );
});
