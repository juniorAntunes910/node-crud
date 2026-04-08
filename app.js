const express = require('express');
const app = express();
const PORT = 3000;


app.set('view engine', 'ejs')//Config ejs

let produtos = [
    {id: 1, nome: "prod1", preco: 144 },
    {id: 2, nome: "prod2", preco: 1334 }
]




app.get('/', (req, res) => {
    res.render('index', { listaProdutos: produtos})
});

app.get('/cadastrar', (req, res) => {
    res.render('formCadastro', {})
})

app.use(express.urlencoded({extended: true})); // Recebe os dados do formulario pq senao chega tudo com undefined 


app.post('/produtos', (req, res) => {
    
    const { nome, preco } = req.body;

    const novoProduto = {
        id: Date.now(),
        nome: nome,
        preco: parseFloat(preco)
    };

    produtos.push(novoProduto);

    res.redirect('/');



})

app.listen(PORT, () =>{
    console.log("Rodando");
    
})
