// Importa o Express, a biblioteca que cria o servidor
const express = require("express");

// Cria a aplicação (o servidor)
const app = express();

// Permite que o servidor entenda dados enviados em JSON
app.use(express.json());

// Entrega os arquivos da pasta (index.html, style.css, script.js) ao navegador
app.use(express.static(__dirname));

// Array que guarda os alunos na memória (some quando o servidor reinicia)
const alunos = [];

// Rota POST: recebe um aluno novo enviado pelo formulário
app.post("/alunos", (req, res) => {

    // Pega nome e idade que vieram no corpo da requisição
    const aluno = {
        nome: req.body.nome,
        idade: req.body.idade
    };

    // Guarda o aluno no array
    alunos.push(aluno);

    // Responde ao navegador com uma mensagem e o aluno cadastrado
    res.json({
        mensagem: "Aluno cadastrado com sucesso!",
        aluno: aluno
    });
});

// Rota GET: devolve a lista de todos os alunos cadastrados
app.get("/alunos", (req, res) => {
    res.json(alunos);
});

// Liga o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});