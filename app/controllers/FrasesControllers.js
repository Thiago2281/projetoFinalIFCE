const Frase = require('./../lib/projeto/frase');
const utils = require('../lib/utils');

class FrasesController {
    constructor(frasesDao) {
        this.frasesDao = frasesDao;
    }
    async index(req, res) {
        let frases = await this.frasesDao.listar();
        utils.renderizarEjs(res, './views/index.ejs', {frases});  

    }

    async pagina(req, res) {
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let pagina = urlList[2];

        let frases = await this.frasesDao.listar(pagina);
        utils.renderizarEjs(res, './views/pagina.ejs', {frases, pagina});  

    }

    async listar(req, res) {
        let frases = await this.frasesDao.listar();
        utils.renderizarJSON(res, frases);
    }
    
    async inserir(req, res) {
        let frase = await this.getFraseDaRequisicao(req);
        console.log(frase);
        console.log('teste1');
        try {
            this.frasesDao.inserir(frase);
            utils.renderizarJSON(res, {
                frase,
                mensagem: 'mensagem_frase_cadastrado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }

    async ver(req, res) {
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];      
        let frase = await this.frasesDao.ver(id);
        utils.renderizarJSON(res, frase);
    }

    async alterar(req, res) {
        console.log('teste');
        let frase = await this.getFraseDaRequisicao(req);
        console.log(frase);
        let [ url, queryString ] = req.url.split('?');
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        try {
            this.frasesDao.alterar(id, frase);
            utils.renderizarJSON(res, {
                mensagem: 'mensagem_frase_alterado'
            });
        } catch (e) {
            utils.renderizarJSON(res, {
                mensagem: e.message
            }, 400);
        }
    }
    
    apagar(req, res) {
        console.log('teste');
        let [ url, queryString ] = req.url.split('?');
        console.log(url);
        let urlList = url.split('/');
        url = urlList[1];
        let id = urlList[2];
        console.log(id);
        this.frasesDao.apagar(id);
        utils.renderizarJSON(res, {
            mensagem: 'mensagem_frase_apagado',
            id: id
        });
    }

    async getFraseDaRequisicao(req) {
        let corpo = await utils.getCorpo(req);
        console.log(corpo);
        let frase = new Frase(
            corpo.data,
            corpo.autor,
            corpo.texto
        );
        return frase;
    }
}

module.exports = FrasesController;