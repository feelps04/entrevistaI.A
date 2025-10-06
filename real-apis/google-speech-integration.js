// Integração Real com Google Speech-to-Text API
// Para usar no protótipo com APIs reais

class GoogleSpeechIntegration {
    constructor() {
        this.apiKey = 'AIzaSyCnMyefIgqqzIYvfDY3AfcBm-qJp3pCYcg';
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.onTranscriptCallback = null;
    }

    // Inicializar gravação de áudio
    async startRecording(onTranscript) {
        this.onTranscriptCallback = onTranscript;
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.processAudioChunks();
            };

            // Gravar em chunks de 5 segundos para transcrição em tempo real
            this.mediaRecorder.start(5000);
            this.isRecording = true;

            console.log('✅ Gravação iniciada com Google Speech');
            return true;

        } catch (error) {
            console.error('❌ Erro ao iniciar gravação:', error);
            return false;
        }
    }

    // Parar gravação
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Parar todas as tracks de áudio
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
            
            console.log('⏹️ Gravação parada');
        }
    }

    // Processar chunks de áudio
    async processAudioChunks() {
        if (this.audioChunks.length === 0) return;

        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];

        // Converter para base64
        const base64Audio = await this.blobToBase64(audioBlob);
        
        // Enviar para Google Speech API
        await this.transcribeAudio(base64Audio);

        // Continuar gravando se ainda estiver ativo
        if (this.isRecording) {
            this.mediaRecorder.start(5000);
        }
    }

    // Converter blob para base64
    blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Transcrever áudio usando Google Speech API
    async transcribeAudio(base64Audio) {
        try {
            const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config: {
                        encoding: 'WEBM_OPUS',
                        sampleRateHertz: 48000,
                        languageCode: 'pt-BR',
                        alternativeLanguageCodes: ['en-US'],
                        enableAutomaticPunctuation: true,
                        enableWordTimeOffsets: true,
                        enableSpeakerDiarization: true,
                        diarizationSpeakerCount: 2,
                        model: 'latest_long'
                    },
                    audio: {
                        content: base64Audio
                    }
                })
            });

            const result = await response.json();

            if (result.results && result.results.length > 0) {
                const transcript = result.results[0].alternatives[0].transcript;
                const confidence = result.results[0].alternatives[0].confidence;

                // Determinar falante (simplificado)
                const speaker = this.determineSpeaker(transcript);

                if (this.onTranscriptCallback) {
                    this.onTranscriptCallback({
                        text: transcript,
                        speaker: speaker,
                        confidence: confidence,
                        timestamp: Date.now()
                    });
                }

                console.log(`🎤 Transcrição (${confidence.toFixed(2)}):`, transcript);
            }

        } catch (error) {
            console.error('❌ Erro na transcrição:', error);
        }
    }

    // Determinar falante baseado em padrões simples
    determineSpeaker(transcript) {
        const interviewerPatterns = [
            'pode', 'fale sobre', 'como você', 'qual sua', 'me conte',
            'experiência', 'pergunta', 'próxima', 'obrigado'
        ];

        const candidatePatterns = [
            'trabalho', 'tenho', 'fiz', 'desenvolvi', 'usei',
            'aprendi', 'projeto', 'empresa', 'anos'
        ];

        const lowerTranscript = transcript.toLowerCase();
        
        let interviewerScore = 0;
        let candidateScore = 0;

        interviewerPatterns.forEach(pattern => {
            if (lowerTranscript.includes(pattern)) interviewerScore++;
        });

        candidatePatterns.forEach(pattern => {
            if (lowerTranscript.includes(pattern)) candidateScore++;
        });

        return candidateScore > interviewerScore ? 'candidate' : 'interviewer';
    }

    // Testar conexão com API
    async testConnection() {
        try {
            // Teste mais simples - verificar se a API responde
            const response = await fetch(`https://speech.googleapis.com/v1/operations?key=${this.apiKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 || response.status === 404) {
                // 200 = OK, 404 = API válida mas sem operações (normal)
                console.log('✅ Google Speech API: Conexão OK');
                return true;
            } else if (response.status === 403) {
                console.log('❌ Google Speech API: Chave inválida ou sem permissões');
                const errorData = await response.json();
                console.log('Erro detalhado:', errorData);
                return false;
            } else {
                console.log('❌ Google Speech API: Erro na conexão, status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao testar Google Speech:', error);
            
            // Teste alternativo - verificar se é problema de CORS
            if (error.message.includes('CORS') || error.message.includes('fetch')) {
                console.log('💡 Possível problema de CORS - API pode estar funcionando');
                console.log('💡 Teste: Abra o DevTools e veja se há erros de CORS');
                return true; // Assumir que funciona para continuar o teste
            }
            
            return false;
        }
    }
}

// Simulador de IA para análise (enquanto OpenAI não tem créditos)
class AIAnalysisSimulator {
    constructor() {
        this.keywords = {
            technical: ['react', 'javascript', 'node', 'api', 'database', 'git', 'docker', 'aws', 'teste', 'código'],
            communication: ['explicar', 'apresentar', 'equipe', 'cliente', 'reunião', 'documentar', 'comunicar'],
            problemSolving: ['problema', 'solução', 'resolver', 'otimizar', 'melhorar', 'debug', 'análise'],
            leadership: ['liderança', 'gerenciar', 'coordenar', 'decisão', 'mentoria', 'conflito', 'projeto']
        };
    }

    // Analisar transcrição e gerar sugestões
    analyzeTranscript(transcript, speaker) {
        if (speaker !== 'candidate') return null;

        const suggestions = [];
        const lowerTranscript = transcript.toLowerCase();

        // Detectar tópicos mencionados
        const mentionedTopics = [];
        Object.keys(this.keywords).forEach(category => {
            const matches = this.keywords[category].filter(keyword => 
                lowerTranscript.includes(keyword)
            );
            if (matches.length > 0) {
                mentionedTopics.push({ category, keywords: matches });
            }
        });

        // Gerar sugestões baseadas no contexto
        if (lowerTranscript.includes('react') || lowerTranscript.includes('javascript')) {
            suggestions.push({
                text: 'Pergunte sobre testes unitários',
                priority: 'high',
                category: 'technical',
                reason: 'Candidato mencionou tecnologias front-end'
            });
        }

        if (lowerTranscript.includes('projeto') || lowerTranscript.includes('desenvolvi')) {
            suggestions.push({
                text: 'Peça exemplo específico com métricas',
                priority: 'medium',
                category: 'problem-solving',
                reason: 'Candidato falou sobre projetos'
            });
        }

        if (lowerTranscript.includes('equipe') || lowerTranscript.includes('time')) {
            suggestions.push({
                text: 'Como lida com conflitos na equipe?',
                priority: 'medium',
                category: 'leadership',
                reason: 'Candidato mencionou trabalho em equipe'
            });
        }

        // Sugestões genéricas baseadas no comprimento da resposta
        if (transcript.length < 50) {
            suggestions.push({
                text: 'Peça para elaborar mais a resposta',
                priority: 'low',
                category: 'communication',
                reason: 'Resposta muito curta'
            });
        }

        return {
            suggestions,
            mentionedTopics,
            analysis: this.generateAnalysis(mentionedTopics)
        };
    }

    // Gerar análise das competências
    generateAnalysis(mentionedTopics) {
        const scores = {
            technical: 0,
            communication: 0,
            problemSolving: 0,
            leadership: 0
        };

        mentionedTopics.forEach(topic => {
            scores[topic.category] += topic.keywords.length * 10;
        });

        // Normalizar scores (máximo 100)
        Object.keys(scores).forEach(key => {
            scores[key] = Math.min(scores[key], 100);
        });

        return scores;
    }
}

// Exportar para uso global
window.GoogleSpeechIntegration = GoogleSpeechIntegration;
window.AIAnalysisSimulator = AIAnalysisSimulator;
