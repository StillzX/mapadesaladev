const viewMap = document.getElementById('mapa');
const inputImportar = document.getElementById('inputImportar');
const btnCriarMapa = document.getElementById('btnCriarMapa');

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

            document.getElementById('text-title-map').innerText = turma.nomeTurma || '';
            document.title = 'DeskMap - '  + turma.nomeTurma || '';
            // document.getElementById('descricaoTurma').value = turma.descricaoTurma || '';
            //document.getElementById('fileiras').value = turma.fileiras || 0;
            //document.getElementById('colunas').value = turma.colunas || 0;

            drawMap(turma);


        } catch (err) {
            alert("Erro ao importar o arquivo JSON.");
        }
    };
    reader.readAsText(file);
});