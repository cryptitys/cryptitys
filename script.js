let token = '';
let atividades = [];

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const ra = document.getElementById('ra').value;
  const senha = document.getElementById('senha').value;

  const login = await fetch('https://edusp-api.ip.tv/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ra, password: senha })
  });
  const data = await login.json();
  token = data.token;

  const userId = data.user.id;
  const atividadesRes = await fetch(`https://edusp-api.ip.tv/todo?expired_only=false&publication_target=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  atividades = await atividadesRes.json();

  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('atividades-section').classList.remove('hidden');

  const lista = document.getElementById('lista-atividades');
  atividades.forEach((a, i) => {
    const li = document.createElement('li');
    li.textContent = a.title || `Atividade ${i + 1}`;
    lista.appendChild(li);
  });
});

document.getElementById('executar').addEventListener('click', async () => {
  const tempo = parseInt(document.getElementById('tempo-total').value);
  const porAtividade = Math.floor((tempo * 60) / atividades.length);

  document.getElementById('atividades-section').classList.add('hidden');
  document.getElementById('execucao-section').classList.remove('hidden');

  for (let i = 0; i < atividades.length; i++) {
    const atv = atividades[i];
    document.getElementById('atividade-atual').textContent = `Respondendo: ${atv.title || 'Atividade ' + (i + 1)}`;
    await cronometro(porAtividade);

    await fetch(`https://edusp-api.ip.tv/todo/${atv.id}/response`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: 'completed', response: 'resposta automática' })
    });
  }

  document.getElementById('execucao-section').classList.add('hidden');
  document.getElementById('fim-section').classList.remove('hidden');
});

function cronometro(segundos) {
  return new Promise(resolve => {
    let restante = segundos;
    const el = document.getElementById('cronometro');
    const timer = setInterval(() => {
      const m = String(Math.floor(restante / 60)).padStart(2, '0');
      const s = String(restante % 60).padStart(2, '0');
      el.textContent = `${m}:${s}`;
      restante--;
      if (restante < 0) {
        clearInterval(timer);
        resolve();
      }
    }, 1000);
  });
      }      $atividadesContainer.appendChild(label);
    });
  };

  // Função para calcular o tempo por atividade
  const calcularTempoPorAtividade = () => {
    const selecionadas = Array.from(d.querySelectorAll("input[type='checkbox']:checked"));
    const atividadesSelecionadas = selecionadas.length;

    if (atividadesSelecionadas === 0) {
      alert("Selecione ao menos uma atividade!");
      return 0;
    }

    tempoRestante = tempoTotal / atividadesSelecionadas;
    return tempoRestante;
  };

  // Função para simular o cronômetro de estudo
  const iniciarCronometro = (tempo) => {
    let tempoRestanteSec = tempo;
    $cronometro.textContent = `⏳ Tempo restante: ${Math.floor(tempoRestanteSec / 60)}:${('0' + (tempoRestanteSec % 60)).slice(-2)}`;
    $currentActivity.appendChild($cronometro);

    const intervalo = setInterval(() => {
      tempoRestanteSec--;
      $cronometro.textContent = `⏳ Tempo restante: ${Math.floor(tempoRestanteSec / 60)}:${('0' + (tempoRestanteSec % 60)).slice(-2)}`;
      if (tempoRestanteSec <= 0) {
        clearInterval(intervalo);
        finalizarAtividade();
      }
    }, 1000);
  };

  // Função para finalizar a atividade
  const finalizarAtividade = () => {
    $msg.textContent = `✅ Atividade ${atividadeAtual + 1} concluída!`;
    $progressCounter.textContent = `Processando ${atividadeAtual + 1} de ${atividades.length}`;

    if (atividadeAtual < atividades.length - 1) {
      atividadeAtual++;
      enviarResposta(atividadeAtual);
    } else {
      $msg.textContent = "Todas as atividades foram concluídas!";
    }
  };

  // Função para enviar as respostas para a API
  const enviarResposta = async (index) => {
    const atividade = atividades[index];
    const question_id = atividade.questions[0].id;
    const choice_id = atividade.questions[0].choices.find(c => c.correct).id;

    // Formulário para enviar a resposta
    const response = await fetch('https://edusp-api.ip.tv/tms/task/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'seu_token_aqui'
      },
      body: JSON.stringify({
        task_id: atividade.id,
        status: 'completed',
        answers: [{ question_id, choice_id }],
        time_spent: tempoRestante,
        start_at: new Date().toISOString(),
        end_at: new Date(new Date().getTime() + tempoRestante * 1000).toISOString()
      })
    });

    if (response.ok) {
      finalizarAtividade();
    } else {
      $msg.textContent = `❌ Erro ao enviar atividade ${atividade.id}`;
    }
  };

  // Função de login
  $btnLogin.onclick = async () => {
    const ra = $ra.value.trim();
    const senha = $senha.value.trim();

    if (!ra || !senha) {
      alert("Preencha o RA e a senha.");
      return;
    }

    const response = await fetch("https://edusp-api.ip.tv/registration/edusp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: ra, password: senha })
    });
    const data = await response.json();
    const token = data.token;

    if (token) {
      buscarAtividades(token);
      $ativSec.classList.remove("hidden");
      $btnLogin.disabled = true;
    } else {
      alert("Erro no login.");
    }
  };

  // Iniciar as atividades selecionadas
  $iniciarBtn.onclick = () => {
    const tempo = calcularTempoPorAtividade();
    if (tempo > 0) {
      $statusSec.classList.remove("hidden");
      iniciarCronometro(tempo);
    }
  };
})();  }

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
