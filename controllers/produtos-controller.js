const mysql = require("../mysql").pool;


exports.getAllProdutos = (req, res, next) => {
  mysql.getConnection((error, coon) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    coon.query("SELECT * FROM produtos", (error, result, fields) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      const response = {
        quantidade: result.length,
        produtos: result.map((prod) => {
          return {
            id_produto: prod.id_produto,
            nome: prod.nome,
            preco: prod.preco,
            imagem: prod.imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna produto especifico!",
              url: "localhost:3000/produtos/" + prod.id_produto,
            },
          };
        }),
      };
      return res.status(200).send(response);
    });
  });
};

exports.postProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "INSERT INTO produtos (nome, preco,imagem_produto) values (?,?,?) ",
      [req.body.nome, req.body.preco, req.file.path],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({
            error: error,
            response: null,
          });
        }
        const response = {
          mensagem: "Produto inserido com sucesso!",
          produtoCriado: {
            id_produto: result.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            imagem: req.file.path,
            request: {
              tipo: "POST",
              descricao: "Cria um produto",
              url: "localhost:3000/produtos",
            },
          },
        };
        return res.status(201).send(response);
      }
    );
  });
};

exports.getOneProduto = (req, res, next) => {
    mysql.getConnection((error, coon) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      coon.query(
        "SELECT * FROM produtos WHERE id_produto = ?",
        [req.params.id_produto],
        (error, result, fields) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          if (result.length === 0) {
            return res
              .status(404)
              .send({ mensagem: "Não foi encontrado produto com este ID" });
          }
  
          const response = {
            quantidade: result.length,
            produto: {
              id_produto: result[0].id_produto,
              nome: result[0].nome,
              preco: result[0].preco,
              imagem :result[0].imagem_produto,
              request: {
                tipo: "GET",
                descricao: "Retorna todos os produtos",
                url: "localhost:3000/produtos",
              },
            },
          };
          return res.status(200).send(response);
        }
      );
    });
  }

  exports.updateProduto = (req, res, next) => {
    mysql.getConnection((error, coon) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      coon.query(
        `
        UPDATE produtos 
           SET nome = ?,
           preco    = ? 
        WHERE id_produto = ?    
      `,
        [req.body.nome, req.body.preco, req.body.id_produto],
        (error, result, fields) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
  
          const response = {
            mensagem: "Produto atualizado com sucesso!",
            produtoAtualizado: {
              id_produto: req.body.id_produto,
              nome: req.body.nome,
              preco: req.body.preco,
              request: {
                tipo: "GET",
                descricao: "Retorna produto especifico!",
                url: "localhost:3000/produtos/" + req.body.id_produto,
              },
            },
          };
          return res.status(202).send(response);
        }
      );
    });
  };

  exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, coon) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      coon.query(
        "DELETE FROM produtos WHERE id_produto = ?",
        [req.body.id_produto],
        (error, result, fields) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          const response = {
            mensagem: "Produto excluido com sucesso",
            request: {
              tipo: "POST",
              descricao: "Insere um produto",
              url: "localhost:3000/produtos",
              body: {
                nome: "String",
                preco: "Number",
              },
            },
          };
          return res.status(202).send(response);
        }
      );
    });
  }


