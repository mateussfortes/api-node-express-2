import livros from "../models/Livro.js";

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

  static listarLivroPorEditora = (req, res) => {
    const editora = req.query.editora;

    livros.find({"editora": editora}, {}, (err, livros) => {
      res.status(200).send(livros);

    });
  };



}

export default LivroController;