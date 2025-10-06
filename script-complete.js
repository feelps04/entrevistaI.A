// Script para sistema completo com múltiplas posições e salvamento local
let enhancedAI = null;
let storageManager = null;
let currentSpeaker = 'interviewer';
let selectedPosition = null;
let currentTab = 'interview';

let interviewState = {
    isRecording: false,
    isPaused: false,
    startTime: null,
    currentTime: 0,
    candidateName: '',
    position: '',
    duration: 45,
    transcripts: [],
    suggestions: [],
    topicProgress: {
        technical: 0,
        communication: 0,
        'problem-solving': 0,
        leadership: 0
    },
    scores: {
        overall: 0,
        technical: 0,
        communication: 0,
        problemSolving: 0,
        leadership: 0
    }
};

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    updateStatus('ready', 'Sistema completo pronto');
    enhancedAI = new EnhancedAIAnalysisSimulator();
    storageManager = new LocalStorageManager();
    
    loadPositions();
    loadCandidates();
    setupEventListeners();
    
    console.log('🎯 Sistema completo iniciado');
});

// Carregar posições disponíveis
function loadPositions() {
    const positionGrid = document.getElementById('positionGrid');
    const filterArea = document.getElementById('filterArea');
    const filterPosition = document.getElementById('filterPosition');
    
    // Limpar grids
    positionGrid.innerHTML = '';
    
    // Obter áreas únicas
    const areas = [...new Set(Object.values(POSITIONS_CONFIG).map(p => p.area))];
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        filterArea.appendChild(option);
    });
    
    // Carregar posições
    Object.keys(POSITIONS_CONFIG).forEach(positionKey => {
        const position = POSITIONS_CONFIG[positionKey];
        
        // Card da posição
        const card = document.createElement('div');
        card.className = 'position-card';
        card.dataset.position = positionKey;
        card.onclick = () => selectPosition(positionKey);
        
        card.innerHTML = `
            <div class="position-title">${position.title}</div>
            <div class="position-meta">
                <span><i class="fas fa-building"></i> ${position.area}</span>
                <span><i class="fas fa-star"></i> ${position.seniority}</span>
            </div>
            <div class="position-score">
                Score esperado: ${position.expectedScore.min}-${position.expectedScore.ideal}
            </div>
        `;
        
        positionGrid.appendChild(card);
        
        // Adicionar ao filtro de posições
        const option = document.createElement('option');
        option.value = positionKey;
        option.textContent = position.title;
        filterPosition.appendChild(option);
    });
}

// Selecionar posição
function selectPosition(positionKey) {
    selectedPosition = positionKey;
    
    // Atualizar visual
    document.querySelectorAll('.position-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-position="${positionKey}"]`).classList.add('selected');
    
    // Habilitar botão
    const startButton = document.getElementById('startButton');
    startButton.disabled = false;
    
    // Atualizar IA com configuração da posição
    const positionConfig = POSITIONS_CONFIG[positionKey];
    enhancedAI.keywords = positionConfig.keywords;
    
    console.log('✅ Posição selecionada:', positionConfig.title);
}

// Configurar event listeners
function setupEventListeners() {
    // Enter no textarea
    const textarea = document.getElementById('speechInput');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addSpeechText();
            }
        });
    }
}

// Navegação por abas
function showTab(tabName) {
    currentTab = tabName;
    
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.currentTarget.classList.add('active');
    
    // Carregar conteúdo específico da aba
    switch(tabName) {
        case 'candidates':
            loadCandidates();
            break;
        case 'comparison':
            loadComparison();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

// Iniciar entrevista completa
function startCompleteInterview() {
    const candidateName = document.getElementById('candidateName').value;
    const duration = document.getElementById('duration').value;

    if (!candidateName.trim()) {
        alert('Por favor, insira o nome do candidato');
        return;
    }
    
    if (!selectedPosition) {
        alert('Por favor, selecione uma posição');
        return;
    }

    interviewState.candidateName = candidateName;
    interviewState.position = selectedPosition;
    interviewState.duration = parseInt(duration);
    interviewState.startTime = Date.now();
    interviewState.isRecording = true;

    // Esconder setup e mostrar interview
    document.getElementById('setupPanel').style.display = 'none';
    document.getElementById('interviewPanel').style.display = 'block';

    updateStatus('recording', 'Entrevista em andamento...');
    startTimer();

    const positionConfig = POSITIONS_CONFIG[selectedPosition];
    addTranscriptMessage('system', `Entrevista iniciada para ${positionConfig.title}. Digite as falas ou carregue conversa exemplo.`);
    
    console.log('🎯 Entrevista iniciada:', positionConfig.title);
    
    // Focar no textarea
    setTimeout(() => document.getElementById('speechInput').focus(), 500);
}

// Definir falante atual
function setSpeaker(speaker) {
    currentSpeaker = speaker;
    
    // Atualizar botões
    document.getElementById('interviewerBtn').classList.remove('active');
    document.getElementById('candidateBtn').classList.remove('active');
    
    if (speaker === 'interviewer') {
        document.getElementById('interviewerBtn').classList.add('active');
    } else {
        document.getElementById('candidateBtn').classList.add('active');
    }
    
    // Atualizar placeholder
    const textarea = document.getElementById('speechInput');
    if (speaker === 'interviewer') {
        textarea.placeholder = 'Digite aqui o que o entrevistador diria...';
    } else {
        textarea.placeholder = 'Digite aqui o que o candidato responderia...';
    }
}

// Adicionar texto como fala
function addSpeechText() {
    const textarea = document.getElementById('speechInput');
    const text = textarea.value.trim();
    
    if (!text) {
        alert('Por favor, digite algum texto antes de adicionar.');
        return;
    }
    
    // Processar como transcrição
    handleCompleteTranscript({
        text: text,
        speaker: currentSpeaker,
        confidence: 0.95,
        timestamp: Date.now(),
        service: 'Complete System'
    });
    
    // Limpar textarea
    textarea.value = '';
    
    // Alternar falante automaticamente
    const nextSpeaker = currentSpeaker === 'interviewer' ? 'candidate' : 'interviewer';
    setSpeaker(nextSpeaker);
    
    // Focar no textarea
    setTimeout(() => textarea.focus(), 100);
}

// Carregar conversa de exemplo baseada na posição
function loadSampleConversation() {
    if (!selectedPosition) {
        alert('Selecione uma posição primeiro');
        return;
    }
    
    if (!confirm('Isso irá carregar uma conversa de exemplo para a posição selecionada. Continuar?')) {
        return;
    }
    
    const positionConfig = POSITIONS_CONFIG[selectedPosition];
    const sampleConversation = generateSampleConversation(positionConfig);
    
    let index = 0;
    const loadNext = () => {
        if (index >= sampleConversation.length) {
            console.log('✅ Conversa de exemplo carregada');
            return;
        }
        
        const message = sampleConversation[index];
        handleCompleteTranscript({
            text: message.text,
            speaker: message.speaker,
            confidence: 0.95,
            timestamp: Date.now(),
            service: 'Sample Conversation'
        });
        
        index++;
        setTimeout(loadNext, 1500);
    };
    
    loadNext();
}

// Gerar conversa de exemplo baseada na posição
function generateSampleConversation(positionConfig) {
    const conversations = {
        'desenvolvedor-junior-react': [
            { speaker: 'interviewer', text: 'Olá! Pode me contar sobre sua experiência com React?' },
            { speaker: 'candidate', text: 'Olá! Trabalho com React há 1 ano, criei alguns projetos pessoais usando hooks como useState e useEffect. Também uso HTML, CSS e JavaScript.' },
            { speaker: 'interviewer', text: 'Como você debugga problemas no React?' },
            { speaker: 'candidate', text: 'Uso console.log para ver os valores das variáveis e o React Developer Tools. Quando tenho dúvidas, pesquiso no Stack Overflow e leio a documentação.' }
        ],
        'desenvolvedor-senior-react': [
            { speaker: 'interviewer', text: 'Como você arquiteta aplicações React complexas?' },
            { speaker: 'candidate', text: 'Uso uma arquitetura baseada em feature folders, implemento custom hooks para lógica reutilizável, Context API para estado global e TypeScript para type safety. Também implemento code splitting e lazy loading.' },
            { speaker: 'interviewer', text: 'Como garante performance em aplicações grandes?' },
            { speaker: 'candidate', text: 'Implemento React.memo, useMemo e useCallback estrategicamente. Monitoro bundle size com webpack-bundle-analyzer, implemento virtual scrolling para listas grandes e uso React Profiler para identificar bottlenecks.' }
        ]
    };
    
    return conversations[selectedPosition] || [
        { speaker: 'interviewer', text: 'Conte-me sobre sua experiência na área.' },
        { speaker: 'candidate', text: 'Tenho experiência sólida e sempre busco aprender novas tecnologias.' }
    ];
}

// Processar transcrição completa
function handleCompleteTranscript(transcriptData) {
    const { text, speaker, confidence, timestamp, service } = transcriptData;
    
    // Adicionar à transcrição
    addTranscriptMessage(speaker, text);
    
    // Analisar com IA configurada para a posição (AMBOS os falantes)
    const analysis = enhancedAI.analyzeTranscript(text, speaker);
    
    if (analysis) {
        console.log(`🎯 Análise para ${speaker}:`, analysis);
        
        // Adicionar sugestões (para ambos os falantes)
        analysis.suggestions.forEach((suggestion, index) => {
            setTimeout(() => {
                addSuggestion(suggestion.text, suggestion.priority, suggestion.category);
            }, index * 500);
        });
        
        // Atualizar progresso com lógica melhorada (incluindo valores negativos)
        Object.keys(analysis.analysis).forEach(topic => {
            const scoreGained = analysis.analysis[topic];
            if (scoreGained !== 0) { // Processar tanto positivos quanto negativos
                const currentProgress = interviewState.topicProgress[topic] || 0;
                
                // Converter score para progresso
                let progressChange;
                if (scoreGained > 0) {
                    progressChange = Math.min(scoreGained / 50 * 100, 25); // Máximo +25% por mensagem
                } else {
                    progressChange = Math.max(scoreGained / 20 * 100, -30); // Máximo -30% por erro
                }
                
                const newProgress = Math.max(Math.min(currentProgress + progressChange, 100), 0);
                
                console.log(`📊 ${topic}: ${scoreGained > 0 ? '+' : ''}${scoreGained} pontos = ${progressChange > 0 ? '+' : ''}${Math.round(progressChange)}% progresso`);
                
                // Mostrar alerta visual para erros graves
                if (scoreGained < -10) {
                    console.log(`🚨 ERRO GRAVE detectado em ${topic}!`);
                    showErrorAlert(topic, scoreGained);
                }
                
                setTimeout(() => {
                    updateTopicProgress(topic, Math.round(newProgress));
                }, 1000);
            }
        });
        
        // Atualizar scores
        Object.keys(analysis.analysis).forEach(category => {
            interviewState.scores[category] = Math.max(
                interviewState.scores[category] || 0,
                analysis.analysis[category]
            );
        });
        
        // Calcular score geral
        const scores = Object.values(interviewState.scores);
        interviewState.scores.overall = Math.round(
            scores.reduce((sum, score) => sum + score, 0) / scores.length
        );
    }
}

// Funções auxiliares (reutilizadas do demo)
function startTimer() {
    const timerElement = document.getElementById('timer');
    const updateTimer = () => {
        if (interviewState.isRecording && !interviewState.isPaused) {
            interviewState.currentTime = Date.now() - interviewState.startTime;
            const minutes = Math.floor(interviewState.currentTime / 60000);
            const seconds = Math.floor((interviewState.currentTime % 60000) / 1000);
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    };
    setInterval(updateTimer, 1000);
}

function updateStatus(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = text;
}

function addTranscriptMessage(speaker, message) {
    const transcriptionContent = document.getElementById('transcriptionContent');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'transcript-message';
    
    const speakerSpan = document.createElement('span');
    speakerSpan.className = `speaker ${speaker}`;
    speakerSpan.textContent = speaker === 'interviewer' ? 'Entrevistador:' : 
                             speaker === 'candidate' ? 'Candidato:' : 'Sistema:';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'message';
    messageSpan.textContent = message;
    
    messageDiv.appendChild(speakerSpan);
    messageDiv.appendChild(messageSpan);
    transcriptionContent.appendChild(messageDiv);
    transcriptionContent.scrollTop = transcriptionContent.scrollHeight;

    interviewState.transcripts.push({ speaker, message, timestamp: interviewState.currentTime });
}

function addSuggestion(text, priority = 'medium', category = 'general') {
    const suggestionsContent = document.getElementById('suggestionsContent');
    const waitingMessage = suggestionsContent.querySelector('.suggestion-item.waiting');
    if (waitingMessage) waitingMessage.remove();
    
    const suggestionDiv = document.createElement('div');
    suggestionDiv.className = `suggestion-item ${priority}-priority`;
    suggestionDiv.onclick = () => applySuggestion(text);
    
    const icon = document.createElement('i');
    icon.className = priority === 'high' ? 'fas fa-exclamation-circle' : 
                    priority === 'medium' ? 'fas fa-lightbulb' : 'fas fa-info-circle';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    
    suggestionDiv.appendChild(icon);
    suggestionDiv.appendChild(textSpan);
    suggestionsContent.appendChild(suggestionDiv);

    interviewState.suggestions.push({ text, priority, category, timestamp: interviewState.currentTime });

    setTimeout(() => {
        if (suggestionDiv.parentNode) suggestionDiv.remove();
    }, 120000);
}

function updateTopicProgress(topic, progress) {
    const topicItem = document.querySelector(`[data-topic="${topic}"]`);
    if (topicItem) {
        const progressFill = topicItem.querySelector('.progress-fill');
        const progressPercent = topicItem.querySelector('.progress-percent');
        progressFill.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;
        interviewState.topicProgress[topic] = progress;
    }
}

function applySuggestion(suggestionText) {
    const suggestion = event.currentTarget;
    suggestion.style.background = '#d1fae5';
    suggestion.style.borderLeftColor = '#10b981';
    setTimeout(() => {
        if (suggestion.parentNode) suggestion.remove();
    }, 1000);
}

function toggleSuggestions() {
    const suggestionsContent = document.getElementById('suggestionsContent');
    const toggleIcon = document.getElementById('toggleIcon');
    if (suggestionsContent.style.display === 'none') {
        suggestionsContent.style.display = 'block';
        toggleIcon.className = 'fas fa-eye';
    } else {
        suggestionsContent.style.display = 'none';
        toggleIcon.className = 'fas fa-eye-slash';
    }
}

// Mostrar alerta de erro grave
function showErrorAlert(topic, score) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'error-alert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        border: 2px solid #ef4444;
        border-radius: 8px;
        padding: 1rem;
        color: #991b1b;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-exclamation-triangle" style="color: #ef4444;"></i>
            <span>ERRO DETECTADO!</span>
        </div>
        <div style="font-size: 0.875rem; margin-top: 0.5rem; font-weight: normal;">
            ${topic}: ${score} pontos (resposta incorreta)
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Mostrar notificação de sucesso/erro
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const colors = {
        success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
        error: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${color.bg};
        border: 2px solid ${color.border};
        color: ${color.text};
        padding: 1rem 2rem;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Atualizar progresso com cores baseadas na performance
function updateTopicProgress(topic, progress) {
    const topicItem = document.querySelector(`[data-topic="${topic}"]`);
    if (topicItem) {
        const progressFill = topicItem.querySelector('.progress-fill');
        const progressPercent = topicItem.querySelector('.progress-percent');
        
        // Definir cor baseada no progresso
        let color = '#667eea'; // Azul padrão
        if (progress < 30) {
            color = '#ef4444'; // Vermelho para baixo
        } else if (progress < 60) {
            color = '#f59e0b'; // Amarelo para médio
        } else if (progress >= 80) {
            color = '#10b981'; // Verde para alto
        }
        
        progressFill.style.width = `${progress}%`;
        progressFill.style.backgroundColor = color;
        progressPercent.textContent = `${progress}%`;
        progressPercent.style.color = color;
        
        // Adicionar efeito visual para mudanças
        progressFill.style.transition = 'all 0.5s ease-out';
        
        interviewState.topicProgress[topic] = progress;
    }
}

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    .suggestion-item.high-priority {
        border-left: 4px solid #ef4444;
        background: #fef2f2;
    }
    
    .suggestion-item.medium-priority {
        border-left: 4px solid #f59e0b;
        background: #fffbeb;
    }
    
    .suggestion-item.low-priority {
        border-left: 4px solid #6b7280;
        background: #f9fafb;
    }
`;
document.head.appendChild(style);

// Placeholder functions for remaining functionality
function pauseCompleteInterview() { 
    console.log('Pause interview'); 
    // Implementar lógica de pausa se necessário
}

function finishCompleteInterview() {
    if (!confirm('Tem certeza que deseja finalizar e salvar a entrevista?')) {
        return;
    }
    
    // Parar gravação
    interviewState.isRecording = false;
    updateStatus('ready', 'Entrevista finalizada e salva');
    
    // Capturar progresso atual da entrevista
    const currentProgress = {
        technical: interviewState.topicProgress.technical || 0,
        communication: interviewState.topicProgress.communication || 0,
        problemSolving: interviewState.topicProgress['problem-solving'] || 0,
        leadership: interviewState.topicProgress.leadership || 0
    };
    
    // Calcular score geral baseado na média ponderada
    const overallScore = Math.round(
        (currentProgress.technical + currentProgress.communication + 
         currentProgress.problemSolving + currentProgress.leadership) / 4
    );
    
    // Usar os scores reais do progresso da entrevista
    const finalScores = {
        overall: overallScore,
        technical: currentProgress.technical,
        communication: currentProgress.communication,
        problemSolving: currentProgress.problemSolving,
        leadership: currentProgress.leadership
    };
    
    // Calcular estatísticas da entrevista
    const interviewStats = {
        duration: Math.floor(interviewState.currentTime / 60000) || 1, // em minutos, mínimo 1
        interactions: interviewState.transcripts.length || 0,
        suggestions: interviewState.suggestions.length || 0
    };
    
    // Determinar recomendação baseada no score geral
    const recommendation = finalScores.overall >= 75 ? 'CONTRATAR' : 
                          finalScores.overall >= 60 ? 'TALVEZ' : 'NÃO CONTRATAR';
    
    // Gerar o relatório com os dados reais
    generateReportWithRealData(finalScores, interviewStats, recommendation);
    
    // Mostrar o painel do relatório
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'block';
    
    // Criar objeto do candidato para salvar
    const candidateData = {
        id: Date.now().toString(),
        name: interviewState.candidateName,
        position: interviewState.position,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR'),
        duration: interviewStats.duration,
        scores: finalScores,
        recommendation: recommendation,
        transcripts: interviewState.transcripts,
        suggestions: interviewState.suggestions
    };
    
    // Salvar no localStorage
    let savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    savedCandidates.push(candidateData);
    localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
    
    // Mostrar mensagem de sucesso
    setTimeout(() => {
        showUpdateNotification('Entrevista finalizada e relatório gerado com base no progresso atual!');
    }, 500);
}

// Nova função para gerar relatório com dados reais
function generateReportWithRealData(scores, stats, recommendation) {
    // Atualizar score cards com dados reais
    const scoreCards = document.querySelectorAll('.score-card .score-value');
    if (scoreCards.length >= 4) {
        scoreCards[0].textContent = scores.overall; // Score Geral
        scoreCards[1].textContent = stats.duration; // Minutos
        scoreCards[2].textContent = stats.interactions; // Interações
        scoreCards[3].textContent = stats.suggestions; // Sugestões
    }
    
    // Atualizar recomendação
    const recommendationBadge = document.querySelector('.recommendation-badge');
    const recommendationText = document.querySelector('.recommendation-text');
    
    if (recommendationBadge && recommendationText) {
        // Remover classes antigas
        recommendationBadge.classList.remove('success', 'warning', 'danger');
        
        // Adicionar nova classe e conteúdo
        const badgeClass = recommendation === 'CONTRATAR' ? 'success' : 
                          recommendation === 'TALVEZ' ? 'warning' : 'danger';
        
        const icon = recommendation === 'CONTRATAR' ? 'fa-check-circle' : 
                    recommendation === 'TALVEZ' ? 'fa-exclamation-triangle' : 'fa-times-circle';
        
        recommendationBadge.classList.add(badgeClass);
        recommendationBadge.innerHTML = `<i class="fas ${icon}"></i> Recomendação: ${recommendation}`;
        
        const recommendationTexts = {
            'CONTRATAR': `Candidato demonstra excelente performance (${scores.overall}/100). Recomendado para contratação imediata.`,
            'TALVEZ': `Candidato apresenta potencial mas com algumas lacunas (${scores.overall}/100). Considere entrevista adicional ou plano de desenvolvimento.`,
            'NÃO CONTRATAR': `Candidato não atende aos requisitos mínimos (${scores.overall}/100). Não recomendado para a posição atual.`
        };
        
        recommendationText.textContent = recommendationTexts[recommendation];
    }
    
    // Atualizar scores de competências com dados reais
    const competencyScores = document.querySelectorAll('.competency-score');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const competencies = [
        { score: scores.technical, name: 'technical' },
        { score: scores.communication, name: 'communication' },
        { score: scores.problemSolving, name: 'problemSolving' },
        { score: scores.leadership, name: 'leadership' }
    ];
    
    competencies.forEach((comp, index) => {
        if (competencyScores[index] && progressFills[index]) {
            // Atualizar texto do score
            competencyScores[index].textContent = `${comp.score}/100`;
            
            // Atualizar largura da barra
            progressFills[index].style.width = `${comp.score}%`;
            
            // Atualizar classes de cor baseado no score real
            const scoreClass = comp.score >= 80 ? 'excellent' :
                             comp.score >= 60 ? 'good' :
                             comp.score >= 40 ? 'average' : 'poor';
            
            // Remover classes antigas
            competencyScores[index].classList.remove('excellent', 'good', 'average', 'poor');
            progressFills[index].classList.remove('excellent', 'good', 'average', 'poor');
            
            // Adicionar nova classe
            competencyScores[index].classList.add(scoreClass);
            progressFills[index].classList.add(scoreClass);
        }
    });
    
    // Gerar insights baseados nos scores reais
    generateRealInsights(scores);
}

// Nova função para gerar insights baseados nos dados reais
function generateRealInsights(scores) {
    const insightsList = document.querySelector('.insights-list');
    if (!insightsList) return;
    
    const insights = [];
    
    // Insights baseados nos scores reais da entrevista
    if (scores.technical >= 80) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Demonstrou sólido conhecimento técnico durante a entrevista'
        });
    } else if (scores.technical >= 60) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Conhecimento técnico adequado, mas com espaço para desenvolvimento'
        });
    } else if (scores.technical > 0) {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Necessita desenvolvimento significativo em habilidades técnicas'
        });
    } else {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Não demonstrou habilidades técnicas durante a entrevista'
        });
    }
    
    if (scores.communication >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Excelente comunicação e capacidade de articulação'
        });
    } else if (scores.communication >= 40) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Comunicação adequada, pode se beneficiar de aprimoramento'
        });
    } else if (scores.communication > 0) {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Dificuldades de comunicação observadas durante a entrevista'
        });
    } else {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Não demonstrou habilidades de comunicação durante a entrevista'
        });
    }
    
    if (scores.problemSolving >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Demonstra excelente capacidade analítica e resolução de problemas'
        });
    } else if (scores.problemSolving >= 40) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Capacidade de resolução de problemas em desenvolvimento'
        });
    } else if (scores.problemSolving > 0) {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Precisa desenvolver abordagem mais estruturada para resolução de problemas'
        });
    } else {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Não demonstrou habilidades de resolução de problemas durante a entrevista'
        });
    }
    
    if (scores.leadership >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Mostra potencial de liderança e trabalho em equipe'
        });
    } else if (scores.leadership >= 40) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Habilidades de liderança em desenvolvimento'
        });
    } else if (scores.leadership > 0) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Pode se beneficiar de desenvolvimento em habilidades de liderança'
        });
    } else {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Não demonstrou habilidades de liderança durante a entrevista'
        });
    }
    
    // Se todos os scores são 0, mostrar insight específico
    if (scores.technical === 0 && scores.communication === 0 && 
        scores.problemSolving === 0 && scores.leadership === 0) {
        insights.length = 0; // Limpar insights anteriores
        insights.push({
            type: 'negative',
            icon: 'fa-info-circle',
            text: 'Entrevista muito breve - recomenda-se uma segunda avaliação mais aprofundada'
        });
    }
    
    // Atualizar HTML
    insightsList.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.type}">
            <i class="fas ${insight.icon}"></i>
            <span>${insight.text}</span>
        </div>
    `).join('');
}

// Função auxiliar para mudar aba programaticamente
function showTabProgrammatically(tabName) {
    currentTab = tabName;
    
    // Esconder todas as abas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar aba selecionada
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Ativar botão correspondente
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.textContent.includes('Candidatos Salvos')) {
            btn.classList.add('active');
        }
    });
    
    // Carregar conteúdo específico da aba
    switch(tabName) {
        case 'candidates':
            loadCandidates();
            break;
        case 'comparison':
            loadComparison();
            break;
        case 'analytics':
            loadAnalytics();
            break;
    }
}

function loadCandidates() {
    const candidatesTab = document.getElementById('candidatesTab');
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    
    // Encontrar o container de candidatos ou criar se não existir
    let candidatesContainer = candidatesTab.querySelector('.candidates-list');
    if (!candidatesContainer) {
        // Criar estrutura se não existir
        const cardContent = candidatesTab.querySelector('.card');
        if (cardContent) {
            candidatesContainer = document.createElement('div');
            candidatesContainer.className = 'candidates-list';
            cardContent.appendChild(candidatesContainer);
        }
    }
    
    if (candidatesContainer) {
        if (savedCandidates.length === 0) {
            candidatesContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>Nenhum candidato salvo ainda.</p>
                    <p>Complete uma entrevista para ver os candidatos aqui.</p>
                </div>
            `;
        } else {
            candidatesContainer.innerHTML = savedCandidates.map(candidate => {
                const recommendationClass = candidate.recommendation === 'CONTRATAR' ? 'success' : 
                                           candidate.recommendation === 'TALVEZ' ? 'warning' : 'danger';
                
                return `
                    <div class="candidate-card">
                        <div class="candidate-info">
                            <h4>${candidate.name}</h4>
                            <div class="candidate-meta">
                                <span><i class="fas fa-briefcase"></i> ${candidate.position}</span>
                                <span><i class="fas fa-calendar"></i> ${candidate.date}</span>
                                <span><i class="fas fa-clock"></i> ${candidate.duration} min</span>
                            </div>
                            <div class="candidate-scores" style="margin-top: 0.5rem; font-size: 0.875rem;">
                                <span>Técnico: ${candidate.scores.technical}</span> |
                                <span>Comunicação: ${candidate.scores.communication}</span> |
                                <span>Problem Solving: ${candidate.scores.problemSolving}</span> |
                                <span>Liderança: ${candidate.scores.leadership}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div class="candidate-score">${candidate.scores.overall}</div>
                            <div class="recommendation ${recommendationClass}" style="font-size: 0.75rem; font-weight: bold; margin-top: 0.25rem;">
                                ${candidate.recommendation}
                            </div>
                            <div class="candidate-actions" style="margin-top: 0.5rem;">
                                <button class="btn-small btn-secondary" onclick="viewCandidateDetails('${candidate.id}')">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-small btn-danger" onclick="deleteCandidateData('${candidate.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Função para visualizar detalhes do candidato
function viewCandidateDetails(candidateId) {
    const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
    const candidate = savedCandidates.find(c => c.id === candidateId);
    
    if (candidate) {
        alert(`Detalhes de ${candidate.name}:\n\nScore Geral: ${candidate.scores.overall}\nRecomendação: ${candidate.recommendation}\nDuração: ${candidate.duration} minutos\n\nEsta funcionalidade pode ser expandida para mostrar um modal com mais detalhes.`);
    }
}

// Função para deletar dados do candidato
function deleteCandidateData(candidateId) {
    if (confirm('Tem certeza que deseja excluir este candidato?')) {
        let savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
        savedCandidates = savedCandidates.filter(c => c.id !== candidateId);
        localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
        loadCandidates(); // Recarregar a lista
    }
}

function loadComparison() { 
    console.log('Load comparison'); 
    // Implementar comparação de candidatos se necessário
}

function loadAnalytics() { 
    console.log('Load analytics'); 
    // Implementar analytics se necessário
}

function startProcessUpdate() {
    // Mostrar indicador de carregamento
    const startButton = document.querySelector('button[onclick="startProcessUpdate()"]');
    const originalContent = startButton.innerHTML;
    
    startButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    startButton.disabled = true;
    
    // Simular processo de atualização
    setTimeout(() => {
        // Gerar novos scores aleatórios para demonstrar a atualização
        const newScores = {
            overall: Math.floor(Math.random() * 40) + 60, // 60-100
            technical: Math.floor(Math.random() * 30) + 70, // 70-100
            communication: Math.floor(Math.random() * 60) + 20, // 20-80
            problemSolving: Math.floor(Math.random() * 70) + 10, // 10-80
            leadership: Math.floor(Math.random() * 50) + 30 // 30-80
        };
        
        const newStats = {
            minutes: Math.floor(Math.random() * 5) + 1, // 1-6 minutos
            interactions: Math.floor(Math.random() * 20) + 10, // 10-30
            suggestions: Math.floor(Math.random() * 15) + 15 // 15-30
        };
        
        // Atualizar o relatório com novos dados
        updateReportContent(newScores, newStats);
        
        // Restaurar botão
        startButton.innerHTML = originalContent;
        startButton.disabled = false;
        
        // Mostrar mensagem de sucesso
        showUpdateNotification('Relatório atualizado com sucesso!');
        
    }, 2000); // 2 segundos de "processamento"
}

function updateReportContent(scores, stats) {
    // Atualizar score cards
    const scoreCards = document.querySelectorAll('.score-card .score-value');
    if (scoreCards.length >= 4) {
        scoreCards[0].textContent = scores.overall; // Score Geral
        scoreCards[1].textContent = stats.minutes; // Minutos
        scoreCards[2].textContent = stats.interactions; // Interações
        scoreCards[3].textContent = stats.suggestions; // Sugestões
    }
    
    // Atualizar recomendação
    const recommendation = scores.overall >= 75 ? 'CONTRATAR' : 
                          scores.overall >= 60 ? 'TALVEZ' : 'NÃO CONTRATAR';
    
    const recommendationBadge = document.querySelector('.recommendation-badge');
    const recommendationText = document.querySelector('.recommendation-text');
    
    if (recommendationBadge && recommendationText) {
        // Remover classes antigas
        recommendationBadge.classList.remove('success', 'warning', 'danger');
        
        // Adicionar nova classe e conteúdo
        const badgeClass = recommendation === 'CONTRATAR' ? 'success' : 
                          recommendation === 'TALVEZ' ? 'warning' : 'danger';
        
        const icon = recommendation === 'CONTRATAR' ? 'fa-check-circle' : 
                    recommendation === 'TALVEZ' ? 'fa-exclamation-triangle' : 'fa-times-circle';
        
        recommendationBadge.classList.add(badgeClass);
        recommendationBadge.innerHTML = `<i class="fas ${icon}"></i> Recomendação: ${recommendation}`;
        
        const recommendationTexts = {
            'CONTRATAR': `Candidato demonstra excelente performance (${scores.overall}/100). Recomendado para contratação imediata.`,
            'TALVEZ': `Candidato apresenta potencial mas com algumas lacunas (${scores.overall}/100). Considere entrevista adicional ou plano de desenvolvimento.`,
            'NÃO CONTRATAR': `Candidato não atende aos requisitos mínimos (${scores.overall}/100). Não recomendado para a posição atual.`
        };
        
        recommendationText.textContent = recommendationTexts[recommendation];
    }
    
    // Atualizar scores de competências
    const competencyScores = document.querySelectorAll('.competency-score');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    const competencies = [
        { score: scores.technical, name: 'technical' },
        { score: scores.communication, name: 'communication' },
        { score: scores.problemSolving, name: 'problemSolving' },
        { score: scores.leadership, name: 'leadership' }
    ];
    
    competencies.forEach((comp, index) => {
        if (competencyScores[index] && progressFills[index]) {
            // Atualizar texto do score
            competencyScores[index].textContent = `${comp.score}/100`;
            
            // Atualizar largura da barra
            progressFills[index].style.width = `${comp.score}%`;
            
            // Atualizar classes de cor
            const scoreClass = comp.score >= 80 ? 'excellent' :
                             comp.score >= 60 ? 'good' :
                             comp.score >= 40 ? 'average' : 'poor';
            
            // Remover classes antigas
            competencyScores[index].classList.remove('excellent', 'good', 'average', 'poor');
            progressFills[index].classList.remove('excellent', 'good', 'average', 'poor');
            
            // Adicionar nova classe
            competencyScores[index].classList.add(scoreClass);
            progressFills[index].classList.add(scoreClass);
        }
    });
    
    // Atualizar insights baseado nos novos scores
    updateInsights(scores);
}

function updateInsights(scores) {
    const insightsList = document.querySelector('.insights-list');
    if (!insightsList) return;
    
    const insights = [];
    
    // Insights baseados nos scores
    if (scores.technical >= 80) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Sólida base técnica com conhecimento avançado das tecnologias'
        });
    } else if (scores.technical < 50) {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Necessita desenvolvimento significativo em habilidades técnicas'
        });
    }
    
    if (scores.communication < 40) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Pode se beneficiar de treinamento em comunicação técnica'
        });
    } else if (scores.communication >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Excelente comunicação e capacidade de articulação'
        });
    }
    
    if (scores.problemSolving < 30) {
        insights.push({
            type: 'negative',
            icon: 'fa-times-circle',
            text: 'Precisa desenvolver abordagem mais estruturada para resolução de problemas'
        });
    } else if (scores.problemSolving >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Demonstra excelente capacidade analítica e resolução de problemas'
        });
    }
    
    if (scores.leadership >= 70) {
        insights.push({
            type: 'positive',
            icon: 'fa-check-circle',
            text: 'Mostra potencial de liderança e trabalho em equipe'
        });
    } else if (scores.leadership < 40) {
        insights.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Pode se beneficiar de desenvolvimento em habilidades de liderança'
        });
    }
    
    // Se não há insights suficientes, adicionar um genérico
    if (insights.length === 0) {
        insights.push({
            type: 'warning',
            icon: 'fa-info-circle',
            text: 'Candidato apresenta perfil equilibrado com oportunidades de crescimento'
        });
    }
    
    // Atualizar HTML
    insightsList.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.type}">
            <i class="fas ${insight.icon}"></i>
            <span>${insight.text}</span>
        </div>
    `).join('');
}

function showUpdateNotification(message) {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function exportReport() { 
    console.log('Export report'); 
    // Implementar exportação se necessário
}

function startNewInterview() { 
    // Resetar estado da entrevista
    interviewState = {
        isRecording: false,
        isPaused: false,
        startTime: null,
        currentTime: 0,
        candidateName: '',
        position: '',
        duration: 45,
        transcripts: [],
        suggestions: [],
        topicProgress: {
            technical: 0,
            communication: 0,
            'problem-solving': 0,
            leadership: 0
        },
        scores: {
            overall: 0,
            technical: 0,
            communication: 0,
            problemSolving: 0,
            leadership: 0
        }
    };
    
    // Voltar para a aba de entrevista
    showTabProgrammatically('interview');
    
    // Mostrar painel de setup
    document.getElementById('setupPanel').style.display = 'block';
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'none';
}
