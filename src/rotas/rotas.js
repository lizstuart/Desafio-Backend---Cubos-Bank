const express = require('express');
const { criarConta, listarContas, atualizarUsuario, depositarValor, deletarConta, sacarValor, mostrarSaldo, fazerTranferencia, mostrarExtrato } = require('../controladores/contas');
const senha = require('../controladores/senha')


const roteador = express();

roteador.post('/contas', criarConta);
roteador.get('/contas', senha, listarContas);
roteador.put('/contas/:numeroConta/usuario', atualizarUsuario);
roteador.delete('/contas/:numeroConta', deletarConta);
roteador.post('/transacoes/depositar', depositarValor);
roteador.post('/transacoes/sacar', sacarValor);
roteador.get('/contas/saldo', mostrarSaldo);
roteador.post('/transacoes/transferir', fazerTranferencia);
roteador.get('/contas/extrato', mostrarExtrato)

module.exports = roteador