const mysql = require("../mysql").pool;

exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, coon) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    coon.query(
      `SELECT pedidos.id_pedido, pedidos.quantidade, produtos.id_produto,produtos.nome,produtos.preco
                  FROM pedidos
                  INNER JOIN produtos
                  ON produtos.id_produto = pedidos.id_produto`,
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedido,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco,
              },
              request: {
                tipo: "GET",
                descricao: "Retorna um pedido especifico",
                url: "http://localhost:3000/pedidos/" + pedido.id_pedido,
              },
            };
          }),
        };
        res.status(200).send(response);
      }
    );
  });
};

exports.postPedidos = (req, res, next) => {
  mysql.getConnection((error, coon) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    coon.query(
      "SELECT * FROM produtos WHERE id_produto = ?",
      [req.body.id_produto],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length === 0) {
          return res.status(404).send({ mensagem: "Produto não encontrado!" });
        }
      }
    );
    coon.query(
      "INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)",
      [req.body.id_produto, req.body.quantidade],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        coon.release();
        const response = {
          mensagem: "Pedido criado com sucesso",
          pedidoCriado: {
            id_pedido: result.id_pedido,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos",
            },
          },
        };
        res.status(201).send(response);
      }
    );
  });
};

exports.getOnePedido = (req, res, next) => {
  mysql.getConnection((error, coon) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    coon.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [req.params.id_pedido],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (result.length === 0) {
          return res.status(404).send({ mensagem: "Pedido não existe" });
        }
        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/pedidos/",
            },
          },
        };
        res.status(200).send(response);
      }
    );
  });
};
exports.deletePedido = (req, res, next) => {
  mysql.getConnection((error, coon) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    coon.query(
      "DELETE FROM pedidos WHERE id_pedido = ?",
      [req.body.id_pedido],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: "Produto excluido com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um pedido",
            url: "localhost:3000/produtos",
            body: {
              id_pedido: "Int",
              id_produto: "Int",
              quantidade: "Int",
            },
          },
        };
        return res.status(202).send(response);
      }
    );
  });
};
