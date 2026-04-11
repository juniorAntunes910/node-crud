// Importações
const express = require("express");
const methodOverride = require("method-override");

// Prisma
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg"); // <-- Letra maiúscula corrigida!
const { Pool } = require("pg");

// Conexão com o banco (.env, Docker -e DATABASE_URL=..., ou fallback local)
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://junior:junior@localhost:5456/crud_node?schema=public";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express(); // Inicialização do app com express
const PORT = 3000;

// Middlewares (ponte entre diferentes aplicações)
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // Faz com que ele consiga ler os dados enviados via formulário
app.set("view engine", "ejs"); // Para fazer o render

// --- FUNÇÕES (ROTAS) ---

// 1. Listagem de Produtos
app.get("/", async (req, res) => {
  try {
    const produtosDoBanco = await prisma.produto.findMany({
      orderBy: { id: "asc" },
    });
    res.render("index", { listaProdutos: produtosDoBanco });
  } catch (erro) {
    console.log("Erro ao puxar dados do banco:", erro);
    res.status(500).send("Erro ao buscar os dados do banco");
  }
});

// 2. Mostrar Formulário de Cadastro
app.get("/cadastrar", (req, res) => {
  res.render("formCadastro");
});

// 3. Criar Produto no Banco
app.post("/produtos", async (req, res) => {
  const { nome, preco } = req.body;
  try {
    await prisma.produto.create({
      data: {
        nome: nome,
        preco: parseFloat(preco),
      },
    });
    res.redirect("/");
  } catch (erro) {
    console.log("Erro ao salvar no banco:", erro);
    res.status(500).send("Erro ao tentar salvar no banco de dados");
  }
});

// 4. Mostrar Formulário de Edição
app.get("/editar/:id", async (req, res) => {
  const idEdita = parseInt(req.params.id);
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: idEdita }
    });
    if (produto) {
      res.render("editar", { produto: produto });
    } else {
      res.status(404).send("Produto não foi encontrado");
    }
  } catch (erro) {
    console.log("Erro ao buscar para editar:", erro);
    res.status(500).send("Erro ao buscar produto");
  }
});

// 5. Atualizar Produto no Banco
app.put("/produtos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco } = req.body;
  try {
    await prisma.produto.update({
      where: { id: id },
      data: {
        nome: nome,
        preco: parseFloat(preco),
      }
    });
    res.redirect("/");
  } catch (erro) {
    console.log("Erro ao atualizar:", erro);
    res.status(404).send("Produto não encontrado ou erro ao atualizar");
  }
});

// 6. Deletar Produto no Banco
app.delete("/produtos/:id", async (req, res) => {
  const idDelete = parseInt(req.params.id);
  try {
    await prisma.produto.delete({
      where: { id: idDelete }
    });
    res.redirect("/");
  } catch (erro) {
    console.log("Erro ao deletar:", erro);
    res.status(500).send("Erro ao deletar produto");
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Rodando liso na porta ${PORT}`);
});