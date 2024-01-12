import { livros, autores } from "../models/index.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find()
        .populate("autor")
        .exec();

      res.status(200).json(livrosResultado);

    }
    catch(erro) {
      next(erro);
    }
    
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livrosResultados = await livros.findById(id)
        .populate("autor", "nome")
        .exec();
      res.status(200).send(livrosResultados);
    }
    catch(erro) {
      next(erro);
    }

  };

  static cadastrarLivro = async (req, res, next) => {

    try {
      let livro = new livros(req.body);
      const livroCadastrado = await livro.save();
      res.status(201).send(livroCadastrado.toJSON());
    }
    catch(erro) {
      next(erro);
    }
    
  };

  static atualizarLivro = async (req, res, next) => {

    try {
      const id = req.params.id;
      await livros.findByIdAndUpdate(id, {$set: req.body});
      res.status(200).send({message: "Livro atualizado com sucesso"});
    }
    catch(erro) {
      next(erro);
    }
    
  };

  static excluirLivro = async (req, res, next) => {

    try {
      const id = req.params.id;
      await livros.findByIdAndDelete(id);
      res.status(200).send({message: "Livro deletado com sucesso"});
    }
    catch(erro) {
      next(erro);
    }
    
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {

      const busca = await processaBusca(req.query);

      if(busca !== null) {
        const livrosResultado = await livros
          .find(busca)
          .populate("autor");
  
        res.status(200).send(livrosResultado);
      }     
      else {
        res.status(200).send([]);
      }

    }
    catch (erro) {
      next(erro);
    }    
  };

}

async function processaBusca(params) {

  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = params;

  let busca = {};

  if(editora) busca.editora = editora;
  if(titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if(minPaginas || maxPaginas) busca.numeroPaginas = {};

  if(minPaginas) busca.numeroPaginas.$gte = minPaginas;
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if(nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if(autor !== null) {
      busca.autor = autor._id;
    }
    else {
      busca = null;
    }

  }

  return busca;

}

export default LivroController;