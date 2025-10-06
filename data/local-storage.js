// Sistema de salvamento local para candidatos
class LocalStorageManager {
    constructor() {
        this.storageKey = 'ia-interview-candidates';
        this.compareKey = 'ia-interview-compare';
    }

    // Salvar candidato
    saveCandidate(candidateData) {
        try {
            const candidates = this.getAllCandidates();
            const candidateId = this.generateId();
            
            const candidateRecord = {
                id: candidateId,
                ...candidateData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            candidates[candidateId] = candidateRecord;
            localStorage.setItem(this.storageKey, JSON.stringify(candidates));
            
            console.log('✅ Candidato salvo:', candidateRecord.name);
            return candidateId;
        } catch (error) {
            console.error('❌ Erro ao salvar candidato:', error);
            return null;
        }
    }

    // Obter todos os candidatos
    getAllCandidates() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.error('❌ Erro ao carregar candidatos:', error);
            return {};
        }
    }

    // Obter candidato por ID
    getCandidate(id) {
        const candidates = this.getAllCandidates();
        return candidates[id] || null;
    }

    // Deletar candidato
    deleteCandidate(id) {
        try {
            const candidates = this.getAllCandidates();
            if (candidates[id]) {
                delete candidates[id];
                localStorage.setItem(this.storageKey, JSON.stringify(candidates));
                console.log('✅ Candidato deletado:', id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao deletar candidato:', error);
            return false;
        }
    }

    // Buscar candidatos por filtros
    searchCandidates(filters = {}) {
        const candidates = this.getAllCandidates();
        let results = Object.values(candidates);

        // Filtrar por posição
        if (filters.position) {
            results = results.filter(c => c.position === filters.position);
        }

        // Filtrar por área
        if (filters.area) {
            results = results.filter(c => {
                const positionConfig = POSITIONS_CONFIG[c.position];
                return positionConfig && positionConfig.area === filters.area;
            });
        }

        // Filtrar por senioridade
        if (filters.seniority) {
            results = results.filter(c => {
                const positionConfig = POSITIONS_CONFIG[c.position];
                return positionConfig && positionConfig.seniority === filters.seniority;
            });
        }

        // Filtrar por score mínimo
        if (filters.minScore) {
            results = results.filter(c => c.scores.overall >= filters.minScore);
        }

        // Filtrar por data
        if (filters.dateFrom) {
            results = results.filter(c => new Date(c.createdAt) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            results = results.filter(c => new Date(c.createdAt) <= new Date(filters.dateTo));
        }

        // Ordenar por score (maior primeiro)
        results.sort((a, b) => b.scores.overall - a.scores.overall);

        return results;
    }

    // Adicionar candidato à comparação
    addToComparison(candidateId) {
        try {
            const compareList = this.getComparisonList();
            if (!compareList.includes(candidateId)) {
                compareList.push(candidateId);
                localStorage.setItem(this.compareKey, JSON.stringify(compareList));
                console.log('✅ Candidato adicionado à comparação');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao adicionar à comparação:', error);
            return false;
        }
    }

    // Remover candidato da comparação
    removeFromComparison(candidateId) {
        try {
            const compareList = this.getComparisonList();
            const index = compareList.indexOf(candidateId);
            if (index > -1) {
                compareList.splice(index, 1);
                localStorage.setItem(this.compareKey, JSON.stringify(compareList));
                console.log('✅ Candidato removido da comparação');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao remover da comparação:', error);
            return false;
        }
    }

    // Obter lista de comparação
    getComparisonList() {
        try {
            const stored = localStorage.getItem(this.compareKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('❌ Erro ao carregar lista de comparação:', error);
            return [];
        }
    }

    // Limpar lista de comparação
    clearComparison() {
        try {
            localStorage.removeItem(this.compareKey);
            console.log('✅ Lista de comparação limpa');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar comparação:', error);
            return false;
        }
    }

    // Obter estatísticas
    getStatistics() {
        const candidates = Object.values(this.getAllCandidates());
        
        if (candidates.length === 0) {
            return {
                total: 0,
                byArea: {},
                bySeniority: {},
                byPosition: {},
                averageScore: 0,
                topPerformers: [],
                recentInterviews: []
            };
        }

        // Estatísticas por área
        const byArea = {};
        const bySeniority = {};
        const byPosition = {};
        let totalScore = 0;

        candidates.forEach(candidate => {
            const positionConfig = POSITIONS_CONFIG[candidate.position];
            
            if (positionConfig) {
                // Por área
                const area = positionConfig.area;
                if (!byArea[area]) byArea[area] = { count: 0, avgScore: 0, totalScore: 0 };
                byArea[area].count++;
                byArea[area].totalScore += candidate.scores.overall;
                byArea[area].avgScore = Math.round(byArea[area].totalScore / byArea[area].count);

                // Por senioridade
                const seniority = positionConfig.seniority;
                if (!bySeniority[seniority]) bySeniority[seniority] = { count: 0, avgScore: 0, totalScore: 0 };
                bySeniority[seniority].count++;
                bySeniority[seniority].totalScore += candidate.scores.overall;
                bySeniority[seniority].avgScore = Math.round(bySeniority[seniority].totalScore / bySeniority[seniority].count);
            }

            // Por posição
            if (!byPosition[candidate.position]) byPosition[candidate.position] = { count: 0, avgScore: 0, totalScore: 0 };
            byPosition[candidate.position].count++;
            byPosition[candidate.position].totalScore += candidate.scores.overall;
            byPosition[candidate.position].avgScore = Math.round(byPosition[candidate.position].totalScore / byPosition[candidate.position].count);

            totalScore += candidate.scores.overall;
        });

        // Top performers (score >= 80)
        const topPerformers = candidates
            .filter(c => c.scores.overall >= 80)
            .sort((a, b) => b.scores.overall - a.scores.overall)
            .slice(0, 10);

        // Entrevistas recentes (últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentInterviews = candidates
            .filter(c => new Date(c.createdAt) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return {
            total: candidates.length,
            byArea,
            bySeniority,
            byPosition,
            averageScore: Math.round(totalScore / candidates.length),
            topPerformers,
            recentInterviews
        };
    }

    // Exportar dados para JSON
    exportData() {
        try {
            const data = {
                candidates: this.getAllCandidates(),
                comparison: this.getComparisonList(),
                statistics: this.getStatistics(),
                exportedAt: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ia-interview-candidates-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            console.log('✅ Dados exportados com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            return false;
        }
    }

    // Importar dados de JSON
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.candidates) {
                localStorage.setItem(this.storageKey, JSON.stringify(data.candidates));
            }
            
            if (data.comparison) {
                localStorage.setItem(this.compareKey, JSON.stringify(data.comparison));
            }

            console.log('✅ Dados importados com sucesso');
            return true;
        } catch (error) {
            console.error('❌ Erro ao importar dados:', error);
            return false;
        }
    }

    // Limpar todos os dados
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.compareKey);
            console.log('✅ Todos os dados foram limpos');
            return true;
        } catch (error) {
            console.error('❌ Erro ao limpar dados:', error);
            return false;
        }
    }

    // Gerar ID único
    generateId() {
        return 'candidate_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Obter candidatos para comparação
    getComparisonCandidates() {
        const compareList = this.getComparisonList();
        const candidates = this.getAllCandidates();
        
        return compareList.map(id => candidates[id]).filter(Boolean);
    }

    // Validar dados do candidato
    validateCandidateData(data) {
        const required = ['name', 'position', 'scores', 'transcripts', 'suggestions'];
        
        for (const field of required) {
            if (!data[field]) {
                throw new Error(`Campo obrigatório ausente: ${field}`);
            }
        }

        if (typeof data.scores.overall !== 'number' || data.scores.overall < 0 || data.scores.overall > 100) {
            throw new Error('Score geral deve ser um número entre 0 e 100');
        }

        return true;
    }
}

// Exportar para uso global
window.LocalStorageManager = LocalStorageManager;
