document.getElementById("cadastroForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const response = await fetch("/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }

        const data = await response.json();
        alert("Usuário cadastrado com sucesso!");

        document.getElementById("cadastroForm").reset();
    } catch (error) {
        console.error("Erro:", error);
        alert("Falha ao cadastrar usuário.");
    }
});

async function carregarUsuarios() {
    try {
        const response = await fetch("/usuarios");
        if (!response.ok) throw new Error("Erro ao buscar usuários");

        const usuarios = await response.json();
        const tabela = document.getElementById("tabelaUsuarios");

        tabela.innerHTML = "";
        usuarios.forEach(u => {
            tabela.innerHTML += `<tr><td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td></tr>`;
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}
