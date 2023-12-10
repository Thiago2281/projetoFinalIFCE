const Usuario = require("./usuario")
const bcrypt = require('bcrypt')

class UsuariosMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar() {
        return new Promise((resolve, reject) => {
            this.pool.query('SELECT usuarios.id, usuarios.nome, usuarios.senha, papeis.nome AS papel FROM usuarios JOIN papeis ON usuarios.id_papel = papeis.id;', function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let usuarios = linhas.map(linha => {
                    let { id, nome, senha, papel } = linha;
                    return new Usuario(nome, senha, papel, id);
                })
                resolve(usuarios);
            });
        });
    }

    inserir(usuario) {
        this.validar(usuario);
        usuario.senha = bcrypt.hashSync(usuario.senha, 10);
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO usuarios (nome, senha, id_papel) VALUES (?, ?, ?);`;
            console.log({sql}, usuario);
            this.pool.query(sql, [usuario.nome, usuario.senha, usuario.papel], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });  
    }

    alterar(id, usuario) {
        this.validar(usuario);
        console.log(usuario);
        console.log(id);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE usuarios SET nome=?, senha=?, id_papel=? WHERE id=?;';
            this.pool.query(sql, [usuario.nome, usuario.senha, usuario.id_papel, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM usuarios WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(usuario) {
        if (usuario.nome == '') {
            throw new Error('mensagem_nome_em_branco');
        }
        if (!usuario.senha) {
            throw new Error('mensagem_senha_em_branco');
        }
        if (!usuario.papel) {
            throw new Error('mensagem_papel_em_branco');
        }
    }
    autenticar(nome, senha) {
        return new Promise((resolve, reject) => {
            console.log('autenticar');
            console.log({senha});
            let sql = `SELECT usuarios.id, usuarios.nome, usuarios.senha, papeis.nome AS papel FROM usuarios JOIN papeis ON usuarios.id_papel = papeis.id WHERE usuarios.nome=?`;           
            this.pool.query(sql, [nome, senha], function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                console.log({linhas});
                for (let linha of linhas) {
                    console.log('autenticar', senha, linha);
                    if (bcrypt.compareSync(senha, linha.senha)) {                        

                        return resolve(new Usuario(linha.nome, linha.senha, linha.papel));
                    }
                }
                return resolve(null);
            });
        });
    }
}

module.exports = UsuariosMysqlDao;