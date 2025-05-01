function obterSaudacao (){
    const agora = new Date()
    const hora = agora.getHours();

    let saudacao;

    if (hora >= 5 && hora < 12) {
        saudacao = "Bom dia!"
    } else if (hora >= 12 && hora < 18) {
        saudacao = "Boa tarde!"
    } else {
        saudacao = "Boa noite!"
    }

    return saudacao;
}

function criarMapa () {
    let anoturma = document.getElementById('anoturma').value;
    let descricaoturma = document.getElementById('descricaoturma').value;
    let text_anoturma;
    let text_descricaoturma;

    if (!anoturma) {
        alert('Digite o ano da turma!');
        return;
    } else {
        text_anoturma = anoturma;

        if (descricaoturma) {
            text_descricaoturma = descricaoturma;
        }
    }

    const dadosMapa = {
        nome: text_anoturma,
        descricao: text_descricaoturma,
        numero_alunos: 0,
        alunos: {},
        numero_carteiras: 0,
        fileiras: 0
    }

    const jsonStr = JSON.stringify(dadosMapa, null, 2);

      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${text_anoturma}.json`;
      a.click();
      URL.revokeObjectURL(url);

    window.location.href = 'criar_mapa.html'
}

document.querySelector('#text-saudacao').textContent = obterSaudacao();
