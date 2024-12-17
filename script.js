const cofre = document.getElementById('cofre');
const totalDisplay = document.getElementById('total');
const resetBtn = document.getElementById('reset-btn');
const infoBtn = document.getElementById('info-btn');
const popup = document.getElementById('popup');
const closeButton = document.querySelector('.close-button');
const senhaReset = "admin123"; // **ALTERE PARA UMA SENHA FORTE EM PRODUÇÃO!**
let total = 0;
let posicoesOcupadas = {};

carregarDados();

for (let i = 1; i <= 20; i++) {
    const tr = document.createElement('tr');
    for (let j = 1; j <= 5; j++) {
        const valor = (i - 1) * 5 + j;
        const td = document.createElement('td');
        td.textContent = formatarMoeda(valor);
        td.dataset.valor = valor;

        if (posicoesOcupadas[valor.toString()]) {
            td.classList.add('depositado');
        }

        td.addEventListener('click', depositar);
        tr.appendChild(td);
    }
    cofre.appendChild(tr);
}

function depositar(event) {
    const td = event.target;
    const valor = parseInt(td.dataset.valor);

    if (posicoesOcupadas[valor.toString()]) {
        alert("Esta posição já foi utilizada.");
        return;
    }

    if (confirm(`Deseja depositar ${formatarMoeda(valor)}?`)) {
        td.classList.add('depositado');
        total += valor;
        totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
        posicoesOcupadas[valor.toString()] = true;
        salvarDados();
    }
}

resetBtn.addEventListener('click', () => {
    const senha = prompt("Digite a senha para resetar:");
    if (senha === senhaReset) {
        if (confirm("Tem certeza que deseja resetar o desafio?")) {
            total = 0;
            posicoesOcupadas = {};
            totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
            const tds = document.querySelectorAll('#cofre td');
            tds.forEach(td => td.classList.remove('depositado'));
            localStorage.removeItem('desafio');
        }
    } else {
        alert("Senha incorreta.");
    }
});

infoBtn.addEventListener('click', () => {
    popup.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    popup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == popup) {
        popup.style.display = 'none';
    }
});

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvarDados() {
    const dados = { total: total, posicoes: posicoesOcupadas };
    localStorage.setItem('desafio', JSON.stringify(dados));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('desafio');
    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);
            total = dados.total;
            posicoesOcupadas = {};
            if (dados.posicoes) {
                for (const key in dados.posicoes) {
                    posicoesOcupadas[key] = dados.posicoes[key];
                }
            }
            totalDisplay.textContent = `Total: ${formatarMoeda(total)}`;
        } catch (error) {
            console.error("Erro ao carregar dados do localStorage:", error);
            localStorage.removeItem('desafio');
        }
    }
}