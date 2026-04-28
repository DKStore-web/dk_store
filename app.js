// --- 1. Navegação das Abas ---
function abrirAba(idAba) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.getElementById(idAba).classList.add('ativa');

    // Se abrir o dashboard, chama a função para atualizar os dados
    if(idAba === 'dashboard') carregarDashboard();
}

// --- 2. Lógica de Roteamento do WhatsApp (Opção 1) ---

// Cadastro das vendedoras com DDI e DDD (+55 64)
const vendedoras = {
    'karol': '5564999534774',
    'darryele': '5564996031137'
};

// Função acionada no seu painel para gerar o link para a cliente
function gerarLinkCatalogo() {
    // Em um sistema real, você pegaria isso de um <select> na tela
    const vendedoraEscolhida = prompt("Quem vai atender? Digite 'karol' ou 'darryele':").toLowerCase();
    
    if(!vendedoras[vendedoraEscolhida]) {
        alert("Vendedora não encontrada!");
        return;
    }

    // Cria o link passando o parâmetro na URL
    const urlBase = window.location.origin; // Pega o seu domínio atual
    const linkFinal = `${urlBase}/catalogo.html?vendedor=${vendedoraEscolhida}`;
    
    document.getElementById('linkGerado').innerHTML = `<a href="${linkFinal}" target="_blank">${linkFinal}</a>`;
}

// --- 3. Lógica Executada na Tela do Catálogo da Cliente ---
// (Isso rodaria no arquivo catalogo.html)
function finalizarPedidoWhatsApp(carrinhoItens, totalGeral) {
    // Lendo a URL para descobrir quem é a vendedora
    const parametrosUrl = new URLSearchParams(window.location.search);
    const vendedorId = parametrosUrl.get('vendedor') || 'karol'; // Karol como padrão caso não tenha link
    
    const numeroWhatsApp = vendedoras[vendedorId];

    // Montando a mensagem
    let textoMsg = `Olá! Quero fechar meu pedido:%0A`;
    carrinhoItens.forEach(item => {
        textoMsg += `- ${item.nome} (Tam: ${item.tamanho}) : R$ ${item.valor}%0A`;
    });
    textoMsg += `%0A*Total: R$ ${totalGeral}*`;

    // Redirecionando a cliente para o WhatsApp certo
    window.open(`https://wa.me/${numeroWhatsApp}?text=${textoMsg}`, '_blank');
}

// --- 4. Lógica do Dashboard ---
async function carregarDashboard() {
    const divMetricas = document.getElementById('metricasDashboard');
    divMetricas.innerHTML = "Calculando estatísticas...";

    // Aqui faríamos a consulta no Firestore. 
    // Exemplo de como a lógica vai funcionar quando tivermos dados:
    try {
        /* // Código real do Firestore seria algo assim:
        const vendasRef = collection(window.db, "vendas");
        const querySnapshot = await getDocs(vendasRef);
        
        let totalFaturado = 0;
        let tamanhosVendidos = { 'P': 0, 'M': 0, 'G': 0 };

        querySnapshot.forEach((doc) => {
            const venda = doc.data();
            totalFaturado += venda.valorTotal;
            // Lógica para iterar sobre as peças da venda e somar os tamanhos
        });
        */

        // Simulando o resultado para você ver a estrutura
        divMetricas.innerHTML = `
            <ul>
                <li><strong>Faturamento do Mês:</strong> R$ 4.500,00</li>
                <li><strong>Tamanho mais vendido:</strong> M (45 peças)</li>
                <li><strong>Ticket Médio:</strong> R$ 125,00 por cliente</li>
            </ul>
        `;
    } catch (error) {
        console.error("Erro ao carregar métricas: ", error);
        divMetricas.innerHTML = "Erro ao carregar o dashboard.";
    }
}