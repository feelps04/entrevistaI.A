// Script para protótipo 100% GRATUITO (Web Speech API + IA Local)
let freeSpeech = null;
let enhancedAI = null;
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
    updateStatus('ready', 'Sistema gratuito pronto');
    freeSpeech = new FreeSpeechIntegration();
    enhancedAI = new EnhancedAIAnalysisSimulator();
    
    // Verificar sistema automaticamente
    setTimeout(checkFreeAPIs, 1000);
});

// Verificar status do sistema gratuito
async function checkFreeAPIs() {
    console.log('🔍 Verificando sistema gratuito...');
    
    // Verificar Web Speech API
    const speechStatus = document.getElementById('speechStatus');
    const speechBadge = speechStatus.querySelector('.status-badge');
    
    speechBadge.textContent = 'Testando...';
    speechBadge.className = 'status-badge checking';
    
    const speechOK = await freeSpeech.testConnection();
    
    if (speechOK) {
        speechBadge.textContent = 'Funcionando';
        speechBadge.className = 'status-badge ready';
        console.log('✅ Web Speech API: Funcionando (GRATUITO)');
        
        // Mostrar informações do serviço
        const serviceInfo = freeSpeech.getServiceInfo();
        console.log('📋 Informações do serviço:', serviceInfo);
    } else {
        speechBadge.textContent = 'Não Suportado';
        speechBadge.className = 'status-badge error';
        console.log('❌ Web Speech API: Não suportado');
        
        // Mostrar instruções na interface
        const browserCheck = document.getElementById('browserCheck');
        browserCheck.innerHTML = `
            <div style="color: #ef4444; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> 
                <strong>Web Speech API não suportada</strong>
            </div>
            <div style="font-size: 0.9rem; color: #6b7280;">
                <p><strong>Soluções:</strong></p>
                <p>1. <strong>Use Chrome, Edge ou Safari</strong></p>
                <p>2. <strong>Certifique-se de não estar em modo privado/incógnito</strong></p>
                <p>3. <strong>Verifique se JavaScript está habilitado</strong></p>
                <button class="btn-secondary" onclick="checkFreeAPIs()" style="margin-top: 1rem;">
                    <i class="fas fa-sync"></i> Testar Novamente
                </button>
            </div>
        `;
    }
    
    // Habilitar botão se Web Speech estiver OK
    const startButton = document.getElementById('startButton');
    startButton.disabled = !speechOK;
    
    if (speechOK) {
        startButton.innerHTML = '<i class="fas fa-play"></i> Iniciar Entrevista Gratuita';
    } else {
        startButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Sistema Não Suportado';
    }
}

// Testar microfone
async function testMicrophone() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✅ Permissão do microfone concedida');
        
        // Parar stream de teste
        stream.getTracks().forEach(track => track.stop());
        
        // Atualizar UI
        const browserCheck = document.getElementById('browserCheck');
        browserCheck.innerHTML = `
            <p style="color: #10b981;"><i class="fas fa-check-circle"></i> <strong>Microfone autorizado!</strong></p>
            <p style="color: #6b7280; font-size: 0.9rem;">Sistema pronto para usar - 100% gratuito</p>
        `;
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao solicitar microfone:', error);
        
        const browserCheck = document.getElementById('browserCheck');
        browserCheck.innerHTML = `
            <div style="color: #ef4444; margin-bottom: 1rem;">
                <i class="fas fa-exclamation-triangle"></i> <strong>Microfone negado</strong>
            </div>
            <div style="font-size: 0.9rem; color: #6b7280;">
                <p><strong>Como autorizar:</strong></p>
                <p>1. Clique no ícone do microfone na barra de endereços</p>
                <p>2. Selecione "Sempre permitir" para este site</p>
                <p>3. Recarregue a página</p>
                <button class="btn-secondary" onclick="testMicrophone()" style="margin-top: 1rem;">
                    <i class="fas fa-microphone"></i> Tentar Novamente
                </button>
            </div>
        `;
        
        return false;
    }
}

// Iniciar entrevista gratuita
async function startFreeInterview() {
    const candidateName = document.getElementById('candidateName').value;
    const position = document.getElementById('position').value;
    const duration = document.getElementById('duration').value;

    if (!candidateName.trim()) {
        alert('Por favor, insira o nome do candidato');
        return;
    }

    // Verificar permissão do microfone
    const micPermission = await testMicrophone();
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

    updateStatus('recording', 'Gravando com Web Speech (Gratuito)...');
    startTimer();

    // Iniciar gravação gratuita
    const started = await freeSpeech.startRecording(handleFreeTranscript);
    
    if (started) {
        addTranscriptMessage('system', 'Entrevista iniciada. Sistema 100% gratuito ativo.');
        console.log('🎙️ Gravação gratuita iniciada');
    } else {
        addTranscriptMessage('system', 'Erro ao iniciar gravação. Verifique navegador e permissões.');
        updateStatus('error', 'Erro na gravação');
    }
}

// Processar transcrição gratuita
function handleFreeTranscript(transcriptData) {
    const { text, speaker, confidence, timestamp, service } = transcriptData;
    
    // Adicionar à transcrição
    addTranscriptMessage(speaker, text);
    
    // Atualizar indicador de confiança
    const confidenceIndicator = document.getElementById('confidenceIndicator');
    const confidencePercent = Math.round(confidence * 100);
    confidenceIndicator.textContent = `Confiança: ${confidencePercent}%`;
    confidenceIndicator.style.color = confidence > 0.8 ? '#10b981' : confidence > 0.6 ? '#f59e0b' : '#ef4444';
    
    // Analisar com IA local melhorada
    const analysis = enhancedAI.analyzeTranscript(text, speaker);
    
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
    
    console.log(`🎤 [${speaker.toUpperCase()}] (${service}):`, text);
}

// Pausar entrevista gratuita
function pauseFreeInterview() {
    interviewState.isPaused = !interviewState.isPaused;
    
    const button = event.currentTarget;
    if (interviewState.isPaused) {
        freeSpeech.stopRecording();
        button.innerHTML = '<i class="fas fa-play"></i> Retomar';
        updateStatus('ready', 'Pausado');
        addTranscriptMessage('system', 'Gravação pausada.');
    } else {
        freeSpeech.startRecording(handleFreeTranscript);
        button.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        updateStatus('recording', 'Gravando...');
        addTranscriptMessage('system', 'Gravação retomada.');
    }
}

// Finalizar entrevista gratuita
function finishFreeInterview() {
    if (!confirm('Tem certeza que deseja finalizar a entrevista?')) {
        return;
    }
    
    interviewState.isRecording = false;
    freeSpeech.stopRecording();
    updateStatus('ready', 'Entrevista finalizada');
    
    addTranscriptMessage('system', 'Entrevista finalizada. Gerando relatório gratuito...');
    
    // Esconder interview e mostrar report
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'block';
    
    generateFreeReport();
}

// Gerar relatório gratuito
function generateFreeReport() {
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
                <div class="score-value">$0</div>
                <div class="score-label">Custo Total</div>
            </div>
        </div>
        
        <div class="recommendation ${recommendationClass}">
            <h3>Recomendação: ${recommendation}</h3>
            <p>${getRecommendationText(recommendation, scores.overall)}</p>
        </div>
        
        <div class="competency-breakdown">
            <h3>Breakdown por Competência (Análise Local Gratuita)</h3>
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
            <h3>Estatísticas da Entrevista Gratuita</h3>
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
                    <span class="stat-label">Custo Total:</span>
                    <span class="stat-value" style="color: #10b981;">$0.00</span>
                </div>
            </div>
        </div>
        
        <div class="key-insights">
            <h3>Insights do Sistema Gratuito</h3>
            <ul class="insight-list">
                ${generateFreeInsights(scores, candidateMessages, totalSuggestions).map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
        
        <div class="cost-info" style="margin-top: 2rem;">
            <h4><i class="fas fa-gift"></i> Sistema 100% Gratuito Utilizado</h4>
            <ul>
                <li><strong>Web Speech API:</strong> Transcrição nativa do navegador</li>
                <li><strong>IA Local:</strong> Algoritmos de análise executados localmente</li>
                <li><strong>Sem APIs pagas:</strong> Nenhum custo operacional</li>
                <li><strong>Privacidade total:</strong> Dados não saem do seu computador</li>
            </ul>
        </div>
    `;
}

// Gerar insights para sistema gratuito
function generateFreeInsights(scores, candidateMessages, totalSuggestions) {
    const insights = [];
    
    if (candidateMessages > 10) {
        insights.push('Candidato participou ativamente da conversa');
    } else if (candidateMessages < 5) {
        insights.push('Candidato foi pouco participativo - considere perguntas mais abertas');
    }
    
    if (totalSuggestions > 8) {
        insights.push('IA local identificou muitas oportunidades de aprofundamento');
    } else if (totalSuggestions < 3) {
        insights.push('Entrevista cobriu bem os tópicos principais');
    }
    
    if (scores.technical > 70) {
        insights.push('Demonstrou conhecimento técnico sólido durante a conversa');
    }
    
    if (scores.communication > 70) {
        insights.push('Comunicação clara e articulada identificada pela IA local');
    }
    
    insights.push('Análise baseada em Web Speech API nativa (gratuita)');
    insights.push('Sugestões geradas por algoritmo local (sem custos)');
    insights.push('Sistema funcionou 100% offline após carregamento inicial');
    
    return insights;
}

// Funções auxiliares (reutilizadas e adaptadas)
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
            return `Candidato demonstra excelente adequação ao perfil da vaga (${score}/100). Análise baseada em sistema gratuito.`;
        case 'TALVEZ':
            return `Candidato apresenta potencial mas com algumas lacunas (${score}/100). Considere entrevista adicional.`;
        case 'NÃO CONTRATAR':
            return `Candidato não atende aos requisitos mínimos da posição (${score}/100). Baseado em análise local gratuita.`;
        default:
            return '';
    }
}

function exportReport() {
    alert('Relatório gerado com sistema 100% gratuito!\n\nEm uma implementação real, isso geraria um PDF completo sem custos adicionais.');
}

function startNewInterview() {
    location.reload();
}
