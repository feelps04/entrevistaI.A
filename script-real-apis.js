// Script para protótipo com APIs reais (Híbrido: Google Speech + Web Speech + Simulador IA)
let speechService = null;
let aiAnalyzer = null;
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
    updateStatus('ready', 'Pronto para começar');
    speechService = new HybridSpeechIntegration();
    aiAnalyzer = new AIAnalysisSimulator();
    
    // Verificar APIs automaticamente
    setTimeout(checkAPIs, 1000);
});

// Verificar status das APIs
async function checkAPIs() {
    console.log('🔍 Verificando APIs...');
    
    // Verificar Speech Service (híbrido)
    const googleStatus = document.getElementById('googleSpeechStatus');
    const googleBadge = googleStatus.querySelector('.status-badge');
    
    googleBadge.textContent = 'Testando...';
    googleBadge.className = 'status-badge checking';
    
    const speechOK = await speechService.testConnection();
    const serviceName = speechService.getActiveServiceName();
    
    if (speechOK) {
        googleBadge.textContent = serviceName;
        googleBadge.className = 'status-badge ready';
        console.log(`✅ Speech Service: ${serviceName}`);
        
        // Mostrar informação sobre qual serviço está sendo usado
        if (serviceName === 'Web Speech API') {
            googleBadge.textContent = 'Web Speech (Nativo)';
            console.log('💡 Usando Web Speech API - funciona offline!');
        }
    } else {
        googleBadge.textContent = 'Erro';
        googleBadge.className = 'status-badge error';
        console.log('❌ Speech Service: Erro');
        
        // Mostrar mensagem de ajuda
        console.log('💡 Soluções:');
        console.log('   1. Ativar Google Speech API: https://console.cloud.google.com/apis/library/speech.googleapis.com');
        console.log('   2. Ou usar Chrome/Edge para Web Speech API nativa');
        
        // Mostrar instruções na interface
        const permissionCheck = document.querySelector('.permission-check');
        permissionCheck.innerHTML = `
            <div style="color: #ef4444; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> 
                <strong>APIs de Speech não disponíveis</strong>
            </div>
            <div style="font-size: 0.9rem; color: #6b7280;">
                <p><strong>Soluções:</strong></p>
                <p>1. <strong>Ativar Google Speech API:</strong><br>
                   Vá para <a href="https://console.cloud.google.com/apis/library/speech.googleapis.com" target="_blank">Google Cloud Console</a> e ative a API</p>
                <p>2. <strong>Usar navegador compatível:</strong><br>
                   Chrome, Edge ou Safari para Web Speech API nativa</p>
                <button class="btn-secondary" onclick="checkAPIs()" style="margin-top: 1rem;">
                    <i class="fas fa-sync"></i> Testar Novamente
                </button>
            </div>
        `;
    }
    
    // Habilitar botão se pelo menos um serviço estiver OK
    const startButton = document.getElementById('startButton');
    startButton.disabled = !speechOK;
    
    if (speechOK) {
        startButton.innerHTML = `<i class="fas fa-play"></i> Iniciar com ${serviceName}`;
    } else {
        startButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Nenhuma API Disponível';
    }
}

// Solicitar permissão do microfone
async function requestMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Permissão do microfone concedida');
        
        // Parar stream de teste
        stream.getTracks().forEach(track => track.stop());
        
        // Atualizar UI
        const permissionCheck = document.querySelector('.permission-check');
        permissionCheck.innerHTML = `
            <p style="color: #10b981;"><i class="fas fa-check-circle"></i> Microfone autorizado!</p>
        `;
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao solicitar microfone:', error);
        
        const permissionCheck = document.querySelector('.permission-check');
        permissionCheck.innerHTML = `
            <p style="color: #ef4444;"><i class="fas fa-exclamation-triangle"></i> Microfone negado. Necessário para funcionar.</p>
            <button class="btn-secondary" onclick="requestMicrophonePermission()">
                <i class="fas fa-microphone"></i> Tentar Novamente
            </button>
        `;
        
        return false;
    }
}

// Iniciar entrevista real
async function startRealInterview() {
    const candidateName = document.getElementById('candidateName').value;
    const position = document.getElementById('position').value;
    const duration = document.getElementById('duration').value;

    if (!candidateName.trim()) {
        alert('Por favor, insira o nome do candidato');
        return;
    }

    // Verificar permissão do microfone
    const micPermission = await requestMicrophonePermission();
    if (!micPermission) {
        alert('Permissão do microfone é necessária para funcionar');
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

    updateStatus('recording', 'Gravando com Google Speech...');
    startTimer();

    // Iniciar gravação real
    const started = await googleSpeech.startRecording(handleTranscript);
    
    if (started) {
        addTranscriptMessage('system', 'Entrevista iniciada. Gravação em tempo real ativa.');
        console.log('🎙️ Gravação real iniciada');
    } else {
        addTranscriptMessage('system', 'Erro ao iniciar gravação. Verifique permissões.');
        updateStatus('error', 'Erro na gravação');
    }
}

// Processar transcrição recebida
function handleTranscript(transcriptData) {
    const { text, speaker, confidence, timestamp } = transcriptData;
    
    // Adicionar à transcrição
    addTranscriptMessage(speaker, text);
    
    // Atualizar indicador de confiança
    const confidenceIndicator = document.getElementById('confidenceIndicator');
    const confidencePercent = Math.round(confidence * 100);
    confidenceIndicator.textContent = `Confiança: ${confidencePercent}%`;
    confidenceIndicator.style.color = confidence > 0.8 ? '#10b981' : confidence > 0.6 ? '#f59e0b' : '#ef4444';
    
    // Analisar com IA simulada
    const analysis = aiAnalyzer.analyzeTranscript(text, speaker);
    
    if (analysis) {
        // Adicionar sugestões
        analysis.suggestions.forEach(suggestion => {
            addSuggestion(suggestion.text, suggestion.priority, suggestion.category);
        });
        
        // Atualizar progresso
        Object.keys(analysis.analysis).forEach(topic => {
            const currentProgress = interviewState.topicProgress[topic] || 0;
            const newProgress = Math.min(currentProgress + analysis.analysis[topic], 100);
            updateTopicProgress(topic, newProgress);
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

// Pausar entrevista real
function pauseRealInterview() {
    interviewState.isPaused = !interviewState.isPaused;
    
    const button = event.currentTarget;
    if (interviewState.isPaused) {
        googleSpeech.stopRecording();
        button.innerHTML = '<i class="fas fa-play"></i> Retomar';
        updateStatus('ready', 'Pausado');
        addTranscriptMessage('system', 'Gravação pausada.');
    } else {
        googleSpeech.startRecording(handleTranscript);
        button.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        updateStatus('recording', 'Gravando...');
        addTranscriptMessage('system', 'Gravação retomada.');
    }
}

// Finalizar entrevista real
function finishRealInterview() {
    if (!confirm('Tem certeza que deseja finalizar a entrevista?')) {
        return;
    }
    
    interviewState.isRecording = false;
    googleSpeech.stopRecording();
    updateStatus('ready', 'Entrevista finalizada');
    
    addTranscriptMessage('system', 'Entrevista finalizada. Gerando relatório...');
    
    // Esconder interview e mostrar report
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'block';
    
    generateRealReport();
}

// Gerar relatório baseado em dados reais
function generateRealReport() {
    const reportContent = document.getElementById('reportContent');
    const candidateName = interviewState.candidateName;
    const scores = interviewState.scores;
    
    // Calcular métricas reais
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
            <h3>Breakdown por Competência (Baseado em Transcrição Real)</h3>
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
            <h3>Estatísticas da Entrevista</h3>
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
                    <span class="stat-label">Tecnologia Usada:</span>
                    <span class="stat-value">Google Speech-to-Text</span>
                </div>
            </div>
        </div>
        
        <div class="key-insights">
            <h3>Insights Baseados na Conversa Real</h3>
            <ul class="insight-list">
                ${generateRealInsights(scores, candidateMessages, totalSuggestions).map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Gerar insights baseados em dados reais
function generateRealInsights(scores, candidateMessages, totalSuggestions) {
    const insights = [];
    
    if (candidateMessages > 10) {
        insights.push('Candidato participou ativamente da conversa');
    } else if (candidateMessages < 5) {
        insights.push('Candidato foi pouco participativo - considere perguntas mais abertas');
    }
    
    if (totalSuggestions > 8) {
        insights.push('IA identificou muitas oportunidades de aprofundamento');
    } else if (totalSuggestions < 3) {
        insights.push('Entrevista cobriu bem os tópicos principais');
    }
    
    if (scores.technical > 70) {
        insights.push('Demonstrou conhecimento técnico sólido durante a conversa');
    }
    
    if (scores.communication > 70) {
        insights.push('Comunicação clara e articulada identificada pela IA');
    }
    
    insights.push('Análise baseada em transcrição real via Google Speech-to-Text');
    insights.push('Sugestões geradas por algoritmo de IA em tempo real');
    
    return insights;
}

// Funções auxiliares (reutilizadas do script original)
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
            return `Candidato demonstra excelente adequação ao perfil da vaga (${score}/100). Análise baseada em transcrição real.`;
        case 'TALVEZ':
            return `Candidato apresenta potencial mas com algumas lacunas (${score}/100). Considere entrevista adicional.`;
        case 'NÃO CONTRATAR':
            return `Candidato não atende aos requisitos mínimos da posição (${score}/100). Baseado em análise da conversa real.`;
        default:
            return '';
    }
}

function exportReport() {
    alert('Em uma implementação real, isso geraria um PDF com o relatório completo da entrevista baseado na transcrição real.');
}

function startNewInterview() {
    location.reload();
}
