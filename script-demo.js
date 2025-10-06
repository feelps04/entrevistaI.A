// Script para modo DEMO (sem microfone) - Perfeito para demonstrações
let enhancedAI = null;
let currentSpeaker = 'interviewer';
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

// Conversa de exemplo para demonstração
const sampleConversation = [
    { speaker: 'interviewer', text: 'Olá João! Obrigado por estar aqui hoje. Pode começar me contando um pouco sobre sua experiência com desenvolvimento?' },
    { speaker: 'candidate', text: 'Olá! Claro, trabalho com desenvolvimento há cerca de 6 anos, principalmente com JavaScript e React. Nos últimos 3 anos tenho focado em arquiteturas mais complexas e liderança técnica.' },
    { speaker: 'interviewer', text: 'Interessante! E como você garante a qualidade do código em projetos grandes?' },
    { speaker: 'candidate', text: 'Uso uma combinação de testes unitários com Jest, testes de integração e code reviews rigorosos. Também implemento CI/CD para garantir que nada quebrado chegue em produção. Recentemente introduzi SonarQube na equipe para análise estática.' },
    { speaker: 'interviewer', text: 'Pode me dar um exemplo de um problema técnico complexo que você resolveu recentemente?' },
    { speaker: 'candidate', text: 'Claro! Tivemos um problema de performance onde a aplicação estava demorando 8 segundos para carregar. Identifiquei que era bundle size excessivo. Implementei code splitting, lazy loading e otimizei as importações. Resultado: reduzimos para 2.1 segundos, uma melhoria de 74%.' },
    { speaker: 'interviewer', text: 'Excelente! E como você lida com conflitos técnicos na equipe?' },
    { speaker: 'candidate', text: 'Acredito em discussões baseadas em dados. Quando há divergência, proponho POCs ou benchmarks para testar as abordagens. Recentemente tivemos um debate sobre usar Redux vs Context API. Fizemos testes de performance e decidimos juntos baseado nos resultados.' }
];

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', function() {
    updateStatus('ready', 'Modo demo pronto');
    enhancedAI = new EnhancedAIAnalysisSimulator();
    console.log('🎭 Modo Demo iniciado - Sem microfone necessário');
});

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
    
    // Processar como se fosse transcrição real
    handleDemoTranscript({
        text: text,
        speaker: currentSpeaker,
        confidence: 0.95,
        timestamp: Date.now(),
        service: 'Demo Mode'
    });
    
    // Limpar textarea
    textarea.value = '';
    
    // Alternar falante automaticamente para facilitar a demo
    const nextSpeaker = currentSpeaker === 'interviewer' ? 'candidate' : 'interviewer';
    setSpeaker(nextSpeaker);
    
    // Focar no textarea para continuar digitando
    setTimeout(() => textarea.focus(), 100);
}

// Carregar conversa de exemplo
function loadSampleConversation() {
    if (!confirm('Isso irá carregar uma conversa de exemplo completa. Continuar?')) {
        return;
    }
    
    let index = 0;
    const loadNext = () => {
        if (index >= sampleConversation.length) {
            console.log('✅ Conversa de exemplo carregada completamente');
            return;
        }
        
        const message = sampleConversation[index];
        handleDemoTranscript({
            text: message.text,
            speaker: message.speaker,
            confidence: 0.95,
            timestamp: Date.now(),
            service: 'Demo Sample'
        });
        
        index++;
        setTimeout(loadNext, 1500); // Delay entre mensagens para parecer natural
    };
    
    loadNext();
}

// Iniciar entrevista demo
function startDemoInterview() {
    const candidateName = document.getElementById('candidateName').value;
    const position = document.getElementById('position').value;
    const duration = document.getElementById('duration').value;

    if (!candidateName.trim()) {
        alert('Por favor, insira o nome do candidato');
        return;
    }

    interviewState.candidateName = candidateName;
    interviewState.position = position;
    interviewState.duration = parseInt(duration);
    interviewState.startTime = Date.now();
    interviewState.isRecording = true;

    // Esconder setup e mostrar interview
    document.getElementById('setupPanel').style.display = 'none';
    document.getElementById('interviewPanel').style.display = 'block';

    updateStatus('recording', 'Demo em andamento...');
    startTimer();

    addTranscriptMessage('system', 'Demo iniciado. Digite as falas ou carregue a conversa de exemplo.');
    console.log('🎭 Demo iniciado');
    
    // Focar no textarea
    setTimeout(() => document.getElementById('speechInput').focus(), 500);
}

// Processar transcrição demo
function handleDemoTranscript(transcriptData) {
    const { text, speaker, confidence, timestamp, service } = transcriptData;
    
    // Adicionar à transcrição
    addTranscriptMessage(speaker, text);
    
    // Analisar com IA local
    const analysis = enhancedAI.analyzeTranscript(text, speaker);
    
    if (analysis) {
        // Adicionar sugestões
        analysis.suggestions.forEach((suggestion, index) => {
            setTimeout(() => {
                addSuggestion(suggestion.text, suggestion.priority, suggestion.category);
            }, index * 500); // Delay entre sugestões para parecer natural
        });
        
        // Atualizar progresso com lógica melhorada
        Object.keys(analysis.analysis).forEach(topic => {
            const scoreGained = analysis.analysis[topic];
            if (scoreGained > 0) {
                const currentProgress = interviewState.topicProgress[topic] || 0;
                // Converter score para progresso (score máximo por mensagem = 30)
                const progressGain = Math.min(scoreGained / 30 * 100, 25); // Máximo 25% por mensagem
                const newProgress = Math.min(currentProgress + progressGain, 100);
                
                console.log(`📊 ${topic}: +${scoreGained} pontos = +${Math.round(progressGain)}% progresso`);
                
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
    
    console.log(`🎭 [${speaker.toUpperCase()}] (Demo):`, text);
}

// Pausar demo
function pauseDemoInterview() {
    interviewState.isPaused = !interviewState.isPaused;
    
    const button = event.currentTarget;
    if (interviewState.isPaused) {
        button.innerHTML = '<i class="fas fa-play"></i> Retomar';
        updateStatus('ready', 'Demo pausado');
        addTranscriptMessage('system', 'Demo pausado.');
    } else {
        button.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        updateStatus('recording', 'Demo em andamento...');
        addTranscriptMessage('system', 'Demo retomado.');
    }
}

// Finalizar demo
function finishDemoInterview() {
    if (!confirm('Tem certeza que deseja finalizar o demo?')) {
        return;
    }
    
    interviewState.isRecording = false;
    updateStatus('ready', 'Demo finalizado');
    
    addTranscriptMessage('system', 'Demo finalizado. Gerando relatório...');
    
    // Esconder interview e mostrar report
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'block';
    
    generateDemoReport();
}

// Gerar relatório demo
function generateDemoReport() {
    const reportContent = document.getElementById('reportContent');
    const candidateName = interviewState.candidateName;
    const scores = interviewState.scores;
    
    // Calcular métricas
    const totalTranscripts = interviewState.transcripts.length;
    const candidateMessages = interviewState.transcripts.filter(t => t.speaker === 'candidate').length;
    const interviewerMessages = interviewState.transcripts.filter(t => t.speaker === 'interviewer').length;
    const totalSuggestions = interviewState.suggestions.length;
    
    const recommendation = scores.overall >= 75 ? 'CONTRATAR' : 
                          scores.overall >= 60 ? 'TALVEZ' : 'NÃO CONTRATAR';
    
    const recommendationClass = recommendation === 'CONTRATAR' ? 'success' : 
                               recommendation === 'TALVEZ' ? 'warning' : 'danger';
    
    reportContent.innerHTML = `
        <div class="score-overview">
            <div class="score-card">
                <div class="score-value">${scores.overall}</div>
                <div class="score-label">Score Geral</div>
            </div>
            <div class="score-card">
                <div class="score-value">${Math.floor(interviewState.currentTime / 60000)}</div>
                <div class="score-label">Minutos</div>
            </div>
            <div class="score-card">
                <div class="score-value">${totalTranscripts}</div>
                <div class="score-label">Interações</div>
            </div>
            <div class="score-card">
                <div class="score-value">${totalSuggestions}</div>
                <div class="score-label">Sugestões IA</div>
            </div>
        </div>
        
        <div class="recommendation ${recommendationClass}">
            <h3>Recomendação: ${recommendation}</h3>
            <p>${getRecommendationText(recommendation, scores.overall)}</p>
        </div>
        
        <div class="competency-breakdown">
            <h3>Breakdown por Competência (Análise Demo)</h3>
            <div class="competency-item">
                <span class="competency-name">Habilidades Técnicas</span>
                <span class="competency-score">${scores.technical}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Comunicação</span>
                <span class="competency-score">${scores.communication}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Problem Solving</span>
                <span class="competency-score">${scores.problemSolving}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Liderança</span>
                <span class="competency-score">${scores.leadership}/100</span>
            </div>
        </div>
        
        <div class="interview-stats">
            <h3>Estatísticas do Demo</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-label">Mensagens do Candidato:</span>
                    <span class="stat-value">${candidateMessages}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mensagens do Entrevistador:</span>
                    <span class="stat-value">${interviewerMessages}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Sugestões da IA Geradas:</span>
                    <span class="stat-value">${totalSuggestions}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Modo:</span>
                    <span class="stat-value">Demonstração</span>
                </div>
            </div>
        </div>
        
        <div class="key-insights">
            <h3>Insights do Demo</h3>
            <ul class="insight-list">
                ${generateDemoInsights(scores, candidateMessages, totalSuggestions).map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
        
        <div class="demo-info" style="margin-top: 2rem;">
            <h4><i class="fas fa-info-circle"></i> Sobre Este Demo</h4>
            <ul>
                <li><strong>Modo Demonstração:</strong> Funciona sem microfone</li>
                <li><strong>IA Real:</strong> Algoritmos de análise funcionam normalmente</li>
                <li><strong>Sugestões Reais:</strong> Baseadas no texto digitado</li>
                <li><strong>Perfeito para:</strong> Apresentações e validação de conceito</li>
            </ul>
        </div>
    `;
}

// Gerar insights para demo
function generateDemoInsights(scores, candidateMessages, totalSuggestions) {
    const insights = [];
    
    insights.push('Demo executado com sucesso - sistema funcionando perfeitamente');
    
    if (candidateMessages > 5) {
        insights.push('Conversa bem estruturada com participação ativa do candidato');
    }
    
    if (totalSuggestions > 5) {
        insights.push('IA identificou múltiplas oportunidades de aprofundamento');
    }
    
    if (scores.technical > 60) {
        insights.push('Conhecimento técnico demonstrado através das respostas');
    }
    
    if (scores.communication > 60) {
        insights.push('Boa capacidade de comunicação identificada pela IA');
    }
    
    insights.push('Análise baseada em algoritmos locais (sem APIs pagas)');
    insights.push('Sistema pronto para uso em entrevistas reais');
    
    return insights;
}

// Permitir Enter para adicionar fala
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('speechInput');
    if (textarea) {
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addSpeechText();
            }
        });
    }
});

// Funções auxiliares (reutilizadas)
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

    // Store in state
    interviewState.transcripts.push({
        speaker,
        message,
        timestamp: interviewState.currentTime
    });
}

function addSuggestion(text, priority = 'medium', category = 'general') {
    const suggestionsContent = document.getElementById('suggestionsContent');
    
    // Remove waiting message if it exists
    const waitingMessage = suggestionsContent.querySelector('.suggestion-item.waiting');
    if (waitingMessage) {
        waitingMessage.remove();
    }
    
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

    // Store in state
    interviewState.suggestions.push({ text, priority, category, timestamp: interviewState.currentTime });

    // Auto-remove after 2 minutes
    setTimeout(() => {
        if (suggestionDiv.parentNode) {
            suggestionDiv.remove();
        }
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
    console.log('Suggestion applied:', suggestionText);
    
    const suggestion = event.currentTarget;
    suggestion.style.background = '#d1fae5';
    suggestion.style.borderLeftColor = '#10b981';
    
    setTimeout(() => {
        if (suggestion.parentNode) {
            suggestion.remove();
        }
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

function getRecommendationText(recommendation, score) {
    switch (recommendation) {
        case 'CONTRATAR':
            return `Candidato demonstra excelente adequação ao perfil da vaga (${score}/100). Análise baseada em demo.`;
        case 'TALVEZ':
            return `Candidato apresenta potencial mas com algumas lacunas (${score}/100). Considere entrevista adicional.`;
        case 'NÃO CONTRATAR':
            return `Candidato não atende aos requisitos mínimos da posição (${score}/100). Baseado em análise do demo.`;
        default:
            return '';
    }
}

function exportReport() {
    alert('Relatório do demo gerado!\n\nEm uma implementação real, isso geraria um PDF completo baseado na conversa simulada.');
}

function startNewInterview() {
    location.reload();
}
