// ==========================
// 🔹 ELEMENTOS
// ==========================
const form = document.getElementById('formAtendeAgendamento');
const statusBox = document.getElementById('status');
const select = document.getElementById('protocoloSelect');
const statusSelect = document.getElementById('statusSelect');
const inputResposta = document.getElementById('resposta');

// 🔹 CACHE
let listaAtendimentos = [];

// 🔹 WEBHOOKS
const WEBHOOK_LISTA = 'https://n8n.srv1352561.hstgr.cloud/webhook/carregaprotocolo';
const WEBHOOK_UPDATE = 'https://n8n.srv1352561.hstgr.cloud/webhook/atualizaatendimento';

// ==========================
// 🔹 CARREGAR LISTA
// ==========================
async function carregarLista() {
  try {
    const response = await fetch(WEBHOOK_LISTA);
    const data = await response.json();

    listaAtendimentos = data.slots || [];

    console.log('LISTA CARREGADA:', listaAtendimentos);

    select.innerHTML = '<option value="">Selecione um atendimento</option>';

    listaAtendimentos.forEach(item => {
      const option = document.createElement('option');
      option.value = String(item.value); // 🔴 força string
      option.textContent = item.label;
      select.appendChild(option);
    });

  } catch (error) {
    console.error(error);
  }
}

// ==========================
// 🔹 EVENTO CHANGE
// ==========================
select.addEventListener('change', () => {
  const protocoloSelecionado = String(select.value);

  console.log('Selecionado:', protocoloSelecionado);

  const atendimento = listaAtendimentos.find(
    item => String(item.value) === protocoloSelecionado
  );

  console.log('Encontrado:', atendimento);

  if (atendimento) {
    inputResposta.value = atendimento.resposta || '';
  } else {
    inputResposta.value = '';
  }
});

// ==========================
// 🔹 SUBMIT
// ==========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const protocolo = select.value;
  const status = statusSelect.value;

  if (!protocolo || !status) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    await fetch(WEBHOOK_UPDATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocolo, status })
    });

    statusBox.style.display = 'block';
    statusBox.innerHTML = '✅ Status atualizado com sucesso';

    form.reset();
    inputResposta.value = '';

    await carregarLista();

  } catch (error) {
    statusBox.style.display = 'block';
    statusBox.innerHTML = '❌ Erro ao atualizar';
  }
});

// ==========================
// 🔹 INIT
// ==========================
carregarLista();
