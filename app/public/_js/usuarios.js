function escolher() {
    
    let inputNome = document.querySelector('[name=nome]');
    let nome = inputNome.value;
    let inputSenha = document.querySelector('[name=senha]');
    let senha = inputSenha.value;
    let inputPapel = document.querySelector('[name=papel]');
    let papel = inputPapel.value;
    let inputId = document.querySelector('[name=id]');
    let id = parseInt(inputId.value);
    
    let usuario = {
        senha, nome, papel
    }

    if (id == 0) {
        inserir_(usuario);
    }
    
    else {
        editar(usuario, id);
    }
}
let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_usuario_cadastrado': 'usuario cadastrada com sucesso!',
        'mensagem_usuario_apagado': 'usuario apagada com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!'
    }
}

async function inserir_() {
    /* alert('inserir'); */
    let senha = document.querySelector('[name=senha]').value;
    let papel = document.querySelector('[name=papel]').value;
    let nome = document.querySelector('[name=nome]').value;
    console.log('inserindo');
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams({nome, senha, papel});
    console.log({dados});
    let resposta = await fetch('usuarios', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    }
    else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function listar() {

    let divusuarios = document.querySelector('#usuarios');
    divusuarios.innerText = 'Carregando...'
    let resposta = await fetch('usuarios');
    let usuarios = await resposta.json();
    divusuarios.innerHTML = '';
    console.log({usuarios});
    for (let usuario of usuarios) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunausuario = document.createElement('td');
        let colunasenha = document.createElement('td');
        let colunapapel = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = usuario.id;
        colunausuario.innerText = usuario.nome;
        colunasenha.innerText = usuario.senha;
        colunapapel.innerText = usuario.papel;
           
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            formEditar(usuario.id);
        }
        botaoApagar.onclick = function () {
            apagar(usuario.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunausuario);
        linha.appendChild(colunasenha);
        linha.appendChild(colunapapel);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divusuarios.appendChild(linha);
    }
}

async function formEditar(id) {
    let resposta = await fetch('usuario/' + id, {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let usuario = await resposta.json();
    console.log(usuario);
    let inputSenha = document.querySelector('[name=senha]');
    inputSenha.value = usuario.senha;
    let inputPapel = document.querySelector('[name=papel]');
    inputPapel.value = usuario.papel;
    let inputNome = document.querySelector('[name=nome]');
    inputNome.value = usuario.nome;
    let inputId = document.querySelector('[name=id]');
    inputId.value = usuario.id;
}

async function editar(usuario, id) {
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(usuario);
    let resposta = await fetch('usuarios/' + id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },   
        body: dados
    });
    if (resposta.status == 200) {
        divResposta.classList.add('padrao');
        divResposta.classList.remove('npadrao');
    }
    else {
        divResposta.classList.add('npadrao');
        divResposta.classList.remove('padrao');
    }
    let respostaJson = await resposta.json();
    let mensagem = respostaJson.mensagem;
    divResposta.innerText = traducoes['pt-BR'][mensagem];
}

async function apagar(id) {
    let divResposta = document.querySelector('#resposta');
    if (confirm('Quer apagar o #' + id + '?')) {
        let resposta = await fetch('usuarios/' + id, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        });
        let respostaJson = await resposta.json();
        let mensagem = respostaJson.mensagem;
        divResposta.innerText = traducoes['pt-BR'][mensagem];
        listar();
    }
}

