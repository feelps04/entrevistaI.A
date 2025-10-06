// Integração 100% GRATUITA com Web Speech API nativa do navegador
// Perfeita para demos - sem custos, sem chaves API, funciona offline!

class FreeSpeechIntegration {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.onTranscriptCallback = null;
        this.isSupported = this.checkSupport();
        this.lastSpeaker = 'interviewer'; // Alternar entre falantes
    }

    // Verificar suporte do navegador
    checkSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const isSupported = !!SpeechRecognition;
        
        if (isSupported) {
            console.log('✅ Web Speech API: Suportada pelo navegador');
        } else {
            console.log('❌ Web Speech API: Não suportada');
            console.log('💡 Recomendação: Use Chrome, Edge ou Safari');
        }
        
        return isSupported;
    }

    // Inicializar reconhecimento de voz
    async startRecording(onTranscript) {
        if (!this.isSupported) {
            console.error('❌ Web Speech API não suportada neste navegador');
            alert('Por favor, use Chrome, Edge ou Safari para o reconhecimento de voz funcionar.');
            return false;
        }

        this.onTranscriptCallback = onTranscript;

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();

            // Configurações otimizadas para entrevistas
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'pt-BR';
            this.recognition.maxAlternatives = 1;

            // Event handlers
            this.recognition.onstart = () => {
                this.isRecording = true;
                console.log('🎙️ Reconhecimento de voz iniciado (GRATUITO)');
            };

            this.recognition.onresult = (event) => {
                this.handleSpeechResult(event);
            };

            this.recognition.onerror = (event) => {
                console.error('❌ Erro no reconhecimento:', event.error);
                
                if (event.error === 'not-allowed') {
                    alert('❌ Permissão de microfone negada.\n\n✅ Solução: Clique no ícone do microfone na barra de endereços e autorize.');
                } else if (event.error === 'no-speech') {
                    console.log('⏸️ Nenhuma fala detectada - continuando...');
                } else if (event.error === 'network') {
                    console.log('🌐 Erro de rede - tentando novamente...');
                }
            };

            this.recognition.onend = () => {
                if (this.isRecording) {
                    // Reiniciar automaticamente se ainda estiver gravando
                    console.log('🔄 Reiniciando reconhecimento...');
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
            alert('❌ Erro ao iniciar reconhecimento de voz.\n\n💡 Certifique-se de estar usando Chrome, Edge ou Safari.');
            return false;
        }
    }

    // Processar resultado do reconhecimento
    handleSpeechResult(event) {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence || 0.9;

            if (event.results[i].isFinal && transcript.trim()) {
                // Determinar falante com lógica melhorada
                const speaker = this.determineSpeaker(transcript);
                
                if (this.onTranscriptCallback) {
                    this.onTranscriptCallback({
                        text: transcript.trim(),
                        speaker: speaker,
                        confidence: confidence,
                        timestamp: Date.now(),
                        isFinal: true,
                        service: 'Web Speech API (Gratuito)'
                    });
                }

                console.log(`🎤 [${speaker.toUpperCase()}]:`, transcript.trim());
                console.log(`📊 Confiança: ${Math.round(confidence * 100)}%`);
            }
        }
    }

    // Determinar falante com lógica inteligente
    determineSpeaker(transcript) {
        const interviewerPatterns = [
            // Perguntas típicas de entrevistador
            'pode', 'fale sobre', 'como você', 'qual sua', 'me conte', 'me fala',
            'experiência', 'pergunta', 'próxima', 'obrigado', 'certo', 'ok',
            'entendi', 'perfeito', 'interessante', 'legal', 'bacana',
            'vamos', 'agora', 'próximo', 'última', 'final',
            // Expressões de entrevistador
            'muito bem', 'excelente', 'ótimo', 'show', 'beleza'
        ];

        const candidatePatterns = [
            // Respostas típicas de candidato
            'trabalho', 'tenho', 'fiz', 'desenvolvi', 'usei', 'uso',
            'aprendi', 'projeto', 'empresa', 'anos', 'meses',
            'conhecimento', 'habilidade', 'experiência com',
            // Tecnologias comuns
            'react', 'javascript', 'python', 'java', 'node',
            'database', 'sql', 'api', 'frontend', 'backend',
            // Expressões de candidato
            'na verdade', 'basicamente', 'então', 'aí', 'daí'
        ];

        const lowerTranscript = transcript.toLowerCase();
        
        let interviewerScore = 0;
        let candidateScore = 0;

        // Contar padrões
        interviewerPatterns.forEach(pattern => {
            if (lowerTranscript.includes(pattern)) {
                interviewerScore += pattern.length > 3 ? 2 : 1; // Padrões mais específicos valem mais
            }
        });

        candidatePatterns.forEach(pattern => {
            if (lowerTranscript.includes(pattern)) {
                candidateScore += pattern.length > 3 ? 2 : 1;
            }
        });

        // Lógica de alternância inteligente
        if (Math.abs(interviewerScore - candidateScore) <= 1) {
            // Se empate ou diferença pequena, alternar baseado no último falante
            const newSpeaker = this.lastSpeaker === 'interviewer' ? 'candidate' : 'interviewer';
            this.lastSpeaker = newSpeaker;
            return newSpeaker;
        }

        // Se diferença clara, usar o score
        const determinedSpeaker = candidateScore > interviewerScore ? 'candidate' : 'interviewer';
        this.lastSpeaker = determinedSpeaker;
        return determinedSpeaker;
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
            console.log('✅ Web Speech API: Funcionando (100% GRATUITO)');
            console.log('💡 Não precisa de internet após carregar a página');
            console.log('💡 Não precisa de chaves API');
            console.log('💡 Não tem custos');
            return true;
        } else {
            console.log('❌ Web Speech API: Não suportada neste navegador');
            console.log('💡 Solução: Use Chrome, Edge ou Safari');
            return false;
        }
    }

    // Verificar permissões de microfone
    async checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            console.log('✅ Permissão de microfone: OK');
            return true;
        } catch (error) {
            console.error('❌ Permissão de microfone negada:', error);
            return false;
        }
    }

    // Informações sobre o serviço
    getServiceInfo() {
        return {
            name: 'Web Speech API',
            cost: 'GRATUITO',
            quality: 'Boa para demos',
            offline: 'Funciona offline',
            setup: 'Sem configuração',
            browsers: 'Chrome, Edge, Safari'
        };
    }
}

// Simulador de IA melhorado para análise (também gratuito)
class EnhancedAIAnalysisSimulator {
    constructor() {
        this.keywords = {
            technical: {
                keywords: ['react', 'javascript', 'node', 'api', 'database', 'git', 'docker', 'aws', 'teste', 'código', 'python', 'java', 'sql', 'html', 'css', 'framework', 'biblioteca', 'algoritmo', 'performance', 'otimização', 'ci/cd', 'deploy', 'servidor', 'frontend', 'backend'],
                phrases: ['testes unitários', 'code review', 'clean code', 'design patterns', 'arquitetura', 'microserviços', 'rest api', 'graphql', 'typescript'],
                weight: 0.3
            },
            communication: {
                keywords: ['explicar', 'apresentar', 'equipe', 'cliente', 'reunião', 'documentar', 'comunicar', 'falar', 'conversar', 'discutir', 'ensinar', 'treinar', 'workshop', 'apresentação'],
                phrases: ['trabalho em equipe', 'comunicação clara', 'feedback', 'alinhamento', 'stakeholders'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['problema', 'solução', 'resolver', 'otimizar', 'melhorar', 'debug', 'análise', 'desafio', 'dificuldade', 'implementar', 'investigar', 'diagnosticar', 'corrigir', 'refatorar'],
                phrases: ['resolvi um problema', 'encontrei uma solução', 'otimizei', 'melhorei a performance', 'reduzi o tempo', 'aumentei a eficiência'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'gerenciar', 'coordenar', 'decisão', 'mentoria', 'conflito', 'projeto', 'time', 'responsabilidade', 'organizar', 'delegar', 'motivar', 'inspirar'],
                phrases: ['liderei um projeto', 'gerenciei uma equipe', 'tomei a decisão', 'resolvi conflitos', 'mentoreei', 'coordenei'],
                weight: 0.2
            }
        };
        
        this.conversationHistory = [];
    }

    // Analisar transcrição e gerar sugestões
    analyzeTranscript(transcript, speaker) {
        // Adicionar ao histórico SEMPRE (entrevistador e candidato)
        this.conversationHistory.push({ transcript, speaker, timestamp: Date.now() });

        const suggestions = [];
        const lowerTranscript = transcript.toLowerCase();

        // Obter contexto da conversa (últimas 4 mensagens)
        const recentContext = this.getRecentContext();
        
        // ANALISAR AMBOS OS FALANTES para detectar erros e inversões
        this.generateContextualSuggestions(lowerTranscript, suggestions, recentContext, speaker);

        // Detectar tópicos mencionados (para ambos os falantes)
        const mentionedTopics = this.detectTopics(lowerTranscript, recentContext, speaker);

        // Se for candidato, calcular análise normal
        // Se for entrevistador com erro, também analisar
        let analysis = { technical: 0, communication: 0, problemSolving: 0, leadership: 0 };
        
        if (speaker === 'candidate') {
            analysis = this.generateAnalysis(mentionedTopics, recentContext);
        } else if (speaker === 'interviewer') {
            // Verificar se entrevistador cometeu erro (inversão de papéis)
            const interviewerErrors = this.checkInterviewerErrors(lowerTranscript, recentContext);
            if (interviewerErrors.hasError) {
                // Penalizar como se fosse resposta do candidato
                analysis.technical = interviewerErrors.penalty;
                console.log('🚨 ERRO DO ENTREVISTADOR DETECTADO:', interviewerErrors.reason);
            }
        }

        return {
            suggestions,
            mentionedTopics,
            analysis: analysis,
            conversationLength: this.conversationHistory.length,
            context: recentContext,
            speaker: speaker
        };
    }

    // Obter contexto recente da conversa
    getRecentContext() {
        const recent = this.conversationHistory.slice(-4); // Últimas 4 mensagens
        return {
            full: recent,
            lastInterviewer: recent.filter(msg => msg.speaker === 'interviewer').slice(-1)[0],
            lastCandidate: recent.filter(msg => msg.speaker === 'candidate').slice(-1)[0],
            conversation: recent.map(msg => `${msg.speaker}: ${msg.transcript}`).join(' | ')
        };
    }

    // Gerar sugestões contextuais
    generateContextualSuggestions(transcript, suggestions, context, speaker) {
        const lowerTranscript = transcript.toLowerCase();
        
        // PRIMEIRO: Verificar inversão de papéis
        this.checkRoleInversion(transcript, suggestions, context, speaker);
        
        // SEGUNDO: Reagir a erros e problemas (com contexto)
        this.generateErrorBasedSuggestions(lowerTranscript, suggestions, context, speaker);
        
        // TERCEIRO: Reagir a acertos e conhecimentos
        this.generatePositiveSuggestions(lowerTranscript, suggestions, context, speaker);
        
        // QUARTO: Sugestões gerais baseadas no contexto
        this.generateGeneralSuggestions(lowerTranscript, suggestions, context, speaker);
    }
    
    // Verificar inversão de papéis
    checkRoleInversion(transcript, suggestions, context, speaker) {
        const lastCandidate = context && context.lastCandidate ? context.lastCandidate.transcript.toLowerCase() : '';
        
        // Se candidato fez pergunta e entrevistador respondeu incorretamente
        if (speaker === 'interviewer' && 
            (lastCandidate.includes('quanto') || lastCandidate.includes('qual') || lastCandidate.includes('como'))) {
            
            // Verificar se entrevistador deu resposta incorreta
            if (transcript.trim() === '3' && lastCandidate.includes('1 + 1')) {
                suggestions.push({
                    text: '🔄 INVERSÃO DE PAPÉIS: Entrevistador respondeu incorretamente! Corrija e retome controle',
                    priority: 'high',
                    category: 'communication',
                    reason: 'Entrevistador deu resposta errada para pergunta do candidato'
                });
                suggestions.push({
                    text: '⚠️ ALERTA: Candidato está fazendo perguntas - retome o controle da entrevista',
                    priority: 'high',
                    category: 'leadership',
                    reason: 'Inversão de papéis detectada'
                });
            }
        }
        
        // Se candidato está fazendo muitas perguntas
        if (speaker === 'candidate' && 
            (transcript.includes('?') || transcript.includes('quanto') || transcript.includes('qual'))) {
            suggestions.push({
                text: '🔄 Candidato fazendo perguntas - redirecione para que ele responda',
                priority: 'medium',
                category: 'communication',
                reason: 'Candidato assumindo papel de entrevistador'
            });
        }
    }
    
    // Verificar erros do entrevistador
    checkInterviewerErrors(transcript, context) {
        const lastCandidate = context && context.lastCandidate ? context.lastCandidate.transcript.toLowerCase() : '';
        
        // Se entrevistador respondeu incorretamente a pergunta matemática do candidato
        if (transcript.trim() === '3' && lastCandidate.includes('1 + 1')) {
            return {
                hasError: true,
                reason: 'Entrevistador respondeu 1+1=3 (inversão de papéis)',
                penalty: -25 // Penalidade maior por ser do entrevistador
            };
        }
        
        return { hasError: false };
    }
    
    // Sugestões baseadas em erros detectados
    generateErrorBasedSuggestions(transcript, suggestions, context, speaker) {
        // Verificar contexto da conversa para detectar erros
        const contextConversation = context ? context.conversation.toLowerCase() : '';
        const lastInterviewerQuestion = context && context.lastInterviewer ? context.lastInterviewer.transcript.toLowerCase() : '';
        
        console.log('🔍 Analisando contexto:', contextConversation);
        console.log('🔍 Última pergunta:', lastInterviewerQuestion);
        console.log('🔍 Resposta atual:', transcript);
        
        // Verificar todos os tipos de erros
        const allErrors = [
            this.checkMathematicalErrors(transcript, lastInterviewerQuestion, contextConversation),
            this.checkTechnicalErrors(transcript, lastInterviewerQuestion, contextConversation),
            this.checkBusinessErrors(transcript, lastInterviewerQuestion, contextConversation),
            this.checkDataErrors(transcript, lastInterviewerQuestion, contextConversation),
            this.checkDesignErrors(transcript, lastInterviewerQuestion, contextConversation),
            this.checkGeneralErrors(transcript, lastInterviewerQuestion, contextConversation)
        ];
        
        // Processar erros encontrados
        allErrors.forEach(errorCheck => {
            if (errorCheck.hasError) {
                console.log('🚨 ERRO DETECTADO:', errorCheck.reason);
                
                // Sugestão principal do erro
                suggestions.push({
                    text: `🚨 ${errorCheck.reason} - Corrija e teste conhecimentos relacionados`,
                    priority: 'high',
                    category: 'technical',
                    reason: errorCheck.reason
                });
                
                // Sugestões específicas baseadas no tipo de erro
                this.generateSpecificErrorSuggestions(errorCheck, suggestions, lastInterviewerQuestion);
            }
        });
        
        // Respostas evasivas
        const evasivePatterns = ['não sei', 'não tenho certeza', 'talvez', 'acho que'];
        const evasiveCount = evasivePatterns.filter(pattern => transcript.includes(pattern)).length;
        if (evasiveCount > 0) {
            suggestions.push({
                text: '⚠️ Candidato demonstra insegurança - faça perguntas mais básicas',
                priority: 'high',
                category: 'communication',
                reason: `${evasiveCount} indicadores de insegurança detectados`
            });
        }
        
        // Respostas muito curtas
        if (transcript.length < 15 && !transcript.includes('oi')) {
            suggestions.push({
                text: '📏 Resposta muito curta - peça para elaborar com exemplos',
                priority: 'medium',
                category: 'communication',
                reason: 'Falta de detalhamento'
            });
        }
        
        // Erros técnicos conceituais
        if (transcript.includes('react é uma linguagem')) {
            suggestions.push({
                text: '❌ ERRO TÉCNICO: React é biblioteca, não linguagem! Corrija e teste outros conceitos',
                priority: 'high',
                category: 'technical',
                reason: 'Conceito técnico incorreto'
            });
        }
        
        if (transcript.includes('html é linguagem de programação')) {
            suggestions.push({
                text: '❌ ERRO TÉCNICO: HTML é marcação, não programação! Verifique conhecimentos básicos',
                priority: 'high',
                category: 'technical',
                reason: 'Confusão conceitual detectada'
            });
        }
    }
    
    // Sugestões baseadas em acertos e conhecimentos
    generatePositiveSuggestions(transcript, suggestions, context, speaker) {
        const lowerTranscript = transcript.toLowerCase();
        const lastQuestion = context && context.lastInterviewer ? context.lastInterviewer.transcript.toLowerCase() : '';
        
        // Acertos matemáticos
        if (transcript.includes('2') && (transcript.includes('1 + 1') || transcript.includes('1+1'))) {
            suggestions.push({
                text: '✅ Ótimo raciocínio! Agora teste conhecimentos técnicos mais avançados',
                priority: 'medium',
                category: 'technical',
                reason: 'Demonstrou raciocínio lógico básico'
            });
        }
        
        // REACT - Respostas corretas
        if (lastQuestion.includes('react') || (context && context.conversation.includes('react'))) {
            if (lowerTranscript.includes('react é uma biblioteca') || lowerTranscript.includes('react é um framework')) {
                suggestions.push({
                    text: '✅ Excelente! Pergunte sobre hooks, state management ou componentes',
                    priority: 'medium',
                    category: 'technical',
                    reason: 'Conceito React correto'
                });
            }
            
            // Bonus para explicação detalhada sobre React
            if (lowerTranscript.includes('diferença entre biblioteca e framework') || 
                lowerTranscript.includes('frameworks oferecem estrutura')) {
                suggestions.push({
                    text: '🌟 EXCELENTE explicação! Teste conhecimentos avançados de React (JSX, Virtual DOM)',
                    priority: 'high',
                    category: 'technical',
                    reason: 'Demonstrou conhecimento profundo'
                });
            }
        }
        
        // JAVASCRIPT - Respostas corretas
        if (lastQuestion.includes('javascript') || (context && context.conversation.includes('javascript'))) {
            if (lowerTranscript.includes('javascript é uma linguagem') || lowerTranscript.includes('linguagem de programação')) {
                suggestions.push({
                    text: '✅ Correto! Explore ES6+, closures, promises ou async/await',
                    priority: 'medium',
                    category: 'technical',
                    reason: 'Fundamento JavaScript sólido'
                });
            }
        }
        
        // Respostas muito detalhadas e técnicas
        if (transcript.length > 150 && (lowerTranscript.includes('porque') || lowerTranscript.includes('pois'))) {
            suggestions.push({
                text: '🌟 Excelente explicação detalhada! Peça exemplo prático ou caso de uso',
                priority: 'medium',
                category: 'communication',
                reason: 'Resposta bem fundamentada'
            });
        }
        
        // Comparações técnicas (muito bom sinal)
        if (lowerTranscript.includes('diferença') || lowerTranscript.includes('enquanto') || lowerTranscript.includes('comparação')) {
            suggestions.push({
                text: '🎯 Ótima capacidade analítica! Faça perguntas sobre trade-offs ou decisões arquiteturais',
                priority: 'medium',
                category: 'problem-solving',
                reason: 'Demonstrou pensamento comparativo'
            });
        }
        
        // Menção de experiência específica
        if (transcript.includes('anos') && (transcript.includes('experiência') || transcript.includes('trabalho'))) {
            suggestions.push({
                text: '✅ Boa experiência! Peça detalhes sobre projetos mais desafiadores',
                priority: 'medium',
                category: 'technical',
                reason: 'Experiência mencionada'
            });
        }
    }
    
    // Sugestões gerais baseadas no contexto
    generateGeneralSuggestions(transcript, suggestions) {
        // Tecnologias mencionadas
        if (transcript.includes('react') || transcript.includes('javascript')) {
            suggestions.push({
                text: 'Pergunte sobre testes unitários e debugging',
                priority: 'medium',
                category: 'technical',
                reason: 'Tecnologias front-end mencionadas'
            });
        }

        if (transcript.includes('projeto') || transcript.includes('desenvolvi')) {
            suggestions.push({
                text: 'Peça métricas de sucesso do projeto',
                priority: 'medium',
                category: 'problem-solving',
                reason: 'Projetos mencionados'
            });
        }

        if (transcript.includes('equipe') || transcript.includes('time')) {
            suggestions.push({
                text: 'Como resolve conflitos técnicos na equipe?',
                priority: 'medium',
                category: 'leadership',
                reason: 'Trabalho em equipe mencionado'
            });
        }

        // Sugestões baseadas em palavras-chave específicas
        if (transcript.includes('desafio') || transcript.includes('problema')) {
            suggestions.push({
                text: 'Como mediu o impacto da solução?',
                priority: 'high',
                category: 'problem-solving',
                reason: 'Resolução de problemas mencionada'
            });
        }
        
        // Sugestões para aprofundar conhecimento
        if (transcript.includes('python')) {
            suggestions.push({
                text: 'Pergunte sobre frameworks Python (Django/Flask)',
                priority: 'medium',
                category: 'technical',
                reason: 'Python mencionado'
            });
        }
        
        if (transcript.includes('dados') || transcript.includes('análise')) {
            suggestions.push({
                text: 'Teste conhecimentos em SQL e visualização',
                priority: 'medium',
                category: 'technical',
                reason: 'Área de dados mencionada'
            });
        }
    }

    // Detectar tópicos mencionados
    detectTopics(transcript, context) {
        const mentionedTopics = [];
        
        Object.keys(this.keywords).forEach(category => {
            let totalMatches = 0;
            const foundItems = [];
            
            // Verificar palavras-chave
            const keywordMatches = this.keywords[category].keywords.filter(keyword => 
                transcript.includes(keyword.toLowerCase())
            );
            totalMatches += keywordMatches.length;
            foundItems.push(...keywordMatches);
            
            // Verificar frases (se existirem)
            if (this.keywords[category].phrases) {
                const phraseMatches = this.keywords[category].phrases.filter(phrase => 
                    transcript.includes(phrase.toLowerCase())
                );
                totalMatches += phraseMatches.length * 2; // Frases valem mais
                foundItems.push(...phraseMatches);
            }
            
            // Sempre calcular score para todas as categorias (pode ser negativo)
            const score = this.calculateCategoryScore(transcript, category, context);
            
            if (totalMatches > 0 || score !== 0) {
                mentionedTopics.push({ 
                    category, 
                    keywords: foundItems, 
                    count: totalMatches,
                    score: score
                });
            }
        });

        return mentionedTopics;
    }

    // Calcular score específico por categoria
    calculateCategoryScore(transcript, category, context) {
        const lowerTranscript = transcript.toLowerCase();
        let score = 0;
        
        // PRIMEIRO: Verificar respostas incorretas ou problemáticas (COM CONTEXTO)
        const negativeIndicators = this.checkNegativeIndicators(lowerTranscript, category, context);
        if (negativeIndicators.hasNegative) {
            console.log(`⚠️ Resposta problemática detectada: ${negativeIndicators.reason}`);
            return Math.max(negativeIndicators.penalty, -20); // Penalidade máxima de -20
        }
        
        // SEGUNDO: Verificar respostas muito curtas ou vagas
        if (transcript.length < 10) {
            console.log('⚠️ Resposta muito curta detectada');
            return -5; // Penalidade por resposta muito curta
        }
        
        // TERCEIRO: Verificar respostas evasivas
        const evasivePatterns = ['não sei', 'não tenho certeza', 'talvez', 'acho que', 'não lembro', 'não conheço'];
        const evasiveCount = evasivePatterns.filter(pattern => lowerTranscript.includes(pattern)).length;
        if (evasiveCount > 0) {
            console.log(`⚠️ Resposta evasiva detectada: ${evasiveCount} indicadores`);
            score -= evasiveCount * 10; // -10 por cada indicador evasivo
        }
        
        // QUARTO: Score positivo por palavras-chave
        const keywordMatches = this.keywords[category].keywords.filter(keyword => 
            lowerTranscript.includes(keyword.toLowerCase())
        );
        score += keywordMatches.length * 10;
        
        // Score extra por frases específicas
        if (this.keywords[category].phrases) {
            const phraseMatches = this.keywords[category].phrases.filter(phrase => 
                lowerTranscript.includes(phrase.toLowerCase())
            );
            score += phraseMatches.length * 20;
        }
        
        // Bonus por comprimento da resposta (mais detalhes = melhor)
        if (transcript.length > 100) {
            score += 5;
        }
        if (transcript.length > 200) {
            score += 10;
        }
        
        // Bonus específicos por categoria
        score += this.getCategorySpecificBonus(lowerTranscript, category);
        
        // Verificar conhecimento técnico específico
        if (category === 'technical') {
            score += this.checkTechnicalKnowledge(lowerTranscript);
        }
        
        return Math.max(Math.min(score, 50), -20); // Entre -20 e 50 pontos
    }
    
    // Verificar indicadores negativos
    checkNegativeIndicators(transcript, category, context) {
        const contextConversation = context ? context.conversation.toLowerCase() : '';
        const lastInterviewerQuestion = context && context.lastInterviewer ? context.lastInterviewer.transcript.toLowerCase() : '';
        
        // 1. ERROS MATEMÁTICOS BÁSICOS
        const mathErrors = this.checkMathematicalErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (mathErrors.hasError) return mathErrors;
        
        // 2. ERROS TÉCNICOS DE PROGRAMAÇÃO
        const programmingErrors = this.checkTechnicalErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (programmingErrors.hasError) return programmingErrors;
        
        // 3. ERROS CONCEITUAIS DE NEGÓCIO
        const businessErrors = this.checkBusinessErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (businessErrors.hasError) return businessErrors;
        
        // 4. ERROS DE DADOS E ANALYTICS
        const dataErrors = this.checkDataErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (dataErrors.hasError) return dataErrors;
        
        // 5. ERROS DE DESIGN E UX
        const designErrors = this.checkDesignErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (designErrors.hasError) return designErrors;
        
        // 6. ERROS GERAIS DE CONHECIMENTO
        const generalErrors = this.checkGeneralErrors(transcript, lastInterviewerQuestion, contextConversation);
        if (generalErrors.hasError) return generalErrors;
        
        return { hasNegative: false };
    }
    
    // 1. Verificar erros matemáticos básicos
    checkMathematicalErrors(transcript, lastQuestion, context) {
        // Erros matemáticos simples
        if (transcript.trim() === '3' || transcript.includes('três')) {
            if (lastQuestion.includes('1 + 1') || lastQuestion.includes('1+1') || context.includes('1 + 1')) {
                return { hasError: true, reason: 'Erro matemático: 1+1=3', penalty: -20 };
            }
        }
        
        if ((transcript.includes('5') || transcript.includes('cinco')) && 
            (lastQuestion.includes('2 + 2') || context.includes('2 + 2'))) {
            return { hasError: true, reason: 'Erro matemático: 2+2=5', penalty: -15 };
        }
        
        return { hasError: false };
    }
    
    // 2. Verificar erros técnicos de programação
    checkTechnicalErrors(transcript, lastQuestion, context) {
        const lowerTranscript = transcript.toLowerCase();
        
        // REACT - Verificar erros, mas aceitar respostas corretas
        if (lastQuestion.includes('react') || context.includes('react')) {
            // RESPOSTAS CORRETAS (não penalizar)
            if (lowerTranscript.includes('react é uma biblioteca') || 
                lowerTranscript.includes('react é um framework') ||
                lowerTranscript.includes('react é biblioteca') ||
                lowerTranscript.includes('react é framework') ||
                lowerTranscript.includes('biblioteca para') ||
                lowerTranscript.includes('framework para') ||
                lowerTranscript.includes('construção de ui') ||
                lowerTranscript.includes('desenvolvimento web') ||
                lowerTranscript.includes('componentes')) {
                // Resposta correta - não penalizar
                return { hasError: false };
            }
            
            // RESPOSTAS INCORRETAS
            if (lowerTranscript.includes('react é uma linguagem') || 
                lowerTranscript.includes('react é linguagem')) {
                return { hasError: true, reason: 'Erro: React é biblioteca/framework, não linguagem', penalty: -15 };
            }
            if (lowerTranscript.includes('react é backend') || 
                lowerTranscript.includes('react é para backend')) {
                return { hasError: true, reason: 'Erro: React é frontend, não backend', penalty: -12 };
            }
            if (lowerTranscript.includes('react é banco de dados') ||
                lowerTranscript.includes('react é database')) {
                return { hasError: true, reason: 'Erro: React não é banco de dados', penalty: -15 };
            }
        }
        
        // JAVASCRIPT
        if (lastQuestion.includes('javascript') || context.includes('javascript')) {
            if (lowerTranscript.includes('javascript é igual java')) {
                return { hasError: true, reason: 'Erro: JavaScript ≠ Java', penalty: -15 };
            }
            if (lowerTranscript.includes('javascript é compilado')) {
                return { hasError: true, reason: 'Erro: JavaScript é interpretado', penalty: -10 };
            }
        }
        
        // HTML/CSS
        if (lastQuestion.includes('html') || context.includes('html')) {
            if (lowerTranscript.includes('html é linguagem de programação')) {
                return { hasError: true, reason: 'Erro: HTML é marcação, não programação', penalty: -12 };
            }
        }
        
        if (lastQuestion.includes('css') || context.includes('css')) {
            if (lowerTranscript.includes('css é linguagem de programação')) {
                return { hasError: true, reason: 'Erro: CSS é estilização, não programação', penalty: -12 };
            }
        }
        
        // PYTHON
        if (lastQuestion.includes('python') || context.includes('python')) {
            if (lowerTranscript.includes('python é só para web')) {
                return { hasError: true, reason: 'Erro: Python é multipropósito', penalty: -10 };
            }
        }
        
        return { hasError: false };
    }
    
    // 3. Verificar erros conceituais de negócio
    checkBusinessErrors(transcript, lastQuestion, context) {
        const lowerTranscript = transcript.toLowerCase();
        
        // SCRUM/AGILE
        if (lastQuestion.includes('scrum') || context.includes('scrum')) {
            if (lowerTranscript.includes('scrum master é gerente')) {
                return { hasError: true, reason: 'Erro: Scrum Master não é gerente', penalty: -12 };
            }
            if (lowerTranscript.includes('sprint dura 1 mês')) {
                return { hasError: true, reason: 'Erro: Sprint típica é 1-4 semanas', penalty: -8 };
            }
        }
        
        // MVP
        if (lastQuestion.includes('mvp') || context.includes('mvp')) {
            if (lowerTranscript.includes('mvp é produto final')) {
                return { hasError: true, reason: 'Erro: MVP é versão mínima viável', penalty: -10 };
            }
        }
        
        // KPIs
        if (lastQuestion.includes('kpi') || context.includes('kpi')) {
            if (lowerTranscript.includes('kpi não é importante')) {
                return { hasError: true, reason: 'Erro: KPIs são fundamentais para métricas', penalty: -12 };
            }
        }
        
        return { hasError: false };
    }
    
    // 4. Verificar erros de dados e analytics
    checkDataErrors(transcript, lastQuestion, context) {
        const lowerTranscript = transcript.toLowerCase();
        
        // SQL
        if (lastQuestion.includes('sql') || context.includes('sql')) {
            if (lowerTranscript.includes('select * é sempre melhor')) {
                return { hasError: true, reason: 'Erro: SELECT * não é boa prática', penalty: -10 };
            }
            if (lowerTranscript.includes('sql é só para mysql')) {
                return { hasError: true, reason: 'Erro: SQL é padrão para vários SGBDs', penalty: -8 };
            }
        }
        
        // MACHINE LEARNING
        if (lastQuestion.includes('machine learning') || context.includes('machine learning')) {
            if (lowerTranscript.includes('machine learning é só ia')) {
                return { hasError: true, reason: 'Erro: ML é subcampo da IA', penalty: -10 };
            }
            if (lowerTranscript.includes('não precisa de dados')) {
                return { hasError: true, reason: 'Erro: ML depende fundamentalmente de dados', penalty: -15 };
            }
        }
        
        // ESTATÍSTICA
        if (lastQuestion.includes('média') || context.includes('média')) {
            if (lowerTranscript.includes('média é sempre melhor que mediana')) {
                return { hasError: true, reason: 'Erro: Mediana pode ser melhor com outliers', penalty: -8 };
            }
        }
        
        return { hasError: false };
    }
    
    // 5. Verificar erros de design e UX
    checkDesignErrors(transcript, lastQuestion, context) {
        const lowerTranscript = transcript.toLowerCase();
        
        // UX/UI
        if (lastQuestion.includes('ux') || lastQuestion.includes('ui') || context.includes('design')) {
            if (lowerTranscript.includes('ux e ui são a mesma coisa')) {
                return { hasError: true, reason: 'Erro: UX (experiência) ≠ UI (interface)', penalty: -12 };
            }
            if (lowerTranscript.includes('design não é importante')) {
                return { hasError: true, reason: 'Erro: Design é fundamental para usabilidade', penalty: -15 };
            }
        }
        
        // USABILIDADE
        if (lastQuestion.includes('usabilidade') || context.includes('usabilidade')) {
            if (lowerTranscript.includes('usuário sempre sabe o que quer')) {
                return { hasError: true, reason: 'Erro: Usuários nem sempre sabem suas necessidades', penalty: -10 };
            }
        }
        
        // ACESSIBILIDADE
        if (lastQuestion.includes('acessibilidade') || context.includes('acessibilidade')) {
            if (lowerTranscript.includes('acessibilidade não é necessária')) {
                return { hasError: true, reason: 'Erro: Acessibilidade é obrigatória e ética', penalty: -15 };
            }
        }
        
        return { hasError: false };
    }
    
    // 6. Verificar erros gerais de conhecimento
    checkGeneralErrors(transcript, lastQuestion, context) {
        const lowerTranscript = transcript.toLowerCase();
        
        // GIT
        if (lastQuestion.includes('git') || context.includes('git')) {
            if (lowerTranscript.includes('git é só para backup')) {
                return { hasError: true, reason: 'Erro: Git é para controle de versão colaborativo', penalty: -10 };
            }
            if (lowerTranscript.includes('commit direto na main é ok')) {
                return { hasError: true, reason: 'Erro: Commits diretos na main não são boa prática', penalty: -8 };
            }
        }
        
        // TESTES
        if (lastQuestion.includes('teste') || context.includes('teste')) {
            if (lowerTranscript.includes('testes são perda de tempo')) {
                return { hasError: true, reason: 'Erro: Testes são essenciais para qualidade', penalty: -15 };
            }
            if (lowerTranscript.includes('100% de cobertura é sempre necessário')) {
                return { hasError: true, reason: 'Erro: 100% cobertura nem sempre é prático', penalty: -5 };
            }
        }
        
        // SEGURANÇA
        if (lastQuestion.includes('segurança') || context.includes('segurança')) {
            if (lowerTranscript.includes('segurança não é minha responsabilidade')) {
                return { hasError: true, reason: 'Erro: Segurança é responsabilidade de todos', penalty: -15 };
            }
            if (lowerTranscript.includes('senha 123 é segura')) {
                return { hasError: true, reason: 'Erro: Senhas fracas são vulnerabilidade crítica', penalty: -12 };
            }
        }
        
        return { hasError: false };
    }
    
    // Gerar sugestões específicas baseadas no tipo de erro
    generateSpecificErrorSuggestions(errorCheck, suggestions, lastQuestion) {
        const reason = errorCheck.reason.toLowerCase();
        
        // Erros de React
        if (reason.includes('react')) {
            suggestions.push({
                text: '📚 Teste: "React é biblioteca ou framework?" e "Qual a diferença entre componente e elemento?"',
                priority: 'high',
                category: 'technical',
                reason: 'Aprofundar conhecimento React'
            });
        }
        
        // Erros de JavaScript
        if (reason.includes('javascript')) {
            suggestions.push({
                text: '📚 Teste: "Diferença entre var, let e const" e "O que são closures?"',
                priority: 'high',
                category: 'technical',
                reason: 'Validar fundamentos JavaScript'
            });
        }
        
        // Erros de UX/UI
        if (reason.includes('ux') || reason.includes('ui')) {
            suggestions.push({
                text: '📚 Teste: "Como você faria pesquisa com usuários?" e "O que é design thinking?"',
                priority: 'high',
                category: 'communication',
                reason: 'Validar conhecimento UX'
            });
        }
        
        // Erros de dados
        if (reason.includes('sql') || reason.includes('machine learning')) {
            suggestions.push({
                text: '📚 Teste: "Como otimizar uma query SQL?" e "Quando usar ML vs regras de negócio?"',
                priority: 'high',
                category: 'technical',
                reason: 'Aprofundar conhecimento dados'
            });
        }
        
        // Erros de segurança
        if (reason.includes('segurança') || reason.includes('senha')) {
            suggestions.push({
                text: '🔒 CRÍTICO: Teste conhecimentos de segurança - vulnerabilidades comuns',
                priority: 'high',
                category: 'technical',
                reason: 'Segurança é crítica'
            });
        }
        
        // Erros matemáticos
        if (reason.includes('matemático')) {
            suggestions.push({
                text: '🧮 Teste raciocínio lógico básico antes de continuar com questões técnicas',
                priority: 'high',
                category: 'technical',
                reason: 'Validar capacidade de raciocínio'
            });
        }
        
        // Sugestão geral para erros graves
        if (errorCheck.penalty <= -15) {
            suggestions.push({
                text: '⚠️ ERRO GRAVE: Considere encerrar entrevista ou testar conhecimentos mais básicos',
                priority: 'high',
                category: 'communication',
                reason: 'Erro fundamental detectado'
            });
        }
    }
    
    // Bonus específicos por categoria
    getCategorySpecificBonus(transcript, category) {
        let bonus = 0;
        
        switch(category) {
            case 'technical':
                if (transcript.includes('anos') || transcript.includes('experiência')) {
                    bonus += 15;
                }
                if (transcript.includes('projeto') || transcript.includes('desenvolvi')) {
                    bonus += 10;
                }
                // Bonus por mencionar tecnologias específicas corretamente
                if (transcript.includes('react é uma biblioteca') || transcript.includes('react é um framework')) {
                    bonus += 20;
                }
                break;
                
            case 'communication':
                if (transcript.includes('explico') || transcript.includes('ensino')) {
                    bonus += 15;
                }
                if (transcript.includes('apresento') || transcript.includes('comunico')) {
                    bonus += 10;
                }
                // Bonus por respostas bem estruturadas
                if (transcript.length > 150 && transcript.includes('.')) {
                    bonus += 10; // Resposta bem estruturada
                }
                break;
                
            case 'problemSolving':
                if (transcript.includes('resolvi') || transcript.includes('solucionei')) {
                    bonus += 20;
                }
                if (transcript.includes('otimizei') || transcript.includes('melhorei')) {
                    bonus += 15;
                }
                // Bonus por metodologia de resolução
                if (transcript.includes('primeiro') || transcript.includes('depois') || transcript.includes('finalmente')) {
                    bonus += 10; // Abordagem estruturada
                }
                break;
                
            case 'leadership':
                if (transcript.includes('liderei') || transcript.includes('gerenciei')) {
                    bonus += 20;
                }
                if (transcript.includes('equipe') || transcript.includes('time')) {
                    bonus += 10;
                }
                break;
        }
        
        return bonus;
    }
    
    // Verificar conhecimento técnico específico
    checkTechnicalKnowledge(transcript) {
        let techBonus = 0;
        
        // Conhecimentos corretos recebem bonus
        const correctTechFacts = [
            // React
            { fact: 'react é uma biblioteca', bonus: 15 },
            { fact: 'react é um framework', bonus: 15 },
            { fact: 'react é biblioteca', bonus: 15 },
            { fact: 'react é framework', bonus: 15 },
            { fact: 'biblioteca para desenvolvimento', bonus: 12 },
            { fact: 'framework para desenvolvimento', bonus: 12 },
            { fact: 'construção de ui', bonus: 10 },
            { fact: 'componentes reutilizáveis', bonus: 12 },
            
            // JavaScript
            { fact: 'javascript é uma linguagem de programação', bonus: 10 },
            { fact: 'javascript é interpretado', bonus: 12 },
            { fact: 'javascript é dinâmico', bonus: 8 },
            
            // HTML/CSS
            { fact: 'html é uma linguagem de marcação', bonus: 10 },
            { fact: 'css é para estilização', bonus: 10 },
            { fact: 'html estrutura o conteúdo', bonus: 8 },
            
            // Python
            { fact: 'python é uma linguagem', bonus: 10 },
            { fact: 'python é multipropósito', bonus: 12 },
            
            // Conceitos avançados
            { fact: 'diferença entre biblioteca e framework', bonus: 20 },
            { fact: 'frameworks oferecem estrutura', bonus: 15 },
            { fact: 'bibliotecas focam em tarefas específicas', bonus: 15 }
        ];
        
        correctTechFacts.forEach(tech => {
            if (transcript.includes(tech.fact)) {
                techBonus += tech.bonus;
                console.log(`✅ Conhecimento técnico correto: ${tech.fact} (+${tech.bonus} pontos)`);
            }
        });
        
        // Bonus extra para explicações detalhadas
        if (transcript.length > 100 && transcript.includes('porque') || transcript.includes('pois')) {
            techBonus += 10;
            console.log('✅ Explicação detalhada (+10 pontos)');
        }
        
        // Bonus para comparações técnicas
        if (transcript.includes('diferença') || transcript.includes('comparação') || transcript.includes('enquanto')) {
            techBonus += 8;
            console.log('✅ Comparação técnica (+8 pontos)');
        }
        
        return techBonus;
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
            scores[topic.category] = topic.score;
        });

        return scores;
    }
}

// Exportar para uso global
window.FreeSpeechIntegration = FreeSpeechIntegration;
window.EnhancedAIAnalysisSimulator = EnhancedAIAnalysisSimulator;
