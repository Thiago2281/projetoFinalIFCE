const Frase = require("./frase")
const bcrypt = require('bcrypt')

class FrasesMysqlDao {
    constructor(pool) {
        this.pool = pool;
    }
    listar(pagina) {
        return new Promise((resolve, reject) => {
            let limite="";
            if (pagina) {
                let offset= (pagina+4);
                console.log({offset});
                let registrosPorPagina=4;
                limite=` limit ${offset}, ${registrosPorPagina}`
            }
            this.pool.query(`SELECT *, DATE_FORMAT(data_,'%d/%m/%Y') AS data_ FROM frases${limite}`, function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let frases = linhas /*.map(linha => {
                    let { id, nome, lado } = linha;
                    return new Frase(nome, lado, id);
                })*/
                resolve(frases);
            });
        });
    }

    inserir(frase) {
        this.validar(frase);

        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO frases (data_, autor, texto) VALUES (?, ?, ?);';
            console.log({sql}, frase);
            this.pool.query(sql, [frase.data, frase.autor, frase.texto], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.insertId);
            });
        });
    }

    alterar(id, frase) {
        this.validar(frase);
        return new Promise((resolve, reject) => {
            let sql = 'UPDATE frases SET data_=?, autor=?, texto=? WHERE id=?;';
            this.pool.query(sql, [frase.data, frase.autor, frase.texto, id], function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.alterId);
            });
        });
    }

    ver (id) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM frases WHERE id=?;';
            this.pool.query(sql, id, function (error, linhas, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                let frases = linhas.map(linha => {
                    let { id, data, autor, texto } = linha;
                    return new Frase(data, autor, texto, id);
                })
                resolve(frases[0]);
            });
        });
    }

    apagar(id) {
        return new Promise((resolve, reject) => {
            let sql = 'DELETE FROM frases WHERE id=?;';
            this.pool.query(sql, id, function (error, resultado, fields) {
                if (error) {
                    return reject('Erro: ' + error.message);
                }
                return resolve(resultado.deleteId);
            });
        });
    }

    validar(frase) {
        if (frase.data == '') {
            throw new Error('mensagem_data_em_branco');
        }
        if (frase.autor == '') {
            throw new Error('mensagem_autor_em_branco');
        }
        if (frase.texto == '') {
            throw new Error('mensagem_texto_em_branco');
        }
    }
    
    autenticar(nome, senha) {
        for (let frase of this.listar()) {
            if (frase.nome == nome && bcrypt.compareSync(senha, frase.senha)) {
                return frase;
            }
        }
        return null;
    }

}

module.exports = FrasesMysqlDao;