const { format } = require('date-fns');
const { contas} = require('../bancodedados');


const data = () => {
    const data = new Date();

    return (format(data, 'yyyy-MM-dd k:m:ss'));
};

const encontrarCPF = (cpf) => {
    return contas.find((conta) => {
        return conta.usuario.cpf === cpf;
    });
};

const encontrarEmail = (email) => {
    return contas.find((conta) => {
        return conta.usuario.email === email;
    });
};

const encontrarNumeroDaConta = (numeroConta) => {
    return contas.findIndex((conta) => {
        return conta.numero === numeroConta

    })
};

const encontrarContaParaDeletar = (numeroConta) => {
    return contas.find((conta) => {
        return conta.numero === numeroConta;
    });
};

let encontrarConta = (numero_conta) => {
    return contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

};

const validarInformaçoesUsuario = (nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return false;
    };
    return true;
};

const validarSenha = (senha) => {
    if (!senha || senha !== "123456") {
        return false;
    };
    return true;
};

module.exports = {
    data,
    encontrarCPF,
    encontrarEmail,
    encontrarNumeroDaConta,
    encontrarContaParaDeletar,
    encontrarConta,
    validarInformaçoesUsuario,
    validarSenha
};