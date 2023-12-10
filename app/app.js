const http = require('http');
const FrasesController = require('./controllers/FrasesControllers');
const EstaticoController = require('./controllers/EstaticoController');
const AutorController = require('./controllers/AutorController');
const AuthController = require('./controllers/AuthController');

const UsuariosController = require('./controllers/UsuariosControllers');

const FrasesMysqlDao = require('./lib/projeto/FrasesMysqlDao');
const UsuariosMysqlDao = require('./lib/projeto/UsuariosMysqlDao');
const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'bd',
    user            : process.env.MARIADB_USER,
    password        : process.env.MARIADB_PASSWORD,
    database        : process.env.MARIADB_DATABASE
});

let frasesDao = new FrasesMysqlDao(pool);
let usuariosDao = new UsuariosMysqlDao(pool);
let frasesController = new FrasesController(frasesDao);
let estaticoController = new EstaticoController();
let autorController = new AutorController();
let authController = new AuthController(usuariosDao);
let usuariosController = new UsuariosController(usuariosDao);

const PORT = 3000;
const server = http.createServer((req, res) => {
    req.charset = 'utf-8';
    res.charset = 'utf-8';
    let [url, querystring] = req.url.split('?');
    let urlList = url.split('/');
    url = urlList[1];
    let metodo = req.method;

    if (url=='index') {
        frasesController.index(req, res);
    }

    else if (url == 'frases' && metodo == 'GET') {
        frasesController.listar(req, res);
    }

    else if (url == 'pagina' && metodo == 'GET') {
        frasesController.pagina(req, res);
    }
    else if (url == 'frases' && metodo == 'POST') {
        frasesController.inserir(req, res);
    }
    
    else if (url == 'frases' && metodo == 'PUT') {
        frasesController.alterar(req, res);
    }
    
    else if (url == 'frases' && metodo == 'DELETE') {
        frasesController.apagar(req, res);
        }

    else if (url == 'frase' && metodo == 'GET') {
        frasesController.ver(req, res);
        }    

    else if (url == 'usuarios' && metodo == 'GET') {
        usuariosController.listar(req, res);
    }
    else if (url == 'usuarios' && metodo == 'POST') {
        usuariosController.inserir(req, res);
    }
    else if (url == 'usuarios' && metodo == 'PUT') {
        authController.autorizar(req, res, function() {
            usuariosController.alterar(req, res);
        }, ['admin', 'geral']);
    }
    else if (url == 'usuarios' && metodo == 'DELETE') {
        authController.autorizar(req, res, function() {
            usuariosController.apagar(req, res);
        }, ['admin']);
    }

    else if (url=='autor') {
        autorController.autor(req, res);    
    }

    else if (url=='carreira') {
        estaticoController.carreira(req, res);    
    }

    else if (url=='contate') {
        estaticoController.contate(req, res);    
    }

    else if (url=='cadastro') {
        authController.cadastro(req, res);    
    }
        
    else if (url=='admin') {
        authController.admin(req, res);    
    }

    else if (url == 'login') {
        authController.index(req, res);
    }
    else if (url == 'logar') {
        authController.logar(req, res);
    }    
    else {
        estaticoController.procurar(req, res);   
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});