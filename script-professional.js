// TalentAI Pro - Professional JavaScript
// =====================================================

// State Management
const state = {
    currentTab: 'dashboard',
    isInterviewActive: false,
    interviewTimer: null,
    elapsedTime: 0,
    interviewData: {
        candidateName: '',
        position: '',
        duration: 45,
        startTime: null,
        transcripts: [],
        suggestions: [],
        progress: {
            technical: 0,
            communication: 0,
            problemSolving: 0,
            leadership: 0
        }
    }
};

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeInteractions();
    initializeCharts();
    animateOnScroll();
});

// Navigation System
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Get tab name
            const tabName = this.dataset.tab;
            
            // Show corresponding content
            showContent(tabName);
            
            // Update breadcrumb
            updateBreadcrumb(tabName);
        });
    });
}

// Content Display Manager
function showContent(tabName) {
    // Hide all content areas
    const contentAreas = document.querySelectorAll('.content-area');
    contentAreas.forEach(area => {
        area.style.display = 'none';
    });
    
    // Show selected content
    switch(tabName) {
        case 'dashboard':
            document.getElementById('dashboardContent').style.display = 'block';
            break;
        case 'interview':
            document.getElementById('interviewContent').style.display = 'block';
            break;
        case 'candidates':
            document.getElementById('candidatesContent').style.display = 'block';
            loadCandidates();
            break;
        case 'reports':
            showReports();
            break;
        case 'settings':
            showSettings();
            break;
    }
    
    state.currentTab = tabName;
}

// Update Breadcrumb
function updateBreadcrumb(tabName) {
    const breadcrumb = document.querySelector('.breadcrumb .current');
    const tabNames = {
        'dashboard': 'Dashboard',
        'interview': 'Nova Entrevista',
        'candidates': 'Candidatos',
        'reports': 'Relatórios',
        'settings': 'Configurações'
    };
    
    breadcrumb.textContent = tabNames[tabName] || 'Dashboard';
}

// Start Interview function removed - using the async version below with real APIs

// Timer Function
function startTimer() {
    const timerElement = document.querySelector('.timer');
    let seconds = 0;
    
    setInterval(() => {
        if (state.isInterviewActive) {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }, 1000);
}

// Simulate Interview Progress
function simulateInterview() {
    const skills = ['technical', 'communication', 'problemSolving', 'leadership'];
    const progressIntervals = [];
    
    skills.forEach((skill, index) => {
        const interval = setInterval(() => {
            if (state.isInterviewActive) {
                const currentProgress = state.interviewData.progress[skill];
                if (currentProgress < 100) {
                    const increment = Math.random() * 15 + 5;
                    const newProgress = Math.min(currentProgress + increment, 100);
                    
                    state.interviewData.progress[skill] = newProgress;
                    updateProgressBar(skill, newProgress);
                    
                    // Generate suggestions at certain thresholds
                    if (newProgress > 30 && newProgress < 40) {
                        generateSuggestion('medium');
                    } else if (newProgress > 60 && newProgress < 70) {
                        generateSuggestion('high');
                    }
                }
            } else {
                clearInterval(interval);
            }
        }, 3000 + index * 1000);
        
        progressIntervals.push(interval);
    });
}

// Update Progress Bar
function updateProgressBar(skill, value) {
    const skillMap = {
        'technical': 'Habilidades Técnicas',
        'communication': 'Comunicação',
        'problemSolving': 'Problem Solving',
        'leadership': 'Liderança'
    };
    
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const header = item.querySelector('.skill-header span:first-child');
        if (header.textContent === skillMap[skill]) {
            const valueSpan = item.querySelector('.skill-value');
            const progressFill = item.querySelector('.progress-fill');
            
            valueSpan.textContent = `${Math.round(value)}%`;
            progressFill.style.width = `${value}%`;
            
            // Add animation
            progressFill.style.transition = 'width 0.5s ease-out';
        }
    });
}

// Generate AI Suggestions
function generateSuggestion(priority) {
    const suggestions = {
        high: [
            'Pergunte sobre experiência com arquitetura de microsserviços',
            'Explore situações de liderança em projetos críticos',
            'Questione sobre resolução de conflitos técnicos'
        ],
        medium: [
            'Verifique conhecimento em metodologias ágeis',
            'Pergunte sobre trabalho em equipe',
            'Explore experiência com code review'
        ]
    };
    
    const randomSuggestion = suggestions[priority][Math.floor(Math.random() * suggestions[priority].length)];
    
    // Add suggestion to UI (you can implement this)
    console.log(`New ${priority} priority suggestion: ${randomSuggestion}`);
}

// Finish Interview
function finishInterviewPro() {
    if (!confirm('Deseja finalizar a entrevista e gerar o relatório?')) {
        return;
    }
    
    state.isInterviewActive = false;
    
    // Calculate final scores
    const progress = state.interviewData.progress;
    const overallScore = Math.round(
        (progress.technical + progress.communication + progress.problemSolving + progress.leadership) / 4
    );
    
    // Generate report
    generateReport(overallScore, progress);
    
    // Show notification
    showNotification('Relatório gerado com sucesso!', 'success');
    
    // Navigate to candidates
    setTimeout(() => {
        document.querySelector('[data-tab="candidates"]').click();
    }, 1500);
}

// Generate Report
function generateReport(overallScore, progress) {
    const report = {
        candidateName: state.interviewData.candidateName,
        position: state.interviewData.position,
        date: new Date().toLocaleDateString('pt-BR'),
        overallScore: overallScore,
        skills: progress,
        recommendation: overallScore >= 75 ? 'Aprovado' : overallScore >= 50 ? 'Em análise' : 'Rejeitado',
        insights: generateInsights(progress)
    };
    
    // Save to localStorage
    let reports = JSON.parse(localStorage.getItem('talentai_reports') || '[]');
    reports.push(report);
    localStorage.setItem('talentai_reports', JSON.stringify(reports));
    
    return report;
}

// Generate Insights
function generateInsights(progress) {
    const insights = [];
    
    if (progress.technical > 80) {
        insights.push('Excelente conhecimento técnico demonstrado');
    }
    if (progress.communication < 50) {
        insights.push('Necessita melhorar habilidades de comunicação');
    }
    if (progress.leadership > 70) {
        insights.push('Forte potencial de liderança identificado');
    }
    
    return insights;
}

// Load Candidates
function loadCandidates() {
    const reports = JSON.parse(localStorage.getItem('talentai_reports') || '[]');
    const candidatesGrid = document.querySelector('.candidates-grid');
    
    if (!candidatesGrid) {
        // Create candidates grid if doesn't exist
        const candidatesContent = document.getElementById('candidatesContent');
        const grid = document.createElement('div');
        grid.className = 'candidates-grid';
        candidatesContent.appendChild(grid);
    }
    
    const grid = document.querySelector('.candidates-grid');
    
    if (reports.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <h3>Nenhum candidato encontrado</h3>
                <p>Complete entrevistas para ver candidatos aqui</p>
            </div>
        `;
    } else {
        grid.innerHTML = reports.map(report => `
            <div class="candidate-card">
                <div class="candidate-header">
                    <img src="https://ui-avatars.com/api/?name=${report.candidateName}&background=ff6b35&color=fff" alt="${report.candidateName}">
                    <div>
                        <h4>${report.candidateName}</h4>
                        <p>${report.position}</p>
                        <span class="date">${report.date}</span>
                    </div>
                </div>
                <div class="candidate-score">
                    <div class="overall-score ${report.overallScore >= 75 ? 'high' : report.overallScore >= 50 ? 'medium' : 'low'}">
                        ${report.overallScore}
                    </div>
                    <span class="recommendation ${report.recommendation === 'Aprovado' ? 'approved' : report.recommendation === 'Em análise' ? 'maybe' : 'rejected'}">
                        ${report.recommendation}
                    </span>
                </div>
                <div class="candidate-skills">
                    <div class="mini-skill">
                        <span>Técnico</span>
                        <div class="mini-progress">
                            <div class="mini-fill" style="width: ${report.skills.technical}%"></div>
                        </div>
                    </div>
                    <div class="mini-skill">
                        <span>Comunicação</span>
                        <div class="mini-progress">
                            <div class="mini-fill" style="width: ${report.skills.communication}%"></div>
                        </div>
                    </div>
                </div>
                <button class="view-details">
                    <i class="fas fa-eye"></i>
                    Ver Detalhes
                </button>
            </div>
        `).join('');
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--green)' : type === 'warning' ? 'var(--orange-500)' : 'var(--blue)'};
        color: white;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize Interactions
function initializeInteractions() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Implement filter logic here
        });
    });
}

// Initialize Charts (placeholder)
function initializeCharts() {
    // You can integrate Chart.js or any other charting library here
    console.log('Charts initialized');
}

// Animate on Scroll
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.5s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    });
    
    // Observe stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
}

// Add animations CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .candidate-card {
        background: white;
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: var(--shadow-md);
        transition: all var(--transition);
    }
    
    .candidate-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
    }
    
    .candidate-header {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .candidate-header img {
        width: 60px;
        height: 60px;
        border-radius: 12px;
    }
    
    .candidate-header h4 {
        font-weight: 600;
        color: var(--gray-900);
        margin-bottom: 0.25rem;
    }
    
    .candidate-header p {
        color: var(--gray-500);
        font-size: 0.875rem;
    }
    
    .date {
        font-size: 0.75rem;
        color: var(--gray-400);
    }
    
    .candidate-score {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .overall-score {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
    }
    
    .overall-score.high {
        background: var(--green);
    }
    
    .overall-score.medium {
        background: var(--orange-400);
    }
    
    .overall-score.low {
        background: var(--red);
    }
    
    .mini-skill {
        margin-bottom: 0.75rem;
    }
    
    .mini-skill span {
        font-size: 0.75rem;
        color: var(--gray-600);
        font-weight: 600;
    }
    
    .mini-progress {
        height: 6px;
        background: var(--gray-200);
        border-radius: 3px;
        margin-top: 0.25rem;
        overflow: hidden;
    }
    
    .mini-fill {
        height: 100%;
        background: var(--orange-500);
        border-radius: 3px;
    }
    
    .view-details {
        width: 100%;
        padding: 0.75rem;
        background: var(--orange-500);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    
    .view-details:hover {
        background: var(--orange-600);
    }
    
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .empty-state h3 {
        color: var(--gray-700);
        margin-bottom: 0.5rem;
    }
    
    .empty-state p {
        color: var(--gray-500);
    }
    
    .candidates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }
`;

// =====================================================
// INTEGRAÇÃO COM APIs REAIS
// =====================================================

// Função para iniciar entrevista com APIs reais
async function startInterviewPro() {
    console.log('🚀 Iniciando entrevista profissional com APIs reais...');
    
    // Coletar dados do formulário - usando os seletores corretos do HTML professional
    const candidateName = document.querySelector('.form-input')?.value || '';
    const formSelects = document.querySelectorAll('.form-select');
    const position = formSelects[0]?.value || 'Desenvolvedor Senior';
    const durationText = formSelects[1]?.value || '45 minutos';
    const duration = parseInt(durationText) || 45;
    
    if (!candidateName) {
        showNotification('Por favor, insira o nome do candidato', 'error');
        return;
    }
    
    // Atualizar estado
    state.isInterviewActive = true;
    state.interviewData = {
        candidateName,
        position,
        duration,
        startTime: new Date(),
        transcripts: [],
        suggestions: [],
        progress: {
            technical: 0,
            communication: 0,
            problemSolving: 0,
            leadership: 0
        }
    };
    
    // Configurar sessão no TalentAI
    if (window.talentAI) {
        window.talentAI.currentSession = {
            candidateName,
            position,
            duration,
            context: 'Entrevista Técnica',
            startTime: new Date()
        };
    }
    
    // Mostrar painel de entrevista ao vivo
    document.querySelector('.interview-setup').style.display = 'none';
    document.getElementById('liveInterview').style.display = 'block';
    
    // Iniciar timer
    startInterviewTimer();
    
    // Iniciar gravação e transcrição
    try {
        if (window.talentAI) {
            await window.talentAI.startRecording();
            showNotification('🎤 Gravação iniciada com sucesso!', 'success');
            
            // Gerar perguntas iniciais com IA
            const questions = await window.talentAI.generateQuestions(position, 'Pleno');
            if (questions && questions.length > 0) {
                displayGeneratedQuestions(questions);
            }
        } else {
            showNotification('⚠️ Sistema de IA não inicializado', 'warning');
        }
    } catch (error) {
        console.error('Erro ao iniciar gravação:', error);
        showNotification('Erro ao iniciar gravação', 'error');
    }
}

// Função para finalizar entrevista com APIs reais
async function finishInterviewPro() {
    if (!confirm('Deseja finalizar a entrevista e gerar o relatório com IA?')) {
        return;
    }
    
    console.log('📊 Finalizando entrevista e gerando relatório...');
    
    // Parar gravação
    if (window.talentAI) {
        window.talentAI.stopRecording();
    }
    
    // Parar timer
    if (state.interviewTimer) {
        clearInterval(state.interviewTimer);
    }
    
    state.isInterviewActive = false;
    
    // Calcular duração
    const endTime = new Date();
    const duration = Math.round((endTime - state.interviewData.startTime) / 1000 / 60);
    
    if (window.talentAI) {
        window.talentAI.currentSession.duration = duration;
    }
    
    // Mostrar loading
    showNotification('🤖 Analisando entrevista com IA...', 'info');
    
    try {
        // Avaliar candidato com IA
        if (window.talentAI) {
            const evaluation = await window.talentAI.evaluateCandidate();
            
            if (evaluation) {
                // Exibir resultados
                displayEvaluationResults(evaluation);
                showNotification('✅ Relatório gerado com sucesso!', 'success');
            } else {
                showNotification('⚠️ Não foi possível gerar avaliação', 'warning');
            }
        }
    } catch (error) {
        console.error('Erro ao avaliar candidato:', error);
        showNotification('❌ Erro ao gerar relatório', 'error');
    }
    
    // Navegar para candidatos após 2 segundos
    setTimeout(() => {
        document.querySelector('[data-tab="candidates"]').click();
    }, 2000);
}

// Iniciar timer da entrevista
function startInterviewTimer() {
    state.elapsedTime = 0;
    const timerElement = document.querySelector('.timer');
    
    state.interviewTimer = setInterval(() => {
        state.elapsedTime++;
        const minutes = Math.floor(state.elapsedTime / 60);
        const seconds = state.elapsedTime % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Análise periódica a cada 30 segundos
        if (state.elapsedTime % 30 === 0 && window.talentAI) {
            performPeriodicAnalysis();
        }
    }, 1000);
}

// Análise periódica durante a entrevista
async function performPeriodicAnalysis() {
    if (!window.talentAI || !state.isInterviewActive) return;
    
    console.log('🔄 Realizando análise periódica...');
    
    const transcripts = window.talentAI.transcriptionHistory;
    if (transcripts.length > 0) {
        const recentText = transcripts.slice(-3).map(t => t.text).join(' ');
        
        if (recentText.length > 50) {
            // Analisar com GPT-4
            const analysis = await window.talentAI.analyzeWithGPT(recentText);
            
            if (analysis) {
                // Atualizar progresso
                if (analysis.score) {
                    updateProgressBars({
                        technical: analysis.score,
                        communication: analysis.score - 5,
                        problemSolving: analysis.score + 5,
                        leadership: analysis.score - 10
                    });
                }
                
                // Adicionar sugestões
                if (analysis.suggestions) {
                    displayAISuggestions(analysis.suggestions);
                }
            }
        }
    }
}

// Exibir perguntas geradas pela IA
function displayGeneratedQuestions(questions) {
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    if (!suggestionsContainer) return;
    
    // Limpar container
    suggestionsContainer.innerHTML = '';
    
    questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = index === 0 ? 'suggestion-card high-priority' : 'suggestion-card medium-priority';
        card.innerHTML = `
            <span class="priority-badge">${index === 0 ? 'Recomendada' : 'Sugerida'}</span>
            <p>${question}</p>
            <button class="use-suggestion" onclick="useSuggestion('${question.replace(/'/g, "\\'")}')">
                <i class="fas fa-check"></i>
                Usar
            </button>
        `;
        suggestionsContainer.appendChild(card);
    });
}

// Exibir sugestões da IA
function displayAISuggestions(suggestions) {
    const suggestionsContainer = document.querySelector('.ai-suggestions');
    if (!suggestionsContainer) return;
    
    suggestions.forEach((suggestion) => {
        const card = document.createElement('div');
        card.className = 'suggestion-card medium-priority';
        card.innerHTML = `
            <span class="priority-badge">IA Sugestão</span>
            <p>${suggestion}</p>
            <button class="use-suggestion" onclick="useSuggestion('${suggestion.replace(/'/g, "\\'")}')">
                <i class="fas fa-check"></i>
                Usar
            </button>
        `;
        suggestionsContainer.appendChild(card);
    });
}

// Usar sugestão
function useSuggestion(text) {
    if (window.talentAI) {
        window.talentAI.useSuggestion(text);
    }
}

// Exibir resultados da avaliação
function displayEvaluationResults(evaluation) {
    const evalData = evaluation.evaluation || {};
    
    // Criar modal ou card com resultados
    const resultsHTML = `
        <div class="evaluation-results">
            <h3>📊 Resultados da Avaliação</h3>
            <div class="scores-grid">
                <div class="score-item">
                    <label>Pontuação Geral</label>
                    <div class="score-circle ${evalData.overallScore >= 70 ? 'high' : evalData.overallScore >= 50 ? 'medium' : 'low'}">
                        ${evalData.overallScore || 0}
                    </div>
                </div>
                <div class="score-item">
                    <label>Habilidades Técnicas</label>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${evalData.technicalSkills || 0}%"></div>
                    </div>
                </div>
                <div class="score-item">
                    <label>Comunicação</label>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${evalData.communication || 0}%"></div>
                    </div>
                </div>
                <div class="score-item">
                    <label>Fit Cultural</label>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${evalData.culturalFit || 0}%"></div>
                    </div>
                </div>
            </div>
            <div class="recommendation">
                <strong>Recomendação:</strong> 
                <span class="${evalData.recommendation === 'Aprovado' ? 'approved' : evalData.recommendation === 'Em análise' ? 'maybe' : 'rejected'}">
                    ${evalData.recommendation || 'Pendente'}
                </span>
            </div>
        </div>
    `;
    
    // Adicionar ao DOM ou mostrar em modal
    showEvaluationModal(resultsHTML);
}

// Mostrar modal de avaliação
function showEvaluationModal(html) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    // Criar modal
    const modal = document.createElement('div');
    modal.className = 'evaluation-modal';
    modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    modal.innerHTML = html + `
        <button onclick="this.closest('.modal-overlay').remove()" style="
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: var(--orange-500);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        ">Fechar</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

// Atualizar barras de progresso
function updateProgressBars(scores) {
    Object.entries(scores).forEach(([skill, value]) => {
        const progressBar = document.querySelector(`.skill-item:has(span:contains('${getSkillLabel(skill)}')) .progress-fill`);
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, value))}%`;
            const valueElement = progressBar.closest('.skill-item').querySelector('.skill-value');
            if (valueElement) {
                valueElement.textContent = `${Math.round(value)}%`;
            }
        }
    });
}

// Obter label da habilidade
function getSkillLabel(skill) {
    const labels = {
        technical: 'Habilidades Técnicas',
        communication: 'Comunicação',
        problemSolving: 'Problem Solving',
        leadership: 'Liderança'
    };
    return labels[skill] || skill;
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar estilos de animação
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);
