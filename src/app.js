import express from "express";
import sql from 'mssql';

const app = express();

const config = {
    server: '1.1.1.1',
    database: 'dbTeste',
    user: 'admin',
    password: '1234',
    options: {
      trustServerCertificate: true // Para conexões com o SQL Server local, em desenvolvimento
    }
  };

app.use(express.json()); // PARA ACEITAR JSON NAS REQUISIÇÕES

app.get('/tipoFone', async (req, res) => {
    try {
      // Conectar ao SQL Server
      await sql.connect(config);
  
      // Executar consulta
      const resultado = await sql.query('SELECT * FROM TBTIPO_FONE');
  
      // Retornar resultado
      res.status(200).json(resultado.recordset);
    } catch (error) {
      console.log(error);
      res.status(500).send('Erro ao conectar ao SQL Server.');
    } finally {
      // Fechar conexão
      sql.close();
    }
  });

const livros = [
    {
        id: 1,
        titulo: "Senhor dos Aneis"
    },
    {
        id: 2,
        titulo: "O Hobbit"
    }
];

app.get('/', (req, res) => {
    res.status(200).send('Curso de Node');
});

app.get('/livros', (req, res) => {
    res.status(200).json(livros);
});

app.get('/livros/:id', (req, res) => {
    let index = buscaLivro(req.params.id);
    res.status(200).json(livros[index]);
});

app.post('/livros', (req, res) => {
    livros.push(req.body);

    res.status(201).send('Livro cadastrado com sucesso');

});

app.put('/livros/:id', (req, res) => {
    let index = buscaLivro(req.params.id);
    livros[index].titulo = req.body.titulo;

    res.status(200).json(livros);
});

app.delete('/livros/:id', (req, res) => {
    let {id} = req.params;
    let index = buscaLivro(id);
    livros[index].titulo = req.body.titulo;
    livros.splice(index, 1);

    res.status(200).send(`Livro ${id} removido com sucesso`);
});

function buscaLivro(id) {
    return livros.findIndex(livro => livro.id == id);
}

export default app; 