const utils = require("../lib/utils")

class AutorController {
    autor(req, res) {
        let autor = {
            nome: 'Thiago Cadore Vale',
            formacoes: [
                'Ciências Militares',
                'Estudante do curso de Informatica para internet'
            ]
        }

        utils.renderizarEjs(res, './views/autor.ejs', autor);
    }
}
module.exports = AutorController;