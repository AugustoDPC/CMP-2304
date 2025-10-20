// ===== 1) Modelo: Classe Aluno =====
class Aluno {
  constructor(nome, idade, curso, notaFinal) {
    this.nome = nome;
    this.idade = Number(idade);
    this.curso = curso;
    this.notaFinal = Number(notaFinal);
  }
  isAprovado() {
    return this.notaFinal >= 7;
  }
  toString() {
    return `${this.nome} (${this.curso}) - Nota: ${this.notaFinal} - ${
      this.isAprovado() ? "Aprovado" : "Reprovado"
    }`;
  }
}

// ===== 2) Estado da aplicação (em memória) =====
let alunos = []; // array de Aluno
let indiceEdicao = -1; // -1 significa "modo cadastro", >=0 é "editando"

// ===== 3) Referências aos elementos =====
const form = document.getElementById("form-aluno");
const inputNome = document.getElementById("nome");
const inputIdade = document.getElementById("idade");
const selectCurso = document.getElementById("curso");
const inputNota = document.getElementById("nota");

const tbody = document.getElementById("tbody-alunos");

const btnSalvar = document.querySelector('button[type="submit"]');
const btnCancelar = document.getElementById("cancelar-edicao");

const btnAprovados = document.getElementById("rel-aprovados");
const btnMediaNotas = document.getElementById("rel-media-notas");
const btnMediaIdades = document.getElementById("rel-media-idades");
const btnNomesOrdem = document.getElementById("rel-nomes-ordem");
const btnQtdPorCurso = document.getElementById("rel-qtd-por-curso");
const saidaRelatorio = document.getElementById("saida-relatorios");

// ===== 4) Funções utilitárias =====
const limparFormulario = () => {
  form.reset();
  indiceEdicao = -1;
  btnSalvar.textContent = "Cadastrar";
  btnCancelar.style.display = "none";
};

const preencherFormulario = (aluno) => {
  inputNome.value = aluno.nome;
  inputIdade.value = aluno.idade;
  selectCurso.value = aluno.curso;
  inputNota.value = aluno.notaFinal;
  btnSalvar.textContent = "Salvar edição";
  btnCancelar.style.display = "inline-block";
};

const renderizarTabela = () => {
  tbody.innerHTML = "";

  if (alunos.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="7" style="text-align:center;">Nenhum aluno cadastrado.</td>`;
    tbody.appendChild(tr);
    return;
  }

  alunos.forEach((aluno, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${aluno.nome}</td>
      <td>${aluno.idade}</td>
      <td>${aluno.curso}</td>
      <td>${aluno.notaFinal}</td>
      <td>${aluno.isAprovado() ? "Sim" : "Não"}</td>
      <td>
        <button data-acao="editar" data-idx="${idx}">Editar</button>
        <button data-acao="excluir" data-idx="${idx}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// ===== 5) Eventos do formulário (CRUD) =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = inputNome.value.trim();
  const idade = inputIdade.value;
  const curso = selectCurso.value;
  const notaFinal = inputNota.value;

  if (!nome) {
    alert("Digite o nome.");
    return;
  }

  const novo = new Aluno(nome, idade, curso, notaFinal);

  if (indiceEdicao === -1) {
    // CREATE
    alunos.push(novo);
    console.log("Aluno cadastrado!", novo);
    alert("Aluno cadastrado!");
  } else {
    // UPDATE
    alunos[indiceEdicao] = novo;
    console.log("Aluno editado:", alunos[indiceEdicao]);
    alert("Aluno atualizado!");
  }

  limparFormulario();
  renderizarTabela();
});

// Botão cancelar edição
btnCancelar.addEventListener("click", () => {
  limparFormulario();
});

// Delegação de eventos na tabela (Editar/Excluir)
tbody.addEventListener("click", (e) => {
  const botao = e.target;
  const acao = botao.getAttribute("data-acao");
  const idx = Number(botao.getAttribute("data-idx"));

  if (acao === "editar") {
    indiceEdicao = idx;
    preencherFormulario(alunos[idx]);
    console.log("Editando aluno:", alunos[idx]);
  }

  if (acao === "excluir") {
    const removido = alunos.splice(idx, 1);
    console.log("Aluno excluído:", removido[0]);
    alert(`Aluno excluído: ${removido[0].nome}`);
    renderizarTabela();
  }
});

// ===== 6) Relatórios (filter, map, reduce, sort) =====
btnAprovados.addEventListener("click", () => {
  const aprovados = alunos.filter((a) => a.isAprovado());
  saidaRelatorio.textContent = aprovados.length
    ? aprovados.map((a) => a.toString()).join("\n")
    : "Nenhum aluno aprovado.";
});

btnMediaNotas.addEventListener("click", () => {
  if (alunos.length === 0) {
    saidaRelatorio.textContent = "Sem dados.";
    return;
  }
  const media = alunos.reduce((acc, a) => acc + a.notaFinal, 0) / alunos.length;
  saidaRelatorio.textContent = `Média das notas: ${media.toFixed(2)}`;
});

btnMediaIdades.addEventListener("click", () => {
  if (alunos.length === 0) {
    saidaRelatorio.textContent = "Sem dados.";
    return;
  }
  const media = alunos.reduce((acc, a) => acc + a.idade, 0) / alunos.length;
  saidaRelatorio.textContent = `Média das idades: ${media.toFixed(2)}`;
});

btnNomesOrdem.addEventListener("click", () => {
  const nomesOrdenados = alunos
    .map((a) => a.nome)
    .sort((a, b) => a.localeCompare(b));
  saidaRelatorio.textContent = nomesOrdenados.length
    ? "Nomes em ordem:\n" + nomesOrdenados.join("\n")
    : "Sem dados.";
});

btnQtdPorCurso.addEventListener("click", () => {
  const contagem = alunos.reduce((acc, a) => {
    acc[a.curso] = (acc[a.curso] || 0) + 1;
    return acc;
  }, {});
  // formata saída
  const linhas = Object.entries(contagem).map(
    ([curso, qtd]) => `${curso}: ${qtd}`
  );
  saidaRelatorio.textContent = linhas.length ? linhas.join("\n") : "Sem dados.";
});

// Render inicial
renderizarTabela();
