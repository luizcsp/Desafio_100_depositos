const cofre = document.getElementById('cofre');
const totalDisplay = document.getElementById('total');
const resetBtn = document.getElementById('reset-btn');
const infoBtn = document.getElementById('info-btn');
const popup = document.getElementById('popup');
const closeButton = document.querySelector('.close-button');
const progressBar = document.getElementById('progress');

const senhaReset = "admin123"; 
let total = 0;
let posicoesOcupadas = {};

carregarDados();
criarTabela();

function criarTabela() {
    cofre.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const tr = document.createElement('tr');
        for (let j = 1; j <= 5; j++) {
            const valor = (i - 1) * 5 + j;
            const td = document.createElement('td');
            td.textContent = formatarMoeda(valor);
            td.dataset.valor = valor;

            if (posicoesOcupadas[valor]) {
                td.classList.add('depositado');
            }

            td.addEventListener('click', () => depositar(td, valor));
            tr.appendChild(td);
        }
        cofre.appendChild(tr);
    }
    atualizarProgresso();
}

function depositar(td, valor) {
    if (posicoesOcupadas[valor]) {
        alert("Este valor já foi depositado.");
        return;
    }

    if (confirm(`Confirma o depósito de ${formatarMoeda(valor)}?`)) {
        td.classList.add('depositado');
        total += valor;
        posicoesOcupadas[valor] = true;
        totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
        salvarDados();
        atualizarProgresso();
    }
}

function resetar() {
    const senha = prompt("Digite a senha para resetar:");
    if (senha === senhaReset) {
        if (confirm("Tem certeza que deseja resetar o desafio?")) {
            total = 0;
            posicoesOcupadas = {};
            totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
            salvarDados();
            criarTabela();
        }
    } else {
        alert("Senha incorreta!");
    }
}

function atualizarProgresso() {
    const totalPosicoes = 100;
    const progresso = (Object.keys(posicoesOcupadas).length / totalPosicoes) * 100;
    progressBar.style.width = `${progresso}%`;
    progressBar.textContent = `${Math.round(progresso)}%`;
}

function salvarDados() {
    const dados = { total, posicoesOcupadas };
    localStorage.setItem('desafio', JSON.stringify(dados));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('desafio');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        total = dados.total || 0;
        posicoesOcupadas = dados.posicoesOcupadas || {};
        totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
    }
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Eventos
resetBtn.addEventListener('click', resetar);
infoBtn.addEventListener('click', () => popup.style.display = 'flex');
closeButton.addEventListener('click', () => popup.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === popup) popup.style.display = 'none';
});
