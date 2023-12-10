function escolher() {
    
    let inputTexto = document.querySelector('[name=texto]');
    let texto = inputTexto.value;
    let inputdata = document.querySelector('[name=data]');
    let data = inputdata.value;
    let inputAutor = document.querySelector('[name=autor]');
    let autor = inputAutor.value;
    let inputId = document.querySelector('[name=id]');
    let id = parseInt(inputId.value);
    
    let frase = {
        data, texto, autor
    }

    if (id == 0) {
        inserir_(frase);
    }
    
    else {
        editar(frase, id);
    }
}
let traducoes = {
    'pt-BR': {
        'mensagem_senha_em_branco': 'A senha não pode ser em branco!',
        'mensagem_frase_cadastrado': 'Frase cadastrada com sucesso!',
        'mensagem_frase_apagado': 'Frase apagada com sucesso!'
    },
    'en': {
        'mensagem_senha_em_branco': 'Password cannot be empty!'
    }
}

async function inserir_() {
    /* alert('inserir'); */
    let data = document.querySelector('[name=data]').value;
    let autor = document.querySelector('[name=autor]').value;
    let texto = document.querySelector('[name=texto]').value;
    console.log('inserindo');
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams({data, autor, texto});
    console.log(dados);
    let resposta = await fetch('frases', {
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

    let divFrases = document.querySelector('#frases');
    divFrases.innerText = 'Carregando...'
    let resposta = await fetch('frases');
    let frases = await resposta.json();
    divFrases.innerHTML = '';
    for (let frase of frases) {
        let linha = document.createElement('tr');
        let colunaId = document.createElement('td');
        let colunaData = document.createElement('td');
        let colunaFrase = document.createElement('td');
        let colunaAutor = document.createElement('td');
        let colunaAcoes = document.createElement('td');
        let botaoEditar = document.createElement('button');
        let botaoApagar = document.createElement('button');
        colunaId.innerText = frase.id;
        colunaData.innerText = frase.data_;
        colunaFrase.innerText = frase.texto;
        colunaAutor.innerText = frase.autor;
           
        botaoEditar.innerText = 'Editar';
        botaoEditar.onclick = function () {
            formEditar(frase.id);
        }
        botaoApagar.onclick = function () {
            apagar(frase.id);
        }
        botaoApagar.innerText = 'Apagar';
        linha.appendChild(colunaId);
        linha.appendChild(colunaData);
        linha.appendChild(colunaFrase);
        linha.appendChild(colunaAutor);
        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoApagar);
        linha.appendChild(colunaAcoes);
        divFrases.appendChild(linha);
    }
}

async function formEditar(id) {
    let resposta = await fetch('frase/' + id, {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });
    let frase = await resposta.json();
    console.log(frase);
    let inputData = document.querySelector('[name=data]');
    inputData.value = frase.data;
    let inputAutor = document.querySelector('[name=autor]');
    inputAutor.value = frase.autor;
    let inputTexto = document.querySelector('[name=texto]');
    inputTexto.value = frase.texto;
    let inputId = document.querySelector('[name=id]');
    inputId.value = frase.id;
}

async function editar(frase, id) {
    let divResposta = document.querySelector('#resposta');
    let dados = new URLSearchParams(frase);
    let resposta = await fetch('frases/' + id, {
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
        let resposta = await fetch('frases/' + id, {
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

