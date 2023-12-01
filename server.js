const http = require('http');// importa o http responsável por criar o servidor
const port = process.env.PORT || 3000; // cria a porta 
const app = require('./app');
const server = http.createServer(app);
server.listen(port);