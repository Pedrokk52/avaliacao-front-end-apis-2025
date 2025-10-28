const url = 'https://dummyjson.com/auth/';

// Redireciona automaticamente se já estiver logado
async function direcionamento() {
    if (await validaToken()) {
        window.location.href = 'posts.html';
    } else {
        localStorage.removeItem('usuario');
    }
}

direcionamento();

// Evento de login
const forms = document.querySelector('form');
forms.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = forms.username.value;
    const password = forms.password.value;

    // Login fixo
    const usuarioValido = "DinhoSenai@gmail.com";
    const senhaValida = "123456";

    if (username === usuarioValido && password === senhaValida) {
        // Cria dados simulados no mesmo formato que o DummyJSON retornaria
        const data = {
            id: 1,
            username: username,
            accessToken: "token-falso-" + Date.now(),
            expiresInMins: 5
        };
        localStorage.setItem('usuario', JSON.stringify(data));
        console.log("Login bem-sucedido:", data);
        window.location.href = "posts.html";
    } else {
        alert("Dados de email e senha não conferem");
    }
});

// Valida o token salvo localmente
async function validaToken() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let result = false;

    if (usuario && usuario.accessToken) {
        // Simulação: o token expira após 5 minutos
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
