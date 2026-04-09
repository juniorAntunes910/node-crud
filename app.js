const express = require("express");
const app = express();
const PORT = 3000;
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.set("view engine", "ejs"); //Config ejs

app.get("/", async (req, res) => {
  try {
    const produtosDoBanco = await Prisma.produto.findMany({
      orderBy: { id: 'asc' }
    });
    res.render('index', { listaProdutos: produtosDoBanco})
  }catch(erro){
    console.log("Erro ao puxar dados do banco")
    res.status(500).send("Erro ao buscar")
  }
});

app.get("/cadastrar", (req, res) => {
  res.render("formCadastro", {});
});

app.use(express.urlencoded({ extended: true })); // Recebe os dados do formulario pq senao chega tudo com undefined

app.post("/produtos", (req, res) => {
  const { nome, preco } = req.body;

  const novoProduto = {
    id: Date.now(),
    nome: nome,
    preco: parseFloat(preco),
  };

  produtos.push(novoProduto);

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Rodando");
});

app.delete("/produtos/:id", (req, res) => {
  const idDelete = parseInt(req.params.id);
  produtos = produtos.filter((p) => p.id != idDelete);

  res.redirect("/");
});

app.get("/editar/:id", (req, res) => {
  const idEdita = parseInt(req.params.id);
  produto = produtos.find((p) => p.id === idEdita);
  if (produto) {
    res.render("editar", { produto: produto });
  } else {
    res.status(404).send("Produto nao foi encontrado");
  }
});

app.put("/produtos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco } = req.body;

  const index = produtos.findIndex((p) => p.id === id);

  if (index !== -1) {
    produtos[index] = {
      id: id,
      nome: nome,
      preco: parseFloat(preco),
    };
    res.redirect("/");
  } else {
    res.status(404).send("Produto não encontrado");
  }
});


app.post('/produtos', async (req, res) => {
  const { nome, preco} = req.body;

  try{
    await Prisma.produto.create({
      nome: nome,
      preco: preco
    });
    res.redirect('/')
  }catch(erro){
    console.log("Erro ao salvar no banco de dados ", erro)
    res.status(500).send("Erro ao tentar salvar um produto ao banco de dados");
  }
})