// main.js

(() => {
  const d = document;

  const $ra = d.getElementById("raInput"),
        $senha = d.getElementById("senhaInput"),
        $btnLogin = d.getElementById("btnLogin"),
        $ativSec = d.getElementById("atividadesSection"),
        $lista = d.getElementById("listaAtividades"),
        $tempo = d.getElementById("tempo"),
        $exec = d.getElementById("executarBtn"),
        $status = d.getElementById("statusSection"),
        $msg = d.getElementById("statusMsg");

  const tarefas = [
    "Redação sobre mudanças climáticas",
    "Exercícios de álgebra",
    "Resumo de História",
    "Mapa mental de Biologia",
    "Leitura interpretativa",
    "Análise de gráfico",
    "Correção de português",
    "Questões de filosofia"
  ];

  const rdm = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  function gerarLista() {
    $lista.innerHTML = "";
    tarefas.forEach((t, i) => {
      const id = `t${i}`;
      const el = d.createElement("label");
      el.innerHTML = `<input type="checkbox" id="${id}" checked> ${t}`;
      $lista.appendChild(el);
    });
  }

  function simularEstudo(nome, dur, pos, total) {
    return new Promise(res => {
      let restante = dur;
      const loop = setInterval(() => {
        $msg.textContent = `⌛ ${nome} (${pos}/${total}) — ${restante}s restantes...`;
        if (restante-- <= 0) {
          clearInterval(loop);
          res();
        }
      }, 1000);
    });
  }

  $btnLogin.onclick = () => {
    const ra = $ra.value.trim(),
          senha = $senha.value.trim();
    if (!ra || !senha) return alert("Preencha RA e senha");
    gerarLista();
    $ativSec.classList.remove("hidden");
    $btnLogin.disabled = true;
  };

  $exec.onclick = async () => {
    const selecionadas = Array.from($lista.querySelectorAll("input:checked"));
    if (!selecionadas.length) return alert("Selecione ao menos 1 atividade");

    const min = parseInt($tempo.value) * 60,
          max = min + 30;

    $ativSec.classList.add("hidden");
    $status.classList.remove("hidden");

    for (let i = 0; i < selecionadas.length; i++) {
      const nome = selecionadas[i].parentElement.textContent.trim();
      const tempo = rdm(min, max);
      await simularEstudo(nome, tempo, i + 1, selecionadas.length);
    }

    $msg.textContent = "✅ Todas as atividades foram simuladas!";
  };
})();
