class Funcionario {
  constructor(id, nome, idade, cargo, salario) {
    this._id = id;
    this._nome = nome;
    this._idade = Number(idade);
    this._cargo = cargo;
    this._salario = Number(salario);
  }
  get id() {
    return this._id;
  }
  get nome() {
    return this._nome;
  }
  get idade() {
    return this._idade;
  }
  get cargo() {
    return this._cargo;
  }
  get salario() {
    return this._salario;
  }
  set nome(v) {
    this._nome = v;
  }
  set idade(v) {
    this._idade = Number(v);
  }
  set cargo(v) {
    this._cargo = v;
  }
  set salario(v) {
    this._salario = Number(v);
  }
}


const $ = (id) => document.getElementById(id);
const form = $("form"),
  tbody = $("tbody"),
  rel = $("relatorios");
let seq = 1,
  editId = null,
  funcionarios = [];


function renderTabela() {
  tbody.innerHTML = "";
  funcionarios.forEach((f) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f.id}</td>
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>R$ ${f.salario.toFixed(2)}</td>
      <td>
        <button data-editar="${f.id}">Editar</button>
        <button data-excluir="${f.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


function limpaRel() {
  rel.innerHTML = "";
}
function addLi(txt) {
  const li = document.createElement("li");
  li.textContent = txt;
  rel.appendChild(li);
}

function relSalariosMaior5k() {
  limpaRel();
  const lista = funcionarios
    .filter((f) => f.salario > 5000)
    .map((f) => `${f.nome} - R$ ${f.salario.toFixed(2)}`);
  addLi(
    lista.length ? lista.join(" | ") : "Nenhum funcionário com salário > 5000."
  );
}
function relMediaSalarial() {
  limpaRel();
  const media = funcionarios.length
    ? (
        funcionarios.reduce((a, f) => a + f.salario, 0) / funcionarios.length
      ).toFixed(2)
    : "0.00";
  addLi(`Média salarial: R$ ${media}`);
}
function relMediaIdades() {
  limpaRel();
  const media = funcionarios.length
    ? (
        funcionarios.reduce((a, f) => a + f.idade, 0) / funcionarios.length
      ).toFixed(1)
    : "0.0";
  addLi(`Média das idades: ${media}`);
}
function relNomesAZ() {
  limpaRel();
  const nomes = funcionarios
    .map((f) => f.nome)
    .sort((a, b) => a.localeCompare(b));
  addLi(nomes.length ? nomes.join(", ") : "Sem nomes cadastrados.");
}
function relQuantidadePorCargo() {
  limpaRel();
  const cont = funcionarios.reduce((acc, f) => {
    acc[f.cargo] = (acc[f.cargo] || 0) + 1;
    return acc;
  }, {});
  if (Object.keys(cont).length === 0) {
    addLi("Nenhum cargo cadastrado.");
    return;
  }
  Object.entries(cont).forEach(([cargo, qtd]) => addLi(`${cargo}: ${qtd}`));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nome = $("nome").value.trim();
  const idade = $("idade").value;
  const cargo = $("cargo").value.trim();
  const salario = $("salario").value;

  if (!nome || !cargo) return;

  if (editId === null) {
    funcionarios.push(new Funcionario(seq++, nome, idade, cargo, salario));
  } else {
    const f = funcionarios.find((x) => x.id === editId);
    if (f) {
      f.nome = nome;
      f.idade = idade;
      f.cargo = cargo;
      f.salario = salario;
    }
    editId = null;
  }
  form.reset();
  renderTabela();
});

$("cancelar").onclick = function () {
  editId = null;
  form.reset();
};

tbody.addEventListener("click", function (e) {
  const idEditar = e.target.getAttribute("data-editar");
  const idExcluir = e.target.getAttribute("data-excluir");

  if (idEditar) {
    const f = funcionarios.find((x) => x.id === Number(idEditar));
    if (!f) return;
    editId = f.id;
    $("nome").value = f.nome;
    $("idade").value = f.idade;
    $("cargo").value = f.cargo;
    $("salario").value = f.salario;
  }

  if (idExcluir) {
    const id = Number(idExcluir);
    funcionarios = funcionarios.filter((x) => x.id !== id);
    if (editId === id) {
      editId = null;
      form.reset();
    }
    renderTabela();
  }
});


$("btnMaior5k").onclick = relSalariosMaior5k;
$("btnMediaSalarial").onclick = relMediaSalarial;
$("btnMediaIdades").onclick = relMediaIdades;
$("btnNomesAZ").onclick = relNomesAZ;
$("btnQtdCargo").onclick = relQuantidadePorCargo;


renderTabela();
