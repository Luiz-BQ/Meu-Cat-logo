const API_URL = 'http://localhost:3000/itens';

const form = document.getElementById('form-item');
const grid = document.getElementById('catalogo-grid');

document.addEventListener('DOMContentLoaded', buscarItens);

async function buscarItens() {
    grid.innerHTML = ''; 
    try {
        const res = await fetch(API_URL);
        const itens = await res.json();
        
        itens.forEach(item => {
            criarCard(item);
        });
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
    }
}

function criarCard(item) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    card.innerHTML = `
        <span class="badge">${item.categoria}</span>
        <h3>${item.nome}</h3>
        <p>${item.descricao || 'Sem descrição.'}</p>
        <strong>Nota/Preço: ${item.preco_nota}</strong>
        <button class="btn-deletar" onclick="excluirItem(${item.id})">❌</button>
    `;
    
    grid.appendChild(card);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novoItem = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        descricao: document.getElementById('descricao').value,
        preco_nota: parseFloat(document.getElementById('preco_nota').value)
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoItem)
        });

        if (res.ok) {
            form.reset();
            buscarItens();
        }
    } catch (error) {
        console.error('Erro ao cadastrar item:', error);
    }
});
async function excluirItem(id) {
    if (confirm('Deseja realmente excluir este item?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                buscarItens();
            }
        } catch (error) {
            console.error('Erro ao excluir item:', error);
        }
    }
}