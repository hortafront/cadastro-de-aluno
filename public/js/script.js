
// ---------- Elementos da página ----------

const form = document.getElementById("formAluno");

const lista = document.getElementById("listaAlunos");

const campoBusca = document.getElementById("busca");

const mensagem = document.getElementById("mensagem");

const contador = document.getElementById("contador");

const listaVazia = document.getElementById("listaVazia");


// ---------- Dados ----------

// Guarda os alunos recebidos do servidor (usado para montar a tabela e filtrar)
let alunos = [];


// ---------- Funções ----------

// Mostra um aviso na página. O tipo pode ser "sucesso" ou "erro"
function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    // Troca a classe para o aviso ficar verde (sucesso) ou vermelho (erro)
    mensagem.className = `mensagem ${tipo}`;

}

// Busca no servidor a lista de alunos e mostra na tabela
async function carregarAlunos() {

    try {

        const resposta = await fetch("/alunos");

        alunos = await resposta.json();

        mostrarAlunos();

    } catch (erro) {

        // Cai aqui quando o servidor está desligado ou sem conexão
        mostrarMensagem("Não foi possível carregar os alunos.", "erro");

    }

}

// Monta as linhas da tabela, respeitando o que foi digitado na busca
function mostrarAlunos() {

    // Texto da busca em letras minúsculas, para não diferenciar maiúsculas
    const termo = campoBusca.value.trim().toLowerCase();

    // Fica só com os alunos que têm o termo no nome ou no curso
    const filtrados = alunos.filter(function(aluno) {

        return aluno.nome.toLowerCase().includes(termo)
            || aluno.curso.toLowerCase().includes(termo);

    });

    // Apaga as linhas antigas antes de montar as novas
    lista.innerHTML = "";

    filtrados.forEach(function(aluno) {

        lista.appendChild(criarLinha(aluno));

    });

    // Atualiza o contador de alunos
    contador.textContent = alunos.length === 1
        ? "1 aluno"
        : `${alunos.length} alunos`;

    // Mostra um aviso quando não há nada para listar
    if (alunos.length === 0) {
        listaVazia.textContent = "Nenhum aluno cadastrado ainda.";
    } else if (filtrados.length === 0) {
        listaVazia.textContent = "Nenhum aluno encontrado para essa busca.";
    } else {
        listaVazia.textContent = "";
    }

}

// Cria uma linha <tr> da tabela com os dados de um aluno
function criarLinha(aluno) {

    const linha = document.createElement("tr");

    // Uma célula <td> para cada informação do aluno
    const dados = [aluno.nome, `${aluno.idade} anos`, aluno.email, aluno.curso];

    dados.forEach(function(texto) {

        const celula = document.createElement("td");

        // textContent mostra o texto exatamente como foi digitado (mais seguro que innerHTML)
        celula.textContent = texto;

        linha.appendChild(celula);

    });

    // Última célula: botão de excluir
    const celulaAcoes = document.createElement("td");

    const botaoExcluir = document.createElement("button");

    botaoExcluir.textContent = "Excluir";

    botaoExcluir.className = "botao-excluir";

    botaoExcluir.addEventListener("click", function() {
        excluirAluno(aluno);
    });

    celulaAcoes.appendChild(botaoExcluir);

    linha.appendChild(celulaAcoes);

    return linha;

}

// Envia os dados do formulário para o servidor
async function cadastrarAluno(event) {

    // Impede o formulário de recarregar a página
    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const idade = document.getElementById("idade").value;

    const email = document.getElementById("email").value;

    const curso = document.getElementById("curso").value;

    try {

        // Envia os dados para o servidor
        const resposta = await fetch("/alunos", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome,
                idade: idade,
                email: email,
                curso: curso
            })

        });

        // Recebe a resposta enviada pelo servidor
        const dados = await resposta.json();

        // Se o servidor recusou o cadastro, mostra o motivo e para aqui
        if (!resposta.ok) {
            mostrarMensagem(dados.mensagem, "erro");
            return;
        }

        // Mostra a mensagem de sucesso na página
        mostrarMensagem(dados.mensagem, "sucesso");

        // Limpa o formulário
        form.reset();

        // Atualiza a tabela com o novo aluno
        await carregarAlunos();

    } catch (erro) {

        mostrarMensagem("Não foi possível conectar ao servidor.", "erro");

    }

}

// Pede ao servidor para excluir um aluno
async function excluirAluno(aluno) {

    // Pede confirmação antes de excluir
    const confirmou = confirm(`Deseja excluir o aluno ${aluno.nome}?`);

    if (!confirmou) {
        return;
    }

    try {

        const resposta = await fetch(`/alunos/${aluno.id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        mostrarMensagem(dados.mensagem, resposta.ok ? "sucesso" : "erro");

        // Atualiza a tabela sem o aluno excluído
        await carregarAlunos();

    } catch (erro) {

        mostrarMensagem("Não foi possível conectar ao servidor.", "erro");

    }

}


// ---------- Eventos ----------

// Ao enviar o formulário, cadastra o aluno
form.addEventListener("submit", cadastrarAluno);

// A cada letra digitada na busca, refaz a tabela já filtrada
campoBusca.addEventListener("input", mostrarAlunos);

// Ao abrir a página, carrega os alunos que já estão no servidor
carregarAlunos();
