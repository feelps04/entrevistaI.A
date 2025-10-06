// =====================================================
// TalentAI Pro - Integração com APIs de IA
// Sistema Profissional de Entrevistas com IA
// =====================================================

// Configuração do servidor backend
const API_BASE_URL = window.location.origin;

// Configuração das APIs
const AI_CONFIG = {
    // URLs dos endpoints
    endpoints: {
        status: `${API_BASE_URL}/api/status`,
        analyze: `${API_BASE_URL}/api/analyze`,
        transcribe: `${API_BASE_URL}/api/transcribe`,
        generateQuestions: `${API_BASE_URL}/api/generate-questions`,
        evaluate: `${API_BASE_URL}/api/evaluate`,
        saveInterview: `${API_BASE_URL}/api/save-interview`,
        listInterviews: `${API_BASE_URL}/api/interviews`
    },
    
    // Configurações de áudio
    audio: {
        sampleRate: 16000,
        channelCount: 1,
        mimeType: 'audio/webm;codecs=opus'
    },
    
    // Configurações de análise
    analysis: {
        realTimeInterval: 30000, // Analisar a cada 30 segundos
        minTranscriptLength: 50, // Mínimo de caracteres para análise
        autoSuggestions: true
    }
};

// =====================================================
// Classe Principal de IA
// =====================================================
class TalentAI {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.transcriptionHistory = [];
        this.analysisResults = [];
        this.currentSession = null;
    }
    
    // Inicializar sistema de IA
    async initialize() {
        try {
            // Verificar APIs disponíveis
            await this.checkAPIsStatus();
            
            // Inicializar reconhecimento de voz
            await this.initializeSpeechRecognition();
            
            console.log('✅ TalentAI inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar TalentAI:', error);
            return false;
        }
    }
    
    // Verificar status das APIs
    async checkAPIsStatus() {
        try {
            const response = await fetch(AI_CONFIG.endpoints.status);
            const status = await response.json();
            
            this.apiStatus = status.apis;
            console.log('📊 Status das APIs:', status.apis);
            
            return status;
        } catch (error) {
            console.error('Erro ao verificar status das APIs:', error);
            return null;
        }
    }
    
    // =====================================================
    // Speech Recognition (Google Speech-to-Text)
    // =====================================================
    async initializeSpeechRecognition() {
        // Usar Web Speech API como fallback
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'pt-BR';
            
            this.recognition.onresult = (event) => {
                this.handleSpeechResult(event);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Erro no reconhecimento de voz:', event.error);
            };
            
            console.log('✅ Reconhecimento de voz inicializado');
        } else {
            console.warn('⚠️ Web Speech API não disponível');
        }
    }
    
    // Processar resultado do reconhecimento de voz
    handleSpeechResult(event) {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        const confidence = event.results[last][0].confidence;
        
        // Adicionar à transcrição
        this.addTranscription({
            text: transcript,
            confidence: confidence,
            timestamp: new Date().toISOString(),
            speaker: this.detectSpeaker(transcript)
        });
        
        // Analisar com GPT-4
        if (event.results[last].isFinal) {
            this.analyzeWithGPT(transcript);
        }
    }
    
    // =====================================================
    // OpenAI GPT-4 Integration
    // =====================================================
    async analyzeWithGPT(transcript) {
        try {
            const response = await fetch(AI_CONFIG.endpoints.analyze, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    transcript: transcript,
                    context: this.currentSession?.context || 'Entrevista inicial',
                    position: this.currentSession?.position || 'Desenvolvedor'
                })
            });
            
            const analysis = await response.json();
            
            // Processar análise
            this.processAnalysis(analysis);
            
            // Atualizar UI
            this.updateUIWithAnalysis(analysis);
            
            return analysis;
        } catch (error) {
            console.error('Erro na análise GPT-4:', error);
            // Fallback para análise local
            return this.localAnalysis(transcript);
        }
    }
    
    // Construir prompt para análise
    buildAnalysisPrompt(transcript) {
        const context = {
            position: this.currentSession?.position || 'Desenvolvedor',
            previousTranscripts: this.transcriptionHistory.slice(-5),
            currentTranscript: transcript
        };
        
        return `
            Posição: ${context.position}
            
            Contexto da conversa:
            ${context.previousTranscripts.map(t => `${t.speaker}: ${t.text}`).join('\n')}
            
            Última resposta do candidato:
            ${transcript}
            
            Analise esta resposta considerando:
            1. Relevância técnica para a posição
            2. Clareza de comunicação
            3. Profundidade do conhecimento demonstrado
            4. Soft skills evidenciadas
        `;
    }
    
    // =====================================================
    // Processamento de Análise
    // =====================================================
    processAnalysis(analysis) {
        // Atualizar scores
        if (analysis.scores) {
            this.updateProgressScores(analysis.scores);
        }
        
        // Gerar sugestões
        if (analysis.suggestions) {
            this.generateSuggestions(analysis.suggestions);
        }
        
        // Identificar insights
        if (analysis.insights) {
            this.addInsights(analysis.insights);
        }
        
        // Salvar análise
        this.analysisResults.push({
            timestamp: new Date().toISOString(),
            analysis: analysis
        });
    }
    
    // Atualizar scores de progresso
    updateProgressScores(scores) {
        const skillMapping = {
            technical: 'Habilidades Técnicas',
            communication: 'Comunicação',
            problemSolving: 'Problem Solving',
            leadership: 'Liderança'
        };
        
        Object.entries(scores).forEach(([skill, score]) => {
            const progressBar = document.querySelector(`[data-skill="${skill}"]`);
            if (progressBar) {
                const fillElement = progressBar.querySelector('.progress-fill');
                const valueElement = progressBar.querySelector('.skill-value');
                
                fillElement.style.width = `${score}%`;
                valueElement.textContent = `${score}%`;
                
                // Adicionar animação
                fillElement.style.transition = 'width 0.5s ease-out';
            }
        });
    }
    
    // =====================================================
    // Geração de Sugestões Inteligentes
    // =====================================================
    generateSuggestions(suggestions) {
        const suggestionsContainer = document.querySelector('.ai-suggestions');
        if (!suggestionsContainer) return;
        
        // Limpar sugestões antigas
        suggestionsContainer.innerHTML = '';
        
        // Adicionar novas sugestões
        suggestions.forEach((suggestion, index) => {
            const priority = this.calculatePriority(suggestion);
            const suggestionCard = this.createSuggestionCard(suggestion, priority);
            suggestionsContainer.appendChild(suggestionCard);
            
            // Animar entrada
            setTimeout(() => {
                suggestionCard.style.animation = 'slideInRight 0.3s ease-out';
            }, index * 100);
        });
    }
    
    // Criar card de sugestão
    createSuggestionCard(suggestion, priority) {
        const card = document.createElement('div');
        card.className = `suggestion-card ${priority}-priority`;
        
        card.innerHTML = `
            <span class="priority-badge">${this.getPriorityLabel(priority)}</span>
            <p>${suggestion.text}</p>
            <div class="suggestion-meta">
                <span class="category">${suggestion.category || 'Geral'}</span>
                <span class="confidence">${suggestion.confidence || 85}% confiança</span>
            </div>
            <button class="use-suggestion" onclick="talentAI.useSuggestion('${suggestion.text}')">
                <i class="fas fa-check"></i>
                Usar
            </button>
        `;
        
        return card;
    }
    
    // =====================================================
    // Análise de Sentimento com Azure
    // =====================================================
    async analyzeSentiment(text) {
        try {
            const endpoint = `https://${AI_CONFIG.azure.region}.api.cognitive.microsoft.com/text/analytics/v3.1/sentiment`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': AI_CONFIG.azure.speechKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documents: [{
                        id: '1',
                        language: 'pt',
                        text: text
                    }]
                })
            });
            
            const data = await response.json();
            return data.documents[0].sentiment;
        } catch (error) {
            console.error('Erro na análise de sentimento:', error);
            return 'neutral';
        }
    }
    
    // =====================================================
    // Gravação e Transcrição com Whisper
    // =====================================================
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
                await this.transcribeWithWhisper(audioBlob);
            };
            
            this.mediaRecorder.start(1000); // Capturar a cada 1 segundo
            this.isRecording = true;
            
            // Atualizar UI
            this.updateRecordingStatus(true);
            
            console.log('🎤 Gravação iniciada');
        } catch (error) {
            console.error('Erro ao iniciar gravação:', error);
        }
    }
    
    // Transcrever áudio com Whisper
    async transcribeWithWhisper(audioBlob) {
        try {
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.webm');
            formData.append('model', AI_CONFIG.whisper.model);
            formData.append('language', AI_CONFIG.whisper.language);
            
            const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            // Adicionar transcrição
            this.addTranscription({
                text: data.text,
                timestamp: new Date().toISOString(),
                source: 'whisper'
            });
            
            // Analisar conteúdo
            await this.analyzeWithGPT(data.text);
            
            return data.text;
        } catch (error) {
            console.error('Erro na transcrição Whisper:', error);
        }
    }
    
    // =====================================================
    // Análise Local (Fallback)
    // =====================================================
    localAnalysis(transcript) {
        // Análise básica quando APIs não estão disponíveis
        const keywords = this.extractKeywords(transcript);
        const sentiment = this.basicSentimentAnalysis(transcript);
        const competencies = this.evaluateCompetencies(transcript);
        
        return {
            scores: {
                technical: this.calculateTechnicalScore(keywords),
                communication: this.calculateCommunicationScore(transcript),
                problemSolving: this.calculateProblemSolvingScore(keywords),
                leadership: this.calculateLeadershipScore(keywords)
            },
            suggestions: this.generateLocalSuggestions(competencies),
            insights: this.generateLocalInsights(sentiment, keywords),
            keywords: keywords,
            sentiment: sentiment
        };
    }
    
    // Extrair palavras-chave
    extractKeywords(text) {
        const technicalTerms = ['javascript', 'react', 'node', 'python', 'api', 'database', 'sql', 'agile', 'scrum'];
        const softSkills = ['liderança', 'equipe', 'comunicação', 'problema', 'solução', 'projeto', 'resultado'];
        
        const words = text.toLowerCase().split(/\s+/);
        return {
            technical: words.filter(w => technicalTerms.some(t => w.includes(t))),
            soft: words.filter(w => softSkills.some(s => w.includes(s)))
        };
    }
    
    // =====================================================
    // UI Updates
    // =====================================================
    updateUIWithAnalysis(analysis) {
        // Atualizar transcrição
        const transcriptionContent = document.querySelector('.transcription-content');
        if (transcriptionContent && this.transcriptionHistory.length > 0) {
            const lastTranscript = this.transcriptionHistory[this.transcriptionHistory.length - 1];
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${lastTranscript.speaker}`;
            messageDiv.innerHTML = `
                <strong>${lastTranscript.speaker === 'candidate' ? 'Candidato' : 'Entrevistador'}:</strong>
                <p>${lastTranscript.text}</p>
                <span class="confidence">${Math.round(lastTranscript.confidence * 100)}% confiança</span>
            `;
            
            transcriptionContent.appendChild(messageDiv);
            transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
        }
        
        // Atualizar status da IA
        const aiStatus = document.querySelector('.ai-status');
        if (aiStatus) {
            aiStatus.textContent = 'Análise concluída';
            aiStatus.style.color = 'var(--green)';
            
            setTimeout(() => {
                aiStatus.textContent = 'Analisando...';
                aiStatus.style.color = 'var(--orange-600)';
            }, 2000);
        }
    }
    
    // =====================================================
    // Helpers
    // =====================================================
    detectSpeaker(transcript) {
        // Lógica simples para detectar quem está falando
        // Em produção, usar análise de voz mais sofisticada
        const candidatePatterns = ['eu', 'minha experiência', 'trabalhei', 'desenvolvi'];
        const interviewerPatterns = ['você', 'poderia', 'qual', 'como você'];
        
        const lowerTranscript = transcript.toLowerCase();
        const candidateScore = candidatePatterns.filter(p => lowerTranscript.includes(p)).length;
        const interviewerScore = interviewerPatterns.filter(p => lowerTranscript.includes(p)).length;
        
        return candidateScore > interviewerScore ? 'candidate' : 'interviewer';
    }
    
    calculatePriority(suggestion) {
        if (suggestion.priority) return suggestion.priority;
        if (suggestion.confidence > 90) return 'high';
        if (suggestion.confidence > 70) return 'medium';
        return 'low';
    }
    
    getPriorityLabel(priority) {
        const labels = {
            'high': 'Alta Prioridade',
            'medium': 'Média',
            'low': 'Baixa'
        };
        return labels[priority] || 'Média';
    }
    
    // Adicionar transcrição ao histórico
    addTranscription(transcription) {
        this.transcriptionHistory.push(transcription);
        
        // Limitar histórico a 100 items
        if (this.transcriptionHistory.length > 100) {
            this.transcriptionHistory.shift();
        }
    }
    
    // Usar sugestão
    useSuggestion(text) {
        // Copiar para clipboard
        navigator.clipboard.writeText(text);
        
        // Mostrar notificação
        this.showNotification('Sugestão copiada para a área de transferência!', 'success');
        
        // Registrar uso
        this.logSuggestionUsage(text);
    }
    
    // Verificar status das APIs
    async checkAPIsStatus() {
        const apis = {
            'OpenAI GPT-4': this.checkOpenAI(),
            'Google Speech': this.checkGoogleSpeech(),
            'Azure Cognitive': this.checkAzure()
        };
        
        const results = await Promise.allSettled(Object.values(apis));
        const apiNames = Object.keys(apis);
        
        console.log('📊 Status das APIs:');
        results.forEach((result, index) => {
            const status = result.status === 'fulfilled' && result.value ? '✅' : '❌';
            console.log(`${status} ${apiNames[index]}`);
        });
    }
    
    async checkOpenAI() {
        // Verificar se a API key está configurada
        return AI_CONFIG.openai.apiKey && AI_CONFIG.openai.apiKey !== 'YOUR_OPENAI_API_KEY';
    }
    
    async checkGoogleSpeech() {
        // Verificar Web Speech API
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    
    async checkAzure() {
        // Verificar configuração Azure
        return AI_CONFIG.azure.speechKey && AI_CONFIG.azure.speechKey !== 'YOUR_AZURE_KEY';
    }
    
    // Mostrar notificação
    showNotification(message, type) {
        // Usar a função de notificação do script principal
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }
    
    // Log de uso de sugestão
    logSuggestionUsage(text) {
        const usage = {
            timestamp: new Date().toISOString(),
            suggestion: text,
            session: this.currentSession
        };
        
        // Salvar no localStorage para análise posterior
        const usageHistory = JSON.parse(localStorage.getItem('suggestion_usage') || '[]');
        usageHistory.push(usage);
        localStorage.setItem('suggestion_usage', JSON.stringify(usageHistory));
    }
    
    // Carregar modelos de análise
    async loadAnalysisModels() {
        // Pré-carregar templates de análise
        this.analysisTemplates = {
            technical: await this.loadTemplate('technical'),
            behavioral: await this.loadTemplate('behavioral'),
            cultural: await this.loadTemplate('cultural')
        };
    }
    
    async loadTemplate(type) {
        // Em produção, carregar de servidor
        return {
            keywords: [],
            weights: {},
            thresholds: {}
        };
    }
    
    // Atualizar status de gravação
    updateRecordingStatus(isRecording) {
        const recordingDot = document.querySelector('.recording-dot');
        if (recordingDot) {
            recordingDot.style.display = isRecording ? 'block' : 'none';
        }
    }
    
    // Calcular scores específicos
    calculateTechnicalScore(keywords) {
        return Math.min(100, keywords.technical.length * 10);
    }
    
    calculateCommunicationScore(transcript) {
        const wordCount = transcript.split(/\s+/).length;
        const clarity = wordCount > 20 && wordCount < 100 ? 20 : 10;
        return Math.min(100, clarity + Math.random() * 30);
    }
    
    calculateProblemSolvingScore(keywords) {
        const problemKeywords = ['solução', 'resolver', 'análise', 'estratégia'];
        const found = keywords.technical.filter(k => problemKeywords.some(p => k.includes(p)));
        return Math.min(100, found.length * 25);
    }
    
    calculateLeadershipScore(keywords) {
        const leadershipKeywords = ['equipe', 'liderança', 'gestão', 'coordenar'];
        const found = keywords.soft.filter(k => leadershipKeywords.some(l => k.includes(l)));
        return Math.min(100, found.length * 20);
    }
    
    // Gerar sugestões locais
    generateLocalSuggestions(competencies) {
        const suggestions = [];
        
        if (competencies.technical < 50) {
            suggestions.push({
                text: 'Pergunte sobre experiência específica com as tecnologias da vaga',
                category: 'Técnico',
                confidence: 85
            });
        }
        
        if (competencies.communication < 60) {
            suggestions.push({
                text: 'Peça exemplos concretos de situações de comunicação em equipe',
                category: 'Comunicação',
                confidence: 75
            });
        }
        
        return suggestions;
    }
    
    // Gerar insights locais
    generateLocalInsights(sentiment, keywords) {
        const insights = [];
        
        if (sentiment === 'positive') {
            insights.push('Candidato demonstra entusiasmo e atitude positiva');
        }
        
        if (keywords.technical.length > 5) {
            insights.push('Forte conhecimento técnico evidenciado');
        }
        
        if (keywords.soft.length > 3) {
            insights.push('Boas habilidades interpessoais mencionadas');
        }
        
        return insights;
    }
    
    // Análise básica de sentimento
    basicSentimentAnalysis(text) {
        const positive = ['ótimo', 'excelente', 'bom', 'feliz', 'sucesso', 'conquista'];
        const negative = ['difícil', 'problema', 'desafio', 'erro', 'falha'];
        
        const words = text.toLowerCase().split(/\s+/);
        const positiveCount = words.filter(w => positive.some(p => w.includes(p))).length;
        const negativeCount = words.filter(w => negative.some(n => w.includes(n))).length;
        
        if (positiveCount > negativeCount) return 'positive';
        if (negativeCount > positiveCount) return 'negative';
        return 'neutral';
    }
    
    // Avaliar competências
    evaluateCompetencies(transcript) {
        return {
            technical: this.calculateTechnicalScore(this.extractKeywords(transcript)),
            communication: this.calculateCommunicationScore(transcript),
            problemSolving: this.calculateProblemSolvingScore(this.extractKeywords(transcript)),
            leadership: this.calculateLeadershipScore(this.extractKeywords(transcript))
        };
    }
    
    // Adicionar insights
    addInsights(insights) {
        const insightsContainer = document.querySelector('.insights-content');
        if (!insightsContainer) return;
        
        insights.forEach((insight, index) => {
            const insightItem = document.createElement('div');
            insightItem.className = 'insight-item';
            insightItem.innerHTML = `
                <i class="fas fa-lightbulb text-orange"></i>
                <div>
                    <h4>${insight.title || 'Novo Insight'}</h4>
                    <p>${insight.description || insight}</p>
                </div>
            `;
            
            insightsContainer.appendChild(insightItem);
            
            // Animar entrada
            setTimeout(() => {
                insightItem.style.animation = 'fadeInUp 0.5s ease-out';
            }, index * 100);
        });
    }
}

// =====================================================
// Inicialização Global
// =====================================================
const talentAI = new TalentAI();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando TalentAI Pro com APIs reais...');
    
    // Inicializar IA
    const initialized = await talentAI.initialize();
    
    if (initialized) {
        console.log('✅ Sistema de IA pronto para uso');
        
        // Atualizar UI para mostrar status
        const statusIndicator = document.querySelector('.ai-badge');
        if (statusIndicator) {
            statusIndicator.textContent = 'IA Ativa';
            statusIndicator.style.background = 'linear-gradient(135deg, var(--green) 0%, #34d399 100%)';
        }
    } else {
        console.warn('⚠️ Sistema funcionando em modo offline');
    }
});

// =====================================================
// Métodos de Gravação e Transcrição
// =====================================================

// Iniciar gravação de áudio
TalentAI.prototype.startRecording = async function() {
    try {
        // Verificar se o navegador suporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('⚠️ Navegador não suporta gravação de áudio');
            this.showNotification('Navegador não suporta gravação de áudio', 'warning');
            return false;
        }

        // Tentar obter permissão do microfone
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                channelCount: AI_CONFIG.audio.channelCount,
                sampleRate: AI_CONFIG.audio.sampleRate,
                echoCancellation: true,
                noiseSuppression: true
            } 
        });
        
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];
        
        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };
        
        this.mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(this.audioChunks, { type: AI_CONFIG.audio.mimeType });
            await this.transcribeAudio(audioBlob);
        };
        
        this.mediaRecorder.start();
        this.isRecording = true;
        
        // Iniciar reconhecimento em tempo real
        if (this.recognition) {
            this.recognition.start();
        }
        
        console.log('🔴 Gravação iniciada');
        return true;
    } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        
        // Mensagens de erro mais específicas
        if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            this.showNotification('Microfone não encontrado. Por favor, conecte um microfone.', 'error');
        } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            this.showNotification('Permissão de microfone negada. Por favor, permita o acesso ao microfone.', 'error');
        } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
            this.showNotification('Microfone já está em uso por outro aplicativo.', 'error');
        } else {
            this.showNotification('Erro ao acessar microfone: ' + error.message, 'error');
        }
        
        // Continuar sem gravação mas com funcionalidades limitadas
        console.log('⚠️ Continuando sem gravação de áudio - modo demonstração');
        return false;
    }
};

// Parar gravação
TalentAI.prototype.stopRecording = function() {
    if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop();
        this.isRecording = false;
        
        // Parar reconhecimento
        if (this.recognition) {
            this.recognition.stop();
        }
        
        console.log('⏹ Gravação parada');
    }
};

// Transcrever áudio com Whisper
TalentAI.prototype.transcribeAudio = async function(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'interview.webm');
        
        const response = await fetch(AI_CONFIG.endpoints.transcribe, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.text) {
            // Adicionar transcrição
            this.addTranscription({
                text: result.text,
                timestamp: new Date().toISOString(),
                duration: result.duration
            });
            
            // Analisar com GPT-4
            await this.analyzeWithGPT(result.text);
        }
        
        return result;
    } catch (error) {
        console.error('Erro na transcrição:', error);
        return null;
    }
};

// Gerar perguntas com IA
TalentAI.prototype.generateQuestions = async function(position, level) {
    try {
        const response = await fetch(AI_CONFIG.endpoints.generateQuestions, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                position: position,
                level: level,
                context: this.currentSession?.context
            })
        });
        
        const result = await response.json();
        return result.questions;
    } catch (error) {
        console.error('Erro ao gerar perguntas:', error);
        return [];
    }
};

// Avaliar candidato completo
TalentAI.prototype.evaluateCandidate = async function() {
    try {
        const transcript = this.transcriptionHistory.map(t => t.text).join(' ');
        
        const response = await fetch(AI_CONFIG.endpoints.evaluate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transcript: transcript,
                position: this.currentSession?.position,
                duration: this.currentSession?.duration
            })
        });
        
        const evaluation = await response.json();
        
        // Salvar entrevista
        await this.saveInterview(evaluation);
        
        return evaluation;
    } catch (error) {
        console.error('Erro na avaliação:', error);
        return null;
    }
};

// Salvar entrevista
TalentAI.prototype.saveInterview = async function(evaluation) {
    try {
        const response = await fetch(AI_CONFIG.endpoints.saveInterview, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                candidateName: this.currentSession?.candidateName,
                position: this.currentSession?.position,
                transcript: this.transcriptionHistory,
                evaluation: evaluation,
                duration: this.currentSession?.duration,
                date: new Date().toISOString()
            })
        });
        
        const result = await response.json();
        console.log('💾 Entrevista salva:', result);
        return result;
    } catch (error) {
        console.error('Erro ao salvar entrevista:', error);
        return null;
    }
};

// Usar sugestão
TalentAI.prototype.useSuggestion = function(suggestionText) {
    const transcriptionContent = document.querySelector('.transcription-content');
    if (transcriptionContent) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message interviewer';
        messageDiv.innerHTML = `
            <strong>Entrevistador:</strong>
            <p>${suggestionText}</p>
        `;
        transcriptionContent.appendChild(messageDiv);
        transcriptionContent.scrollTop = transcriptionContent.scrollHeight;
    }
    
    // Se há síntese de voz disponível
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(suggestionText);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    }
};

// Exportar para uso global
window.TalentAI = TalentAI;
window.talentAI = talentAI;
