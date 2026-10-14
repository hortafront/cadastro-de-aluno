// Importa o Express, a biblioteca que cria o servidor
const express = require("express");

// Importa o "path", que monta caminhos de pastas do jeito certo em qualquer sistema
const path = require("path");

// Cria a aplicação (o servidor)
const app = express();

// Porta em que o servidor vai funcionar
const PORTA = 3000;

// Permite que o servidor entenda dados enviados em JSON
app.use(express.json());

// Entrega ao navegador somente os arquivos da pasta "public" (HTML, CSS e JS da tela)
app.use(express.static(path.join(__dirname, "public")));


// ---------- Dados ----------

// Array que guarda os alunos na memória (some quando o servidor reinicia)
const alunos = [];

// Número usado como identificador (id) do próximo aluno cadastrado
let proximoId = 1;


// ---------- Validação ----------

// Confere os dados de um aluno.
// Devolve uma mensagem de erro, ou null quando está tudo certo.
function validarAluno(aluno) {

    // Todos os campos são obrigatórios
    if (!aluno.nome || !aluno.email || !aluno.curso) {
        return "Preencha todos os campos.";
    }

    // A idade precisa ser um número inteiro maior que zero
    if (!Number.isInteger(aluno.idade) || aluno.idade <= 0) {
        return "Informe uma idade válida.";
    }

    // O e-mail precisa ter o formato texto@texto.texto
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(aluno.email)) {
        return "Informe um e-mail válido.";
    }

    // Não deixa cadastrar dois alunos com o mesmo e-mail
    const emailRepetido = alunos.some((outro) => outro.email === aluno.email);

    if (emailRepetido) {
        return "Já existe um aluno cadastrado com esse e-mail.";
    }

    return null;
}


// ---------- Rotas ----------

// Rota POST: recebe um aluno novo enviado pelo formulário
app.post("/alunos", (req, res) => {

    // Pega os dados que vieram no corpo da requisição.
    // String(... ?? "") garante um texto mesmo se o campo não for enviado,
    // e trim() tira os espaços sobrando no começo e no fim.
    const aluno = {
        nome: String(req.body.nome ?? "").trim(),
        idade: Number(req.body.idade),
        email: String(req.body.email ?? "").trim().toLowerCase(),
        curso: String(req.body.curso ?? "").trim()
    };

    // Confere se os dados estão corretos
    const erro = validarAluno(aluno);

    // Se houver erro, responde com status 400 (requisição inválida) e para aqui
    if (erro) {
        return res.status(400).json({ mensagem: erro });
    }

    // Dá um id ao aluno e prepara o id do próximo
    aluno.id = proximoId;
    proximoId++;

    // Guarda o aluno no array
    alunos.push(aluno);

    // Responde ao navegador com status 201 (criado), uma mensagem e o aluno cadastrado
    res.status(201).json({
        mensagem: "Aluno cadastrado com sucesso!",
        aluno: aluno
    });
});

// Rota GET: devolve a lista de todos os alunos cadastrados
app.get("/alunos", (req, res) => {
    res.json(alunos);
});

// Rota DELETE: exclui o aluno que tem o id informado no endereço (ex.: /alunos/2)
app.delete("/alunos/:id", (req, res) => {

    // O id chega como texto, então converte para número
    const id = Number(req.params.id);

    // Procura a posição do aluno dentro do array (-1 quando não encontra)
    const posicao = alunos.findIndex((aluno) => aluno.id === id);

    // Se não encontrou, responde com status 404 (não encontrado)
    if (posicao === -1) {
        return res.status(404).json({ mensagem: "Aluno não encontrado." });
    }

    // Remove 1 item do array a partir da posição encontrada
    alunos.splice(posicao, 1);

    res.json({ mensagem: "Aluno excluído com sucesso!" });
});


// ---------- Inicialização ----------

// Liga o servidor na porta definida
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
