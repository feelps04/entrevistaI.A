// Integração com Web Speech API (nativa do navegador)
// Alternativa ao Google Speech que funciona sem problemas de CORS

class WebSpeechIntegration {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.onTranscriptCallback = null;
        this.isSupported = this.checkSupport();
    }

    // Verificar suporte do navegador
    checkSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        return !!SpeechRecognition;
    }

    // Inicializar reconhecimento de voz
    async startRecording(onTranscript) {
        if (!this.isSupported) {
            console.error('❌ Web Speech API não suportada neste navegador');
            return false;
        }

        this.onTranscriptCallback = onTranscript;

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            // Configurações
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'pt-BR';
            this.recognition.maxAlternatives = 1;

            // Event handlers
            this.recognition.onstart = () => {
                this.isRecording = true;
                console.log('✅ Reconhecimento de voz iniciado');
            };

            this.recognition.onresult = (event) => {
                this.handleSpeechResult(event);
            };

            this.recognition.onerror = (event) => {
                console.error('❌ Erro no reconhecimento:', event.error);
                if (event.error === 'not-allowed') {
                    alert('Permissão de microfone negada. Por favor, autorize o acesso.');
                }
            };

            this.recognition.onend = () => {
                if (this.isRecording) {
                    // Reiniciar automaticamente se ainda estiver gravando
                    setTimeout(() => {
                        if (this.isRecording) {
                            this.recognition.start();
                        }
                    }, 100);
                }
            };

            // Iniciar reconhecimento
            this.recognition.start();
            return true;

        } catch (error) {
            console.error('❌ Erro ao iniciar reconhecimento:', error);
            return false;
        }
    }

    // Processar resultado do reconhecimento
    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;

            if (event.results[i].isFinal) {
                finalTranscript += transcript;
                
                // Determinar falante (simplificado)
                const speaker = this.determineSpeaker(transcript);
                
                if (this.onTranscriptCallback && transcript.trim()) {
                    this.onTranscriptCallback({
                        text: transcript.trim(),
                        speaker: speaker,
                        confidence: confidence || 0.9, // Web Speech nem sempre retorna confidence
                        timestamp: Date.now(),
                        isFinal: true
                    });
                }
            } else {
                interimTranscript += transcript;
            }
        }

        // Log para debug
        if (finalTranscript) {
            console.log('🎤 Transcrição final:', finalTranscript);
        }
    }

    // Determinar falante baseado em padrões
    determineSpeaker(transcript) {
        const interviewerPatterns = [
            'pode', 'fale sobre', 'como você', 'qual sua', 'me conte',
            'experiência', 'pergunta', 'próxima', 'obrigado', 'certo',
            'entendi', 'perfeito', 'interessante'
        ];

        const candidatePatterns = [
            'trabalho', 'tenho', 'fiz', 'desenvolvi', 'usei',
            'aprendi', 'projeto', 'empresa', 'anos', 'experiência',
            'conhecimento', 'habilidade'
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

        // Se não conseguir determinar, alternar baseado no histórico
        if (interviewerScore === candidateScore) {
            return Math.random() > 0.5 ? 'candidate' : 'interviewer';
        }

        return candidateScore > interviewerScore ? 'candidate' : 'interviewer';
    }

    // Parar reconhecimento
    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.isRecording = false;
            this.recognition.stop();
            console.log('⏹️ Reconhecimento de voz parado');
        }
    }

    // Testar conexão (sempre funciona se suportado)
    async testConnection() {
        if (this.isSupported) {
            console.log('✅ Web Speech API: Suportada pelo navegador');
            return true;
        } else {
            console.log('❌ Web Speech API: Não suportada neste navegador');
            console.log('💡 Recomendação: Use Chrome, Edge ou Safari');
            return false;
        }
    }

    // Verificar permissões de microfone
    async checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('❌ Permissão de microfone negada:', error);
            return false;
        }
    }
}

// Classe híbrida que tenta Google Speech primeiro, depois Web Speech
class HybridSpeechIntegration {
    constructor() {
        this.googleSpeech = new GoogleSpeechIntegration();
        this.webSpeech = new WebSpeechIntegration();
        this.activeService = null;
    }

    async testConnection() {
        console.log('🔍 Testando Google Speech API...');
        const googleWorks = await this.googleSpeech.testConnection();
        
        console.log('🔍 Testando Web Speech API...');
        const webWorks = await this.webSpeech.testConnection();

        if (googleWorks) {
            console.log('✅ Usando Google Speech API');
            this.activeService = this.googleSpeech;
            return true;
        } else if (webWorks) {
            console.log('✅ Usando Web Speech API (nativa do navegador)');
            this.activeService = this.webSpeech;
            return true;
        } else {
            console.log('❌ Nenhum serviço de speech disponível');
            return false;
        }
    }

    async startRecording(onTranscript) {
        if (!this.activeService) {
            const hasService = await this.testConnection();
            if (!hasService) return false;
        }

        return await this.activeService.startRecording(onTranscript);
    }

    stopRecording() {
        if (this.activeService) {
            this.activeService.stopRecording();
        }
    }

    getActiveServiceName() {
        if (this.activeService === this.googleSpeech) {
            return 'Google Speech API';
        } else if (this.activeService === this.webSpeech) {
            return 'Web Speech API';
        } else {
            return 'Nenhum';
        }
    }
}

// Exportar para uso global
window.WebSpeechIntegration = WebSpeechIntegration;
window.HybridSpeechIntegration = HybridSpeechIntegration;
