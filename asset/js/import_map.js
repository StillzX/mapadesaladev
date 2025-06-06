const viewMap = document.getElementById('mapa');
const inputImportar = document.getElementById('inputImportar');
const btnCriarMapa = document.getElementById('btnCriarMapa');
const salaEl = document.getElementById('sala');

let turma = {
    nomeTurma: '',
    descricaoTurma: '',
    fileiras: 0,
    colunas: 0,
    alunos: []
}

function drawMap(turma) {
    viewMap.innerHTML = '';
    viewMap.style.gridTemplateRows = `repeat(${turma.fileiras}, 1fr)`;
    viewMap.style.gridTemplateColumns = `repeat(${turma.colunas}, 1fr)`;

    for (let i = 0; i < turma.fileiras; i++) {

        for (let j = 0; j < turma.colunas; j++) {

            const aluno = turma.alunos.find(a => a.linha === i && a.coluna === j);
            const div = document.createElement('div');
            div.className = 'carteira';
            div.textContent = aluno ? aluno.nome : '';

            div.addEventListener('click', () => {
                const nome = prompt("Digite o nome do aluno para esta carteira:", aluno ? aluno.nome : '');
                if (nome !== null && nome.trim() !== '') {
                    const existente = turma.alunos.find(a => a.linha === i && a.coluna === j);
                    if (existente) {
                        existente.nome = nome;
                    } else {
                        turma.alunos.push({ nome, linha: i, coluna: j, ocorrencias: [] });
                    }
                    drawMap(turma);
                }
            });

            viewMap.appendChild(div);
        }
    }
}


document.getElementById('btnImport').addEventListener('click', () => {
    inputImportar.click();
});
inputImportar.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const dados = JSON.parse(event.target.result);
            turma = dados;

            document.getElementById('inputProjectName').value = turma.nomeTurma || '';
            document.getElementById('text-sala').innerText = `Você está visualizando agora "${turma.nomeTurma || ''}"` || '';
            document.title = 'DeskMap - ' + turma.nomeTurma || '';
            // document.getElementById('descricaoTurma').value = turma.descricaoTurma || '';
            //document.getElementById('fileiras').value = turma.fileiras || 0;
            //document.getElementById('colunas').value = turma.colunas || 0;

            document.getElementById('toolbar').classList.remove('d-none');
            document.getElementById('sala-viewer').classList.remove('d-none');
            document.getElementById('select-file').classList.add('d-none');

            desenharSala(turma);


        } catch (err) {
            alert("Erro ao importar o arquivo JSON.");
        }
    };
    reader.readAsText(file);
});

function desenharSala(turma) {
    salaEl.innerHTML = '';
    salaEl.style.gridTemplateRows = `repeat(${turma.fileiras}, 1fr)`;
    salaEl.style.gridTemplateColumns = `repeat(${turma.colunas}, 1fr)`;

    for (let i = 0; i < turma.fileiras; i++) {
        for (let j = 0; j < turma.colunas; j++) {
            const aluno = turma.alunos.find(a => a.linha === i && a.coluna === j);

            const container = document.createElement('div');
            container.className = 'carteira-container';

            const div = document.createElement('div');
            div.className = 'carteira';
            if (aluno) {
                div.classList.add('preenchida');

                const icone = document.createElement('div');
                icone.className = 'icone-aluno';

                const nome = document.createElement('div');
                nome.textContent = aluno.nome;

                div.appendChild(icone);
                div.appendChild(nome);
            }


            div.addEventListener('click', () => {
                const nome = prompt("Digite o nome do aluno para esta carteira:", aluno ? aluno.nome : '');
                if (nome !== null && nome.trim() !== '') {
                    const existente = turma.alunos.find(a => a.linha === i && a.coluna === j);
                    if (existente) {
                        existente.nome = nome;
                    } else {
                        turma.alunos.push({ nome, linha: i, coluna: j, ocorrencias: [] });
                    }
                    desenharSala(turma);
                }
            });

            container.appendChild(div);

            // Botão de ocorrência
            if (aluno) {
                const btn = document.createElement('button');
                btn.className = 'ocorrencia-btn';
                btn.textContent = '!';
                btn.title = "Adicionar ocorrência";
                btn.onclick = (e) => {
                    e.stopPropagation();
                    const ocorrencia = prompt("Descreva a ocorrência:");
                    if (ocorrencia && ocorrencia.trim() !== '') {
                        aluno.ocorrencias.push(ocorrencia.trim());
                        desenharSala(turma); // Redesenha para atualizar badge
                        atualizarListaOcorrencias(); // Atualiza a lista lateral
                    }
                };
                container.appendChild(btn);

                if (aluno.ocorrencias && aluno.ocorrencias.length > 0) {
                    const badge = document.createElement('div');
                    badge.className = 'ocorrencia-badge';
                    badge.textContent = aluno.ocorrencias.length;
                    container.appendChild(badge);
                }

            }

            salaEl.appendChild(container);

        }
    }

    atualizarListaOcorrencias();
}

function atualizarListaOcorrencias() {
    const ul = document.getElementById('ocorrenciasUl');
    ul.innerHTML = '';

    turma.alunos.forEach(aluno => {
        if (aluno.ocorrencias && aluno.ocorrencias.length > 0) {
            aluno.ocorrencias.forEach((oc, idx) => {
                const li = document.createElement('li');
                li.textContent = `${aluno.nome}: ${oc}`;
                ul.appendChild(li);
            });
        }
    });
}


document.getElementById('btnExportarLog').addEventListener('click', () => {
    const logs = turma.alunos
        .filter(a => a.ocorrencias && a.ocorrencias.length > 0)
        .flatMap(aluno => aluno.ocorrencias.map(oc => `${aluno.nome} - ${oc}`));

    if (logs.length === 0) {
        alert("Nenhuma ocorrência registrada para exportar.");
        return;
    }

    const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `log_ocorrencias_${turma.nomeTurma}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('btnCriarMapa').addEventListener('click', () => {
    if (turma.alunos.length <= 0) {
        alert('Você deve preencher ao menos uma carteira antes de exportar este mapa!');
        return;
    }

    const blob = new Blob([JSON.stringify(turma, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${turma.nomeTurma || 'turma'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

});