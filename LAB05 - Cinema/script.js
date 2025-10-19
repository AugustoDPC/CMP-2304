// ---- utilidades ----
function salvar(chave, obj) {
  const lista = JSON.parse(localStorage.getItem(chave)) || [];
  lista.push(obj);
  localStorage.setItem(chave, JSON.stringify(lista));
  alert("Salvo com sucesso!");
}

function el(id) {
  return document.getElementById(id);
}

// ==========================
// CADASTRO DE FILMES
// ==========================
const formFilme = el("formFilme");
if (formFilme) {
  formFilme.onsubmit = (e) => {
    e.preventDefault();
    salvar("filmes", {
      titulo: el("titulo").value,
      descricao: el("descricao").value,
      genero: el("genero").value,
      classificacao: el("classificacao").value,
      duracao: el("duracao").value,
      estreia: el("estreia").value,
    });
    formFilme.reset();
  };
}

// ==========================
// CADASTRO DE SALAS
// ==========================
const formSala = el("formSala");
if (formSala) {
  formSala.onsubmit = (e) => {
    e.preventDefault();
    salvar("salas", {
      nome: el("nomeSala").value,
      capacidade: el("capacidade").value,
      tipo: el("tipo").value,
    });
    formSala.reset();
  };
}

// ==========================
// CADASTRO DE SESSÕES
// ==========================
const formSessao = el("formSessao");
if (formSessao) {
  const filmeSelect = el("filmeSelect");
  const salaSelect = el("salaSelect");

  const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
  const salas = JSON.parse(localStorage.getItem("salas")) || [];

  // popular selects somente se existirem
  if (filmeSelect)
    filmes.forEach((f) => {
      const op = document.createElement("option");
      op.value = f.titulo;
      op.textContent = f.titulo;
      filmeSelect.appendChild(op);
    });

  if (salaSelect)
    salas.forEach((s) => {
      const op = document.createElement("option");
      op.value = s.nome;
      op.textContent = s.nome;
      salaSelect.appendChild(op);
    });

  formSessao.onsubmit = (e) => {
    e.preventDefault();
    salvar("sessoes", {
      filme: filmeSelect.value,
      sala: salaSelect.value,
      dataHora: el("dataHora").value,
      preco: el("preco").value,
      idioma: el("idioma").value,
      formato: el("formato").value,
    });
    formSessao.reset();
  };
}

// ==========================
// VENDA DE INGRESSOS
// ==========================
const formIngresso = el("formIngresso");
if (formIngresso) {
  const sessaoSelect = el("sessaoSelect");
  const cliente = el("cliente");
  const cpf = el("cpf");
  const assento = el("assento");
  const pagamento = el("pagamento");

  // popular sessões no select
  const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
  if (sessaoSelect) {
    sessoes.forEach((s, idx) => {
      const op = document.createElement("option");
      // value pode ser o índice ou um texto; aqui deixo o texto para simplicidade
      op.value = `${s.filme} - ${s.dataHora}`;
      op.textContent = `${s.filme} - ${s.dataHora}`;
      sessaoSelect.appendChild(op);
    });
  }

  // máscara de CPF (somente nesta página)
  if (cpf) {
    cpf.addEventListener("input", () => {
      let valor = cpf.value.replace(/\D/g, "");
      if (valor.length > 11) valor = valor.slice(0, 11);
      if (valor.length > 9) {
        cpf.value = valor.replace(
          /(\d{3})(\d{3})(\d{3})(\d{0,2})/,
          "$1.$2.$3-$4"
        );
      } else if (valor.length > 6) {
        cpf.value = valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
      } else if (valor.length > 3) {
        cpf.value = valor.replace(/(\d{3})(\d+)/, "$1.$2");
      } else {
        cpf.value = valor;
      }
    });
  }

  formIngresso.onsubmit = (e) => {
    e.preventDefault();

    salvar("ingressos", {
      sessao: sessaoSelect ? sessaoSelect.value : "",
      cliente: cliente ? cliente.value : "",
      cpf: cpf ? cpf.value : "",
      assento: assento ? assento.value : "",
      pagamento: pagamento ? pagamento.value : "",
    });

    formIngresso.reset();
  };
}

// ==========================
// LISTAGEM DE SESSÕES
// ==========================
const listaSessoes = el("listaSessoes");
if (listaSessoes) {
  const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
  if (sessoes.length === 0) {
    listaSessoes.innerHTML = "<p>Nenhuma sessão cadastrada.</p>";
  } else {
    listaSessoes.innerHTML = ""; // limpa antes de preencher
    sessoes.forEach((s) => {
      const card = document.createElement("div");
      card.className = "card mb-2 p-2";
      card.innerHTML = `
        <strong>${s.filme}</strong><br>
        Sala: ${s.sala}<br>
        Data/Hora: ${s.dataHora}<br>
        Preço: R$ ${s.preco}<br>
        <a href="venda-ingressos.html" class="btn btn-sm btn-success mt-1">Comprar</a>
      `;
      listaSessoes.appendChild(card);
    });
  }
}
