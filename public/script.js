const API_BASE = '';

function showMsg(texto, tipo = 'info') {
  const msg = document.getElementById('msg');
  if (!msg) return;
  msg.textContent = texto;
  msg.className = `msg ${tipo}`;
}

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const senha = document.getElementById('senha').value;

      if (!nome || !email || !senha) return showMsg('Preencha todos os campos.', 'error');
      if (!isEmail(email)) return showMsg('E-mail inválido.', 'error');
      if (senha.length < 6) return showMsg('A senha deve ter ao menos 6 caracteres.', 'error');

      try {
        const resp = await fetch(`${API_BASE}/usuarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email, senha })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Erro ao cadastrar.');
        showMsg('Usuário cadastrado com sucesso!', 'success');
        form.reset();
      } catch (err) {
        showMsg(err.message, 'error');
      }
    });
  }
});

let usuariosCache = [];

async function carregarUsuarios() {
  try {
    showMsg('Carregando usuários...');
    const resp = await fetch(`${API_BASE}/usuarios`);
    const data = await resp.json();
    if (!Array.isArray(data)) throw new Error('Resposta inválida.');
    usuariosCache = data;
    renderTabela(usuariosCache);
    showMsg('');
  } catch (err) {
    renderTabela([]);
    showMsg(err.message || 'Erro ao carregar usuários.', 'error');
  }
}

function renderTabela(lista) {
  const tbody = document.getElementById('tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!lista.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'Nenhum usuário encontrado.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  lista.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td>`;
    tbody.appendChild(tr);
  });
}

function aplicarFiltro(texto) {
  if (!texto) return renderTabela(usuariosCache);
  const t = texto.toLowerCase();
  const filtrados = usuariosCache.filter(u =>
    u.nome.toLowerCase().includes(t) || u.email.toLowerCase().includes(t)
  );
  renderTabela(filtrados);
}
