/**
 * Desafio do Cofre - Aplicação Melhorada
 * Sistema de economia pessoal para juntar R$ 5.050,00
 */

class DesafioCofre {
    constructor() {
        this.total = 0;
        this.posicoesOcupadas = {};
        this.elementos = this.inicializarElementos();
        this.inicializar();
    }

    inicializarElementos() {
        return {
            totalDisplay: document.getElementById('total-display'),
            progressFill: document.getElementById('progress-fill'),
            progressPercentage: document.getElementById('progress-percentage'),
            depositsCount: document.getElementById('deposits-count'),
            tableBody: document.getElementById('table-body'),
            resetBtn: document.getElementById('reset-btn'),
            infoBtn: document.getElementById('info-btn'),
            
            // Modais
            infoModal: document.getElementById('info-modal'),
            infoModalClose: document.getElementById('info-modal-close'),
            resetModal: document.getElementById('reset-modal'),
            resetCancel: document.getElementById('reset-cancel'),
            resetConfirm: document.getElementById('reset-confirm'),
            depositModal: document.getElementById('deposit-modal'),
            depositAmount: document.getElementById('deposit-amount'),
            depositCancel: document.getElementById('deposit-cancel'),
            depositConfirm: document.getElementById('deposit-confirm'),
            
            // Toast
            toast: document.getElementById('toast'),
            toastIcon: document.querySelector('.toast-icon'),
            toastMessage: document.querySelector('.toast-message')
        };
    }

    inicializar() {
        this.carregarDados();
        this.criarTabela();
        this.configurarEventos();
        this.atualizarInterface();
        
        // Animação de entrada
        setTimeout(() => {
            this.mostrarToast('Bem-vindo ao Desafio do Cofre!', 'success');
        }, 1000);
    }

    configurarEventos() {
        // Botões principais
        this.elementos.resetBtn.addEventListener('click', () => this.abrirModalReset());
        this.elementos.infoBtn.addEventListener('click', () => this.abrirModal(this.elementos.infoModal));

        // Modal de informações
        this.elementos.infoModalClose.addEventListener('click', () => this.fecharModal(this.elementos.infoModal));

        // Modal de reset
        this.elementos.resetCancel.addEventListener('click', () => this.fecharModal(this.elementos.resetModal));
        this.elementos.resetConfirm.addEventListener('click', () => this.confirmarReset());

        // Modal de depósito
        this.elementos.depositCancel.addEventListener('click', () => this.fecharModal(this.elementos.depositModal));
        this.elementos.depositConfirm.addEventListener('click', () => this.confirmarDeposito());

        // Fechar modais clicando fora
        [this.elementos.infoModal, this.elementos.resetModal, this.elementos.depositModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal(modal);
                }
            });
        });

        // Tecla ESC para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharTodosModais();
            }
        });
    }

    criarTabela() {
        this.elementos.tableBody.innerHTML = '';
        
        for (let i = 1; i <= 20; i++) {
            const tr = document.createElement('tr');
            
            for (let j = 1; j <= 5; j++) {
                const valor = (i - 1) * 5 + j;
                const td = document.createElement('td');
                
                td.textContent = this.formatarMoeda(valor);
                td.dataset.valor = valor;
                td.setAttribute('tabindex', '0');
                td.setAttribute('role', 'button');
                td.setAttribute('aria-label', `Depositar ${this.formatarMoeda(valor)}`);

                if (this.posicoesOcupadas[valor]) {
                    td.classList.add('depositado');
                    td.setAttribute('aria-label', `${this.formatarMoeda(valor)} - Já depositado`);
                }

                // Eventos de clique e teclado
                td.addEventListener('click', () => this.iniciarDeposito(valor));
                td.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.iniciarDeposito(valor);
                    }
                });

                tr.appendChild(td);
            }
            
            this.elementos.tableBody.appendChild(tr);
        }
    }

    iniciarDeposito(valor) {
        if (this.posicoesOcupadas[valor]) {
            this.mostrarToast('Este valor já foi depositado!', 'warning');
            return;
        }

        this.valorSelecionado = valor;
        this.elementos.depositAmount.textContent = this.formatarMoeda(valor);
        this.abrirModal(this.elementos.depositModal);
    }

    confirmarDeposito() {
        if (!this.valorSelecionado) return;

        const valor = this.valorSelecionado;
        const td = document.querySelector(`td[data-valor="${valor}"]`);
        
        // Animação de depósito
        td.style.transform = 'scale(1.1)';
        td.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            td.classList.add('depositado');
            td.style.transform = 'scale(1)';
            td.setAttribute('aria-label', `${this.formatarMoeda(valor)} - Já depositado`);
            
            this.total += valor;
            this.posicoesOcupadas[valor] = true;
            
            this.salvarDados();
            this.atualizarInterface();
            this.fecharModal(this.elementos.depositModal);
            
            this.mostrarToast(`Depósito de ${this.formatarMoeda(valor)} realizado!`, 'success');
            
            // Verificar se completou o desafio
            if (Object.keys(this.posicoesOcupadas).length === 100) {
                setTimeout(() => {
                    this.mostrarToast('🎉 Parabéns! Você completou o desafio!', 'success');
                }, 1000);
            }
        }, 150);

        this.valorSelecionado = null;
    }

    abrirModalReset() {
        this.abrirModal(this.elementos.resetModal);
    }

    confirmarReset() {
        // Animação de reset
        this.elementos.progressFill.style.transition = 'width 0.8s ease';
        this.elementos.progressFill.style.width = '0%';
        
        setTimeout(() => {
            this.total = 0;
            this.posicoesOcupadas = {};
            this.salvarDados();
            this.criarTabela();
            this.atualizarInterface();
            this.fecharModal(this.elementos.resetModal);
            this.mostrarToast('Desafio resetado com sucesso!', 'success');
        }, 400);
    }

    atualizarInterface() {
        // Atualizar total
        this.elementos.totalDisplay.textContent = this.formatarMoeda(this.total);
        
        // Atualizar contadores
        const depositos = Object.keys(this.posicoesOcupadas).length;
        this.elementos.depositsCount.textContent = depositos;
        
        // Atualizar progresso
        const progresso = (depositos / 100) * 100;
        this.elementos.progressFill.style.width = `${progresso}%`;
        this.elementos.progressPercentage.textContent = `${Math.round(progresso)}%`;
        
        // Atualizar marcos de progresso
        document.querySelectorAll('.milestone').forEach(milestone => {
            const valor = parseInt(milestone.dataset.value);
            if (progresso >= valor) {
                milestone.style.color = 'var(--success-color)';
                milestone.style.fontWeight = '600';
            } else {
                milestone.style.color = 'var(--text-muted)';
                milestone.style.fontWeight = '500';
            }
        });
    }

    // Gerenciamento de Modais
    abrirModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Foco no primeiro elemento focável
        const focusableElement = modal.querySelector('button, [tabindex="0"]');
        if (focusableElement) {
            setTimeout(() => focusableElement.focus(), 100);
        }
    }

    fecharModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    fecharTodosModais() {
        [this.elementos.infoModal, this.elementos.resetModal, this.elementos.depositModal].forEach(modal => {
            this.fecharModal(modal);
        });
    }

    // Sistema de Toast
    mostrarToast(mensagem, tipo = 'success') {
        this.elementos.toastMessage.textContent = mensagem;
        this.elementos.toast.className = `toast ${tipo}`;
        
        // Ícones baseados no tipo
        const icones = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        this.elementos.toastIcon.className = `toast-icon ${icones[tipo] || icones.info}`;
        
        // Mostrar toast
        this.elementos.toast.classList.add('show');
        
        // Ocultar automaticamente após 3 segundos
        setTimeout(() => {
            this.elementos.toast.classList.remove('show');
        }, 3000);
    }

    // Persistência de Dados
    salvarDados() {
        const dados = {
            total: this.total,
            posicoesOcupadas: this.posicoesOcupadas,
            ultimaAtualizacao: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('desafio-cofre-v2', JSON.stringify(dados));
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            this.mostrarToast('Erro ao salvar progresso', 'error');
        }
    }

    carregarDados() {
        try {
            const dadosSalvos = localStorage.getItem('desafio-cofre-v2');
            
            if (dadosSalvos) {
                const dados = JSON.parse(dadosSalvos);
                this.total = dados.total || 0;
                this.posicoesOcupadas = dados.posicoesOcupadas || {};
                
                // Migração de dados da versão anterior
                const dadosAntigos = localStorage.getItem('desafio');
                if (dadosAntigos && Object.keys(this.posicoesOcupadas).length === 0) {
                    const dadosAntigosObj = JSON.parse(dadosAntigos);
                    this.total = dadosAntigosObj.total || 0;
                    this.posicoesOcupadas = dadosAntigosObj.posicoesOcupadas || {};
                    this.salvarDados(); // Salvar na nova versão
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.mostrarToast('Erro ao carregar progresso salvo', 'error');
        }
    }

    // Utilitários
    formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }

    // Métodos públicos para extensibilidade
    exportarDados() {
        return {
            total: this.total,
            posicoesOcupadas: this.posicoesOcupadas,
            progresso: (Object.keys(this.posicoesOcupadas).length / 100) * 100,
            dataExportacao: new Date().toISOString()
        };
    }

    importarDados(dados) {
        if (dados && typeof dados === 'object') {
            this.total = dados.total || 0;
            this.posicoesOcupadas = dados.posicoesOcupadas || {};
            this.salvarDados();
            this.criarTabela();
            this.atualizarInterface();
            this.mostrarToast('Dados importados com sucesso!', 'success');
        }
    }
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.desafioCofre = new DesafioCofre();
});

// Exposição de métodos para console/debug
window.exportarProgresso = () => {
    const dados = window.desafioCofre.exportarDados();
    console.log('Dados do progresso:', dados);
    return dados;
};

window.importarProgresso = (dados) => {
    window.desafioCofre.importarDados(dados);
};

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registrado com sucesso:', registration);
            })
            .catch(registrationError => {
                console.log('Falha no registro do SW:', registrationError);
            });
    });
}

