# Cadastro de Alunos

Sistema web simples para cadastrar, listar, buscar e excluir alunos, feito com **Node.js + Express** no back-end e **HTML, CSS e JavaScript puro** no front-end.

> 📚 **Trabalho acadêmico** — desenvolvido como atividade da **AV1** da disciplina **Desenvolvimento de Aplicações para Internet**, do curso de **Análise e Desenvolvimento de Sistemas (ADS)** da **UNINASSAU**, 2º semestre.

## Funcionalidades

- Cadastro de alunos com nome, idade, e-mail e curso
- Validação dos dados no servidor:
  - todos os campos são obrigatórios
  - a idade precisa ser um número inteiro maior que zero
  - o e-mail precisa ter um formato válido
  - não é permitido cadastrar dois alunos com o mesmo e-mail
- Lista de alunos cadastrados em uma tabela, com contador
- Busca por nome ou curso enquanto o usuário digita
- Exclusão de aluno (com confirmação antes de excluir)
- Mensagens de sucesso e de erro na tela
- Layout que se ajusta à tela do celular

## Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/) 5
- HTML, CSS e JavaScript (sem frameworks)

## Estrutura do projeto

```
cadastro-de-aluno/
├── servidor.js        # Servidor Express e rotas da API
├── package.json
└── public/            # Arquivos entregues ao navegador
    ├── index.html     # Página com o formulário e a tabela
    ├── css/
    │   └── style.css  # Estilos da página
    └── js/
        └── script.js  # Comunicação com a API e montagem da tabela
```

## Como executar

Pré-requisito: ter o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. Clonar o repositório
git clone https://github.com/hortafront/cadastro-de-aluno.git
cd cadastro-de-aluno

# 2. Instalar as dependências
npm install

# 3. Iniciar o servidor
npm start
```

Depois é só abrir **http://localhost:3000** no navegador.

## Rotas da API

| Método | Rota           | Descrição                         |
|--------|----------------|-----------------------------------|
| GET    | `/alunos`      | Retorna a lista de alunos         |
| POST   | `/alunos`      | Cadastra um novo aluno            |
| DELETE | `/alunos/:id`  | Exclui o aluno com o id informado |

Exemplo de corpo para o `POST /alunos`:

```json
{
  "nome": "Maria Silva",
  "idade": 20,
  "email": "maria@email.com",
  "curso": "Análise e Desenvolvimento de Sistemas"
}
```

## Observação

Os alunos ficam guardados **na memória do servidor** (em um array). Por isso, os dados são apagados sempre que o servidor é reiniciado — não há banco de dados neste projeto.

## Autor

**Gustavo Horta** — estudante de Análise e Desenvolvimento de Sistemas na UNINASSAU.
