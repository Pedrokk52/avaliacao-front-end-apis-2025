const urlDummy = 'https://dummyjson.com/auth/';
const urlPlaceholder = 'https://jsonplaceholder.typicode.com/';
var posts = [];

// Redireciona para a página de login se o token não for válido
async function direcionamento() {
    if (!await validaToken()) {
        localStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

// Função principal que inicia a página
async function inicio() {
    await direcionamento();
    await carregarPosts();
    renderizarPosts(posts);
}
inicio();

// Revalida o token a cada 5 segundos
setInterval(() => {
    direcionamento();
}, 5000);

// Valida o token do usuário logado (compatível com o login.js local)
async function validaToken() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let result = false;

    if (usuario && usuario.accessToken) {
        // Token simulado válido por 5 minutos
        const tempoAtual = Date.now();
        const partes = usuario.accessToken.split("-");
        const tempoCriacao = parseInt(partes[2] || 0);
        const expiracao = 5 * 60 * 1000; // 5 minutos

        if (tempoAtual - tempoCriacao < expiracao) {
            result = true;
        }
    }

    return result;
}

// Botão de sair
function sair() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

// Carrega os posts da API pública
async function carregarPosts() {
    const response = await fetch(urlPlaceholder + 'posts');
    const data = await response.json();
    posts = data;
}

// Renderiza os posts na tela
function renderizarPosts(dados) {
    const main = document.querySelector('main');
    main.innerHTML = ''; 

    dados.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
            <button onclick='abrirModalDetalhes(${post.id})'>Detalhes</button>
        `;
        main.appendChild(postElement);
    });
}

// Função de busca
function buscarPosts(query) {
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) || 
        post.body.toLowerCase().includes(query.toLowerCase())
    );
    renderizarPosts(filteredPosts);
}

// Abre modal com detalhes do post
function abrirModalDetalhes(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const modal = document.getElementById('modal');
        modal.classList.remove('oculto');
        const dados = document.getElementById('post-details');
        dados.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p>Autor: ${post.userId}</p>
        `;
    }
}

// Fecha o modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('oculto');
}
