const senha = (req, res, next) => {
    const { senha_banco } = req.query;

    if (senha_banco !== "Cubos123Bank") {
        return res.status(404).json('A senha do banco informada é inválida!');
    }

    next()
}

module.exports = senha;