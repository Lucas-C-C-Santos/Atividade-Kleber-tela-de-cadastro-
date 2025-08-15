document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");
    const tabelaUsuarios = document.getElementById("tabelaUsuarios");

    // Carrega usuários ao abrir a página
    carregarUsuarios();

    // Impede recarregamento e envia para o servidor
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const resposta = await fetch("/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha })
            });

            const novoUsuario = await resposta.json();

            // Adiciona novo usuário instantaneamente na tabela
            adicionarUsuarioNaTabela(novoUsuario);

            // Limpa o formulário
            form.reset();
        } catch (erro) {
            console.error("Erro ao cadastrar:", erro);
        }
    });

    // Função para carregar usuários
    async function carregarUsuarios() {
        try {
            const resposta = await fetch("/usuarios");
            const usuarios = await resposta.json();
            tabelaUsuarios.innerHTML = "";
            usuarios.forEach(adicionarUsuarioNaTabela);
        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
        }
    }

    // Função para adicionar usuário na tabela
    function adicionarUsuarioNaTabela(usuario) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
        `;
        tabelaUsuarios.appendChild(row);
    }
});
