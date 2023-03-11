const { contas, saques, depositos, transferencias } = require("../bancodedados");
const bancodedados = require('../bancodedados')
const {data,
    encontrarCPF,
    encontrarEmail,
    encontrarNumeroDaConta,
    encontrarContaParaDeletar,
    encontrarConta,
    validarInformaçoesUsuario,
    validarSenha } = require("../controladores/funções")

let numero = 1;

const criarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const dadosValidos = validarInformaçoesUsuario(nome, cpf, data_nascimento, telefone, email, senha);

    if (!dadosValidos) {
        return res.status(400).json('Os dados são obrigatórios!');
    };

    const cpfEncontrado = encontrarCPF(cpf);
    const emailEncontrado = encontrarEmail(email);

    if (cpfEncontrado || emailEncontrado) {
        return res.status(400).json('Já existe uma conta com o cpf ou e-mail informado!')
    };

    const conta = {
        numero,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    numero++;

    contas.push(conta);


    return res.status(201).json();
};

const listarContas = (req, res) => {
    return res.status(200).json(contas);
};

const atualizarUsuario = (req, res) => {
    let { numeroConta } = req.params;
    numeroConta = Number(numeroConta);
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const numeroDaContaEncontrado = encontrarNumeroDaConta(numeroConta);

    if (numeroDaContaEncontrado === -1) {
        return res.status(404).json("Conta bancária não encontada!");
    };

    if (isNaN(numeroConta)) {
        return res.status(400).json("O número da conta é inválido");
    };

    const dadosValidos = validarInformaçoesUsuario(nome, cpf, data_nascimento, telefone, email, senha);

    if (!dadosValidos) {
        return res.status(400).json('Os dados são obrigatórios!');
    };

    const cpfEncontrado = encontrarCPF(cpf);

    const emailEncontrado = encontrarEmail(email);

    if (cpfEncontrado) {
        return res.status(404).json('O CPF informado já existe cadastrado!');
    };

    if (emailEncontrado) {
        return res.status(404).json('O email informado já existe cadastrado!');
    };

    const conta = {
        numero: numeroConta,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha

        }
    }

    contas.splice(numeroDaContaEncontrado, 1, conta);

    res.status(204).json();
};

const deletarConta = (req, res) => {
    let { numeroConta } = req.params;
    numeroConta = Number(numeroConta);

    if (isNaN(numeroConta)) {
        return res.status(400).json("O número da conta é inválido");
    }

    const contaEncontrada = encontrarNumeroDaConta(numeroConta);

    const contaASerDeletada = encontrarContaParaDeletar(numeroConta);

    if (contaEncontrada === -1) {
        return res.status(404).json("Conta bancária não encontada!");
    };

    if (contaASerDeletada.saldo > 0) {
        return res.status(404).json("A conta só pode ser removida se o saldo for zero!");
    };

    contas.splice(contaEncontrada, 1);

    return res.status(204).json();

};

const depositarValor = (req, res) => {
    let { numero_conta, valor } = req.body;

    const contaEncontrada = encontrarConta(Number(numero_conta));


    if (!numero_conta || !valor) {
        return res.status(400).json("O número da conta e o valor são obrigatórios!");
    };

    if (!contaEncontrada) {
        return res.status(404).json("Conta bancária não encontada!");
    };

    if (valor <= 0) {
        return res.status(404).json("O valor do depósito não pode ser menor ou igual a zero.");
    };

    contaEncontrada.saldo += valor;

    const deposito = {
        data: data(),
        numero_conta,
        valor
    }

    depositos.push(deposito);

    return res.status(201).json();
};

const sacarValor = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json('Número da conta e valor são obrigatórios!');
    }

    const senhaValida = validarSenha(senha);

    if (!senhaValida) {
        return res.status(403).json('Senha incorreta ou não informada.');
    };

    const contaEncontrada = encontrarConta(Number(numero_conta));

    if (!contaEncontrada) {
        return res.status(404).json("Conta bancária não encontada!");
    };

    if (contaEncontrada.saldo < valor) {
        return res.status(404).json(`Saque no valor de R$${valor} indisponível para saque`)
    };

    contaEncontrada.saldo -= valor;

    const saque = {
        data: data(),
        numero_conta,
        valor
    };

    saques.push(saque);

    return res.status(201).json();

};

const fazerTranferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json('Os são obrigatórios!');
    };

    let encontrarContaDestino = encontrarConta(numero_conta_destino);

    let encontrarContaOrigem = encontrarConta(numero_conta_origem);

    if (!encontrarContaDestino || !encontrarContaOrigem) {
        return res.status(404).json('Uma ou as duas contas não foram encontradas.');
    };

    const senhaValida = validarSenha(senha);

    if (!senhaValida) {
        return res.status(403).json('Senha incorreta ou não informada.');
    };

    if (encontrarContaOrigem.saldo < valor) {
        return res.status(404).json(`Saque no valor de R$${valor} indisponível para saque`);
    };

    encontrarContaOrigem.saldo -= valor;

    encontrarContaDestino.saldo += valor;

    const transferencia = {
        data: data(),
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    transferencias.push(transferencia);

    return res.status(201).json();
};

const mostrarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaEncontrada = encontrarConta(Number(numero_conta));

    if (!contaEncontrada) {
        return res.status(404).json("Conta bancária não encontada!")
    }

    const validaDaSenha = validarSenha(senha);

    if (!validaDaSenha) {
        return res.status(403).json('Senha incorreta ou não informada.');
    };

    const saldoEncontrado = {
        saldo: contaEncontrada.saldo
    };

    return res.status(200).json(saldoEncontrado);


};

const mostrarExtrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    const contaEncontrada = encontrarConta(numero_conta);
    const senhaValida = validarSenha(senha);

    const depositos = bancodedados.depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });

    const saques = bancodedados.saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });

    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta;
    });

    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;
    });


    if (!senhaValida) {
        return res.status(403).json('Senha incorreta ou não informada.');
    };

    if (!contaEncontrada) {
        return res.status(404).json('Conta não encontrada!');
    };

    return res.status(200).json({ depositos, saques, transferenciasEnviadas, transferenciasRecebidas });
};

module.exports = {
    criarConta,
    listarContas,
    atualizarUsuario,
    deletarConta,
    depositarValor,
    sacarValor,
    mostrarSaldo,
    fazerTranferencia,
    mostrarExtrato
};