
const form = document.getElementById("formAluno");

const lista = document.getElementById("listaAlunos");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;

    const idade = document.getElementById("idade").value;

    // Envia os dados para o servidor
    const resposta = await fetch("/alunos", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nome: nome,
            idade: idade
        })

    });

    // Recebe a resposta enviada pelo servidor
    const dados = await resposta.json();

    // Mostra a mensagem no navegador
    alert(dados.mensagem);

    // Cria um novo elemento <li>
    const aluno = document.createElement("li");

    // Coloca nome e idade dentro do elemento
    aluno.textContent = `${nome} - ${idade} anos`;

    // Adiciona o aluno na lista
    lista.appendChild(aluno);

    // Limpa o formulário
    form.reset();

});