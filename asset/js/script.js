const elementos = {
    sala: document.getElementById("sala"),
    modal: document.getElementById("modal"),
    overlay: document.getElementById("overlay"),
    listaModal: document.getElementById("listaModal"),
    listaAlunos: document.getElementById("listaAlunos"),
    inputNome: document.getElementById("inputNome"),
    listaLog: document.getElementById("listaLog"),
  };
  
  const nomesPredefinidos = ["Ana", "Bruno", "Carlos", "Daniela", "Eduardo", "Fernanda", "Gustavo", "Helena", "Arthur", "Colder", "Chico"];
  let mesaAtual = null;
  
  function criarMesa(index) {
    const mesa = document.createElement("div");
    mesa.className = "mesa";
    mesa.textContent = `Mesa ${index + 1}`;
    mesa.dataset.index = index;
    mesa.onclick = () => abrirModal(mesa);
    elementos.sala.appendChild(mesa);
  }
  
  function popularAlunos() {
    nomesPredefinidos.forEach(nome => {
      const item = document.createElement("div");
      item.className = "aluno-item";
      item.textContent = nome;
      item.onclick = () => selecionarAluno(nome);
      elementos.listaAlunos.appendChild(item);
    });
  }
  
  function abrirModal(mesa) {
    mesaAtual = mesa;
    elementos.inputNome.value = mesa.dataset.nome || "";
    elementos.modal.style.display = "flex";
    elementos.overlay.style.display = "block";
  }
  
  function fecharModal() {
    elementos.modal.style.display = "none";
    elementos.overlay.style.display = "none";
  }
  
  function abrirLista() {
    elementos.listaModal.style.display = "flex";
  }
  
  function fecharLista() {
    elementos.listaModal.style.display = "none";
  }
  
  function selecionarAluno(nome) {
    elementos.inputNome.value = nome;
    atualizarNome();
    fecharLista();
  }
  
  elementos.inputNome.addEventListener("keydown", e => {
    if (e.key === "Enter") atualizarNome();
  });
  
  function atualizarNome() {
    const novoNome = elementos.inputNome.value.trim();
    if (!mesaAtual || !novoNome) return;
  
    const mesaComMesmoNome = [...document.querySelectorAll(".mesa")]
      .find(m => m.dataset.nome === novoNome && m !== mesaAtual);
  
    if (mesaComMesmoNome) {
      const nomeAntigo = mesaAtual.dataset.nome;
      mesaComMesmoNome.dataset.nome = nomeAntigo || "";
      mesaComMesmoNome.textContent = nomeAntigo || `Mesa ${parseInt(mesaComMesmoNome.dataset.index) + 1}`;
    }
  
    mesaAtual.dataset.nome = novoNome;
    mesaAtual.textContent = novoNome;
    salvarMesas();
  }
  
  function removerAluno() {
    if (mesaAtual) {
      mesaAtual.removeAttribute("data-nome");
      mesaAtual.textContent = `Mesa ${parseInt(mesaAtual.dataset.index) + 1}`;
      salvarMesas();
    }
  }
  
  function registrarEvento(tipo) {
    if (mesaAtual?.dataset.nome) {
      const nome = mesaAtual.dataset.nome;
      const data = new Date().toLocaleString();
      const li = document.createElement("li");
      li.textContent = `${data} - ${nome}: ${tipo}`;
      elementos.listaLog.appendChild(li);
      salvarLog();
    }
  }
  
  function salvarMesas() {
    const mesas = [...document.querySelectorAll(".mesa")].map(m => ({
      index: m.dataset.index,
      nome: m.dataset.nome || ""
    }));
    localStorage.setItem("mapaMesas", JSON.stringify(mesas));
  }
  
  function carregarMesas() {
    const dados = JSON.parse(localStorage.getItem("mapaMesas")) || [];
    dados.forEach(({ index, nome }) => {
      const mesa = document.querySelector(`.mesa[data-index="${index}"]`);
      if (mesa && nome) {
        mesa.dataset.nome = nome;
        mesa.textContent = nome;
      }
    });
  }
  
  function salvarLog() {
    const logs = [...elementos.listaLog.children].map(li => li.textContent);
    localStorage.setItem("logOcorrencias", JSON.stringify(logs));
  }
  
  function carregarLog() {
    const logsSalvos = JSON.parse(localStorage.getItem("logOcorrencias")) || [];
    logsSalvos.forEach(texto => {
      const li = document.createElement("li");
      li.textContent = texto;
      elementos.listaLog.appendChild(li);
    });
  }
  
  function limparLog() {
    localStorage.removeItem("logOcorrencias");
    elementos.listaLog.innerHTML = "";
  }
  
  function salvarLogComoArquivo() {
    const logs = [...elementos.listaLog.children].map(li => li.textContent).join("\n");
    const blob = new Blob([logs], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "log_ocorrencias.txt";
    link.click();
  }

[...Array(20)].forEach((_, i) => criarMesa(i));
carregarMesas();
popularAlunos();
carregarLog();