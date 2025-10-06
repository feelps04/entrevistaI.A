// Global state
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

// Sample conversation data for simulation
const sampleConversations = {
    'desenvolvedor-senior': [
        {
            speaker: 'interviewer',
            message: 'Olá João! Obrigado por estar aqui hoje. Pode começar me contando um pouco sobre sua experiência com desenvolvimento?',
            timestamp: 2000
        },
        {
            speaker: 'candidate',
            message: 'Olá! Claro, trabalho com desenvolvimento há cerca de 6 anos, principalmente com JavaScript e React. Nos últimos 3 anos tenho focado em arquiteturas mais complexas e liderança técnica.',
            timestamp: 8000,
            triggers: {
                suggestions: [
                    { text: 'Pergunte sobre experiência com testes', priority: 'high', category: 'technical' },
                    { text: 'Explore arquiteturas que já implementou', priority: 'medium', category: 'technical' },
                    { text: 'Como lida com code reviews?', priority: 'low', category: 'leadership' }
                ],
                progress: { technical: 25, communication: 15, leadership: 10 }
            }
        },
        {
            speaker: 'interviewer',
            message: 'Interessante! E como você garante a qualidade do código em projetos grandes?',
            timestamp: 12000
        },
        {
            speaker: 'candidate',
            message: 'Uso uma combinação de testes unitários com Jest, testes de integração e code reviews rigorosos. Também implemento CI/CD para garantir que nada quebrado chegue em produção. Recentemente introduzi SonarQube na equipe para análise estática.',
            timestamp: 20000,
            triggers: {
                suggestions: [
                    { text: 'Peça exemplo específico de bug encontrado', priority: 'high', category: 'problem-solving' },
                    { text: 'Como convenceu a equipe a adotar SonarQube?', priority: 'medium', category: 'leadership' },
                    { text: 'Qual cobertura de testes considera ideal?', priority: 'low', category: 'technical' }
                ],
                progress: { technical: 60, communication: 40, 'problem-solving': 30, leadership: 25 }
            }
        },
        {
            speaker: 'interviewer',
            message: 'Pode me dar um exemplo de um problema técnico complexo que você resolveu recentemente?',
            timestamp: 25000
        },
        {
            speaker: 'candidate',
            message: 'Claro! Tivemos um problema de performance onde a aplicação estava demorando 8 segundos para carregar. Identifiquei que era bundle size excessivo. Implementei code splitting, lazy loading e otimizei as importações. Resultado: reduzimos para 2.1 segundos, uma melhoria de 74%.',
            timestamp: 35000,
            triggers: {
                suggestions: [
                    { text: 'Como mediu o impacto no negócio?', priority: 'high', category: 'problem-solving' },
                    { text: 'Que ferramentas usou para profiling?', priority: 'medium', category: 'technical' },
                    { text: 'Como comunicou os resultados para stakeholders?', priority: 'medium', category: 'communication' }
                ],
                progress: { technical: 85, communication: 60, 'problem-solving': 80, leadership: 40 }
            }
        },
        {
            speaker: 'interviewer',
            message: 'Excelente! E como você lida com conflitos técnicos na equipe?',
            timestamp: 40000
        },
        {
            speaker: 'candidate',
            message: 'Acredito em discussões baseadas em dados. Quando há divergência, proponho POCs ou benchmarks para testar as abordagens. Recentemente tivemos um debate sobre usar Redux vs Context API. Fizemos testes de performance e decidimos juntos baseado nos resultados.',
            timestamp: 50000,
            triggers: {
                suggestions: [
                    { text: 'Como garante que todos se sintam ouvidos?', priority: 'high', category: 'leadership' },
                    { text: 'Já teve que tomar decisão impopular?', priority: 'medium', category: 'leadership' },
                    { text: 'Como documenta essas decisões técnicas?', priority: 'low', category: 'technical' }
                ],
                progress: { technical: 90, communication: 85, 'problem-solving': 90, leadership: 75 }
            }
        }
    ]
};

// Position-specific scoring criteria
const scoringCriteria = {
    'desenvolvedor-senior': {
        technical: {
            keywords: ['react', 'javascript', 'testes', 'ci/cd', 'performance', 'arquitetura', 'code review'],
            weight: 0.4
        },
        communication: {
            keywords: ['explicar', 'documentar', 'stakeholders', 'equipe', 'apresentar'],
            weight: 0.2
        },
        'problem-solving': {
            keywords: ['problema', 'solução', 'otimização', 'debugging', 'análise', 'melhoria'],
            weight: 0.25
        },
        leadership: {
            keywords: ['liderança', 'mentoria', 'decisão', 'conflito', 'equipe', 'poc'],
            weight: 0.15
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateStatus('ready', 'Pronto para começar');
});

// Start interview
function startInterview() {
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

    // Hide setup panel and show interview panel
    document.getElementById('setupPanel').style.display = 'none';
    document.getElementById('interviewPanel').style.display = 'block';

    updateStatus('recording', 'Gravando...');
    startTimer();

    // Add initial message
    addTranscriptMessage('interviewer', 'Entrevista iniciada. Aguardando conversa...');
}

// Timer functionality
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

// Update status indicator
function updateStatus(status, text) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    
    statusDot.className = `status-dot ${status}`;
    statusText.textContent = text;
}

// Add transcript message
function addTranscriptMessage(speaker, message) {
    const transcriptionContent = document.getElementById('transcriptionContent');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'transcript-message';
    
    const speakerSpan = document.createElement('span');
    speakerSpan.className = `speaker ${speaker}`;
    speakerSpan.textContent = speaker === 'interviewer' ? 'Entrevistador:' : 'Candidato:';
    
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

    // Analyze message for scoring
    analyzeMessage(message, speaker);
}

// Add AI suggestion
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

// Apply suggestion (simulate clicking on it)
function applySuggestion(suggestionText) {
    // In a real implementation, this might copy to clipboard or insert into a notes field
    console.log('Suggestion applied:', suggestionText);
    
    // Visual feedback
    const suggestion = event.currentTarget;
    suggestion.style.background = '#d1fae5';
    suggestion.style.borderLeftColor = '#10b981';
    
    setTimeout(() => {
        if (suggestion.parentNode) {
            suggestion.remove();
        }
    }, 1000);
}

// Update topic progress
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

// Analyze message for scoring and suggestions
function analyzeMessage(message, speaker) {
    if (speaker !== 'candidate') return;

    const position = interviewState.position;
    const criteria = scoringCriteria[position];
    
    if (!criteria) return;

    const lowerMessage = message.toLowerCase();
    
    // Update scores based on keywords
    Object.keys(criteria).forEach(category => {
        const { keywords, weight } = criteria[category];
        const matchedKeywords = keywords.filter(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        );
        
        if (matchedKeywords.length > 0) {
            const scoreIncrease = Math.min(matchedKeywords.length * 10, 30);
            const currentScore = interviewState.scores[category] || 0;
            interviewState.scores[category] = Math.min(currentScore + scoreIncrease, 100);
        }
    });

    // Calculate overall score
    const totalWeight = Object.values(criteria).reduce((sum, cat) => sum + cat.weight, 0);
    interviewState.scores.overall = Math.round(
        Object.keys(criteria).reduce((sum, category) => {
            return sum + (interviewState.scores[category] || 0) * criteria[category].weight;
        }, 0) / totalWeight
    );
}

// Simulate conversation
function simulateConversation() {
    const position = interviewState.position;
    const conversation = sampleConversations[position];
    
    if (!conversation) {
        alert('Simulação não disponível para esta posição');
        return;
    }

    let messageIndex = 0;
    
    const playNextMessage = () => {
        if (messageIndex >= conversation.length || !interviewState.isRecording) {
            return;
        }
        
        const message = conversation[messageIndex];
        
        setTimeout(() => {
            addTranscriptMessage(message.speaker, message.message);
            
            // Process triggers
            if (message.triggers) {
                // Add suggestions
                if (message.triggers.suggestions) {
                    message.triggers.suggestions.forEach((suggestion, index) => {
                        setTimeout(() => {
                            addSuggestion(suggestion.text, suggestion.priority, suggestion.category);
                        }, index * 500);
                    });
                }
                
                // Update progress
                if (message.triggers.progress) {
                    Object.keys(message.triggers.progress).forEach(topic => {
                        setTimeout(() => {
                            updateTopicProgress(topic, message.triggers.progress[topic]);
                        }, 1000);
                    });
                }
            }
            
            messageIndex++;
            if (messageIndex < conversation.length) {
                playNextMessage();
            }
        }, messageIndex === 0 ? 1000 : message.timestamp - conversation[messageIndex - 1].timestamp);
    };
    
    playNextMessage();
}

// Toggle suggestions visibility
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

// Pause interview
function pauseInterview() {
    interviewState.isPaused = !interviewState.isPaused;
    
    const button = event.currentTarget;
    if (interviewState.isPaused) {
        button.innerHTML = '<i class="fas fa-play"></i> Retomar';
        updateStatus('ready', 'Pausado');
    } else {
        button.innerHTML = '<i class="fas fa-pause"></i> Pausar';
        updateStatus('recording', 'Gravando...');
    }
}

// Finish interview
function finishInterview() {
    if (!confirm('Tem certeza que deseja finalizar a entrevista?')) {
        return;
    }
    
    interviewState.isRecording = false;
    updateStatus('ready', 'Entrevista finalizada');
    
    // Hide interview panel and show report
    document.getElementById('interviewPanel').style.display = 'none';
    document.getElementById('reportPanel').style.display = 'block';
    
    generateReport();
}

// Generate report
function generateReport() {
    const reportContent = document.getElementById('reportContent');
    const candidateName = interviewState.candidateName;
    const scores = interviewState.scores;
    
    // Calculate final scores with some randomization for demo
    const finalScores = {
        overall: Math.max(scores.overall + Math.floor(Math.random() * 10 - 5), 0),
        technical: Math.max((scores.technical || 0) + Math.floor(Math.random() * 10 - 5), 0),
        communication: Math.max((scores.communication || 0) + Math.floor(Math.random() * 10 - 5), 0),
        problemSolving: Math.max((scores.problemSolving || 0) + Math.floor(Math.random() * 10 - 5), 0),
        leadership: Math.max((scores.leadership || 0) + Math.floor(Math.random() * 10 - 5), 0)
    };
    
    // Ensure scores don't exceed 100
    Object.keys(finalScores).forEach(key => {
        finalScores[key] = Math.min(finalScores[key], 100);
    });
    
    const recommendation = finalScores.overall >= 75 ? 'CONTRATAR' : 
                          finalScores.overall >= 60 ? 'TALVEZ' : 'NÃO CONTRATAR';
    
    const recommendationClass = recommendation === 'CONTRATAR' ? 'success' : 
                               recommendation === 'TALVEZ' ? 'warning' : 'danger';
    
    reportContent.innerHTML = `
        <div class="score-overview">
            <div class="score-card">
                <div class="score-value">${finalScores.overall}</div>
                <div class="score-label">Score Geral</div>
            </div>
            <div class="score-card">
                <div class="score-value">${Math.floor(interviewState.currentTime / 60000)}</div>
                <div class="score-label">Minutos</div>
            </div>
            <div class="score-card">
                <div class="score-value">${interviewState.transcripts.length}</div>
                <div class="score-label">Interações</div>
            </div>
            <div class="score-card">
                <div class="score-value">${interviewState.suggestions.length}</div>
                <div class="score-label">Sugestões</div>
            </div>
        </div>
        
        <div class="recommendation ${recommendationClass}">
            <h3>Recomendação: ${recommendation}</h3>
            <p>${getRecommendationText(recommendation, finalScores.overall)}</p>
        </div>
        
        <div class="competency-breakdown">
            <h3>Breakdown por Competência</h3>
            <div class="competency-item">
                <span class="competency-name">Habilidades Técnicas</span>
                <span class="competency-score">${finalScores.technical}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Comunicação</span>
                <span class="competency-score">${finalScores.communication}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Problem Solving</span>
                <span class="competency-score">${finalScores.problemSolving}/100</span>
            </div>
            <div class="competency-item">
                <span class="competency-name">Liderança</span>
                <span class="competency-score">${finalScores.leadership}/100</span>
            </div>
        </div>
        
        <div class="key-insights">
            <h3>Principais Insights</h3>
            <ul class="insight-list">
                ${generateInsights(finalScores).map(insight => `<li>${insight}</li>`).join('')}
            </ul>
        </div>
    `;
}

// Get recommendation text
function getRecommendationText(recommendation, score) {
    switch (recommendation) {
        case 'CONTRATAR':
            return `Candidato demonstra excelente adequação ao perfil da vaga (${score}/100). Recomendamos prosseguir com a contratação.`;
        case 'TALVEZ':
            return `Candidato apresenta potencial mas com algumas lacunas (${score}/100). Considere entrevista adicional ou plano de desenvolvimento.`;
        case 'NÃO CONTRATAR':
            return `Candidato não atende aos requisitos mínimos da posição (${score}/100). Não recomendamos a contratação neste momento.`;
        default:
            return '';
    }
}

// Generate insights based on scores
function generateInsights(scores) {
    const insights = [];
    
    if (scores.technical >= 80) {
        insights.push('Sólida base técnica com conhecimento avançado das tecnologias');
    } else if (scores.technical < 60) {
        insights.push('Necessita desenvolvimento em habilidades técnicas específicas');
    }
    
    if (scores.communication >= 80) {
        insights.push('Excelente capacidade de comunicação e explicação de conceitos');
    } else if (scores.communication < 60) {
        insights.push('Pode se beneficiar de treinamento em comunicação técnica');
    }
    
    if (scores.problemSolving >= 80) {
        insights.push('Demonstra forte capacidade analítica e resolução de problemas');
    } else if (scores.problemSolving < 60) {
        insights.push('Precisa desenvolver abordagem mais estruturada para resolução de problemas');
    }
    
    if (scores.leadership >= 70) {
        insights.push('Mostra potencial de liderança e capacidade de influenciar equipes');
    } else if (scores.leadership < 50) {
        insights.push('Foco inicial deve ser em contribuição individual antes de liderança');
    }
    
    if (insights.length === 0) {
        insights.push('Candidato apresenta perfil equilibrado para a posição');
    }
    
    return insights;
}

// Export report (simulation)
function exportReport() {
    alert('Em uma implementação real, isso geraria um PDF com o relatório completo da entrevista.');
}

// Start new interview
function startNewInterview() {
    // Reset state
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
    
    // Reset UI
    document.getElementById('reportPanel').style.display = 'none';
    document.getElementById('setupPanel').style.display = 'block';
    
    // Clear form
    document.getElementById('candidateName').value = '';
    document.getElementById('position').selectedIndex = 0;
    document.getElementById('duration').selectedIndex = 1;
    
    // Reset status
    updateStatus('ready', 'Pronto para começar');
}
