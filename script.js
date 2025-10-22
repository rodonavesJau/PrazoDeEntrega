// script.js
// Remove acentos da cidade antes de enviar para a API
function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Função para mostrar o resultado lateralmente
function showResult() {
  const layoutWrapper = document.querySelector('.layout-wrapper');
  const resultadoCard = document.getElementById('resultadoCard');
  
  // Verifica se é mobile (largura <= 768px)
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) {
    layoutWrapper.classList.remove('initial');
    layoutWrapper.classList.add('with-result');
    
    // Pequeno delay para garantir que a transição funcione
    setTimeout(() => {
      resultadoCard.classList.add('show');
    }, 100);
  } else {
    // Em mobile, apenas mostra o resultado sem mudança de layout
    resultadoCard.classList.add('show');
  }
}

// Função para resetar o layout
function resetLayout() {
  const layoutWrapper = document.querySelector('.layout-wrapper');
  const resultadoCard = document.getElementById('resultadoCard');
  
  resultadoCard.classList.remove('show');
  
  setTimeout(() => {
    layoutWrapper.classList.remove('with-result');
    layoutWrapper.classList.add('initial');
  }, 300);
}

document.getElementById('consultarBtn').addEventListener('click', async () => {
  const cidade = document.getElementById('cidade').value.trim();
  const uf = document.getElementById('uf').value;
  const resultado = document.getElementById('resultado');

  if (!cidade || !uf) {
    resultado.innerHTML = '<div class="resultado-placeholder"><i class="fas fa-exclamation-circle"></i><p>Por favor, preencha todos os campos.</p></div>';
    resultado.style.backgroundColor = '#ffe6e6'; // Fundo vermelho claro para erro
    resultado.style.color = '#cc0000'; // Cor do texto de erro
    resultado.style.borderLeftColor = '#cc0000';
    showResult();
    return;
  }

  // Estilo de Loading
  resultado.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Consultando prazo...</div>';
  resultado.style.backgroundColor = '#f7f7f7';
  resultado.style.color = '#111';
  resultado.style.borderLeftColor = '#007aff';
  
  // Mostra o card de resultado durante o loading
  showResult();


  try {
    const cidadeFormatada = removerAcentos(cidade);
    const ufFormatada = uf.toUpperCase();

    const response = await fetch(`http://31.97.167.15:5000/prazo?municipio=${cidadeFormatada}&uf=${ufFormatada}`);
    const data = await response.json();

    if (!response.ok) {
      resultado.innerHTML = `<div class="resultado-placeholder"><i class="fas fa-exclamation-triangle"></i><p>ERRO: ${data.erro || 'Erro desconhecido'}</p></div>`;
      resultado.style.backgroundColor = '#ffe6e6';
      resultado.style.color = '#cc0000';
      resultado.style.borderLeftColor = '#cc0000';
      return;
    }

    // Estrutura HTML para o resultado
    const textoHTML = `
      <div>
        <p style="font-weight: 700; color: #007aff; margin-bottom: 15px; font-size: 1.1rem;"><i class="fas fa-box-open"></i> Prazos de Entrega para ${cidade}, ${uf}</p>
        <div style="margin-bottom: 20px;">
          <p style="margin-bottom: 8px;"><strong>Pessoa Jurídica:</strong> <span style="color: #007aff; font-weight: 600;">${parseInt(data.prazo_pj)} dias úteis</span></p>
          <p><strong>Pessoa Física:</strong> <span style="color: #007aff; font-weight: 600;">${parseInt(data.prazo_pf)} dias úteis</span></p>
        </div>
        <hr style="border: 0; border-top: 1px solid #cce0ff; margin: 15px 0;">
        <div>
          <p style="font-weight: 700; color: #007aff; margin-bottom: 10px;"><i class="fas fa-calendar-alt"></i> Frequência de Atendimento</p>
          <p style="margin-bottom: 8px;"><strong>Frequência:</strong> <span style="color: #007aff; font-weight: 600;">${parseInt(data.frequencia)}x por semana</span></p>
          <p><strong>Dias:</strong> <span style="color: #007aff; font-weight: 600;">${data.dias_atendimento.join(', ')}</span></p>
        </div>
      </div>
    `;

    resultado.innerHTML = textoHTML;
    resultado.style.backgroundColor = '#e6f0ff'; // Fundo de sucesso
    resultado.style.color = '#1c3a64';
    resultado.style.borderLeftColor = '#007aff';

  } catch (error) {
    resultado.innerHTML = '<div class="resultado-placeholder"><i class="fas fa-times-circle"></i><p>Erro ao conectar com o servidor.</p></div>';
    resultado.style.backgroundColor = '#ffe6e6';
    resultado.style.color = '#cc0000';
    resultado.style.borderLeftColor = '#cc0000';
    console.error(error);
  }
});

// Inicializar o layout como centralizado
document.addEventListener('DOMContentLoaded', function() {
  const layoutWrapper = document.querySelector('.layout-wrapper');
  layoutWrapper.classList.add('initial');
});

// Listener para redimensionamento da janela
window.addEventListener('resize', function() {
  const layoutWrapper = document.querySelector('.layout-wrapper');
  const resultadoCard = document.getElementById('resultadoCard');
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Em mobile, força layout vertical
    layoutWrapper.classList.remove('with-result');
    layoutWrapper.classList.add('initial');
  } else if (resultadoCard.classList.contains('show')) {
    // Se voltou para desktop e há resultado, aplica layout lateral
    layoutWrapper.classList.remove('initial');
    layoutWrapper.classList.add('with-result');
  }
});