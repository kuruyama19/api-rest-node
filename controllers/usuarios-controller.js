const mysql = require("../mysql").pool;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsuarios = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    conn.query(query, [req.body.email], (error, results) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      if (results.length < 1) {
        return res.status(401).send({ mensagem: "Falha na autenticação!" });
      }

      bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
        if (err) {
          return res.status(401).send({ error: "Falha na autenticação!" });
        }
        if (result > 0) {
          const token = jwt.sign(
            {
              id_usuario: results[0].id_usuarios,
              email: results[0].email,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).send({
            mensagem: "Autenticado sucesso!",
            token: token,
          });
        }
        return res.status(401).send({ error: "Falha na autenticação!" });
      });
    });
  });
};

exports.postUsuario = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email],
      (error, results) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        if (results.length > 0) {
          return res.status(409).send({ mensagem: "Usuário já existente!" });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBrypt, hash) => {
            if (errBrypt) {
              return res.status(500).send({ error: errBrypt });
            }
            conn.query(
              "INSERT INTO usuarios (email , senha) VALUES(?,?)",
              [req.body.email, hash],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                const response = {
                  mensagem: "Usuário criado!",
                  usuarioCriado: {
                    id_usuario: results.insertId,
                    email: req.body.email,
                  },
                };
                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
};
