# 🧠 TalentAI Pro - Sistema Inteligente de Entrevistas

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![AI Powered](https://img.shields.io/badge/AI-Powered-orange)

Sistema completo de assistência inteligente para entrevistas, integrado com **OpenAI GPT-4**, **Azure Cognitive Services** e **Web Speech API** para análise em tempo real e geração automática de insights.

---

## 🚀 Demonstração

![TalentAI Pro Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=TalentAI+Pro+-+Dashboard)

### ✨ Principais Funcionalidades

- ✅ **Transcrição em Tempo Real** - Conversão automática de fala para texto
- ✅ **Análise Inteligente com IA** - GPT-4 analisa respostas e gera insights
- ✅ **Sugestões Contextuais** - IA sugere perguntas relevantes durante a entrevista
- ✅ **Avaliação Automática** - Scoring de competências em tempo real
- ✅ **Relatórios Detalhados** - Geração automática de relatórios profissionais
- ✅ **Dashboard Profissional** - Interface moderna e intuitiva
- ✅ **Análise de Sentimento** - Detecção de emoções com Azure AI
- ✅ **Multi-idioma** - Suporte para PT-BR, EN-US, ES-ES

---

## 📋 Pré-requisitos

- Navegador moderno (Chrome/Edge recomendado)
- API Key da OpenAI (GPT-4)
- Azure Cognitive Services (opcional)
- Microfone (para transcrição em tempo real)

---

## 🔧 Instalação Rápida

### 1. Clone o repositório
```bash
git clone https://github.com/feelps04/entrevistaI.A.git
cd entrevistaI.A
```

### 2. Configure suas API Keys

**Opção A: Interface Web (Mais fácil)**
```bash
# Abra no navegador
open config-ai.html
# Ou apenas clique duas vezes no arquivo
```

**Opção B: Arquivo de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite e adicione suas chaves
nano .env
```

### 3. Execute o projeto
```bash
# Opção 1: Abra diretamente no navegador
open index-professional.html

# Opção 2: Use um servidor local
python -m http.server 8000
# Acesse: http://localhost:8000/index-professional.html

# Opção 3: Use o Live Server do VS Code
# Clique com botão direito em index-professional.html > Open with Live Server
```

---

## 🔑 Configuração de API Keys

### OpenAI API Key (Obrigatório)

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta ou faça login
3. Vá em **API Keys** > **Create new secret key**
4. Copie a chave (formato: `sk-...`)
5. Cole em `config-ai.html` ou no arquivo `.env`

### Azure Cognitive Services (Opcional)

1. Acesse [portal.azure.com](https://portal.azure.com)
2. Crie um recurso **Cognitive Services**
3. Copie a **Key** e a **Region**
4. Configure em `config-ai.html`

📖 **Guia completo**: Veja [CONFIGURACAO_API.md](CONFIGURACAO_API.md)

---

## 💻 Como Usar

### 1️⃣ Configurar Nova Entrevista

```
1. Clique em "Nova Entrevista" na sidebar
2. Preencha os dados do candidato
3. Selecione a posição e duração
4. Escolha o modo de IA (Assistência Total, Sugestões ou Pós-Análise)
5. Clique em "Iniciar Entrevista"
```

### 2️⃣ Durante a Entrevista

- 🎤 **Transcrição automática** aparece em tempo real
- 💡 **Sugestões da IA** são geradas baseadas no contexto
- 📊 **Scores** são atualizados conforme a conversa
- ⏸️ Use **Pausar** se necessário
- 🛑 Clique em **Finalizar** para gerar o relatório

### 3️⃣ Análise do Relatório

- 📈 **Score geral** e por competência
- 💬 **Insights automáticos** gerados pela IA
- ✅ **Recomendação** (Contratar / Em Análise / Não Contratar)
- 📥 **Exportar** relatório (PDF/Email - em desenvolvimento)

---

## 🎯 Arquivos Principais

```
entrevistaI.A/
├── index-professional.html      # Interface principal do sistema
├── config-ai.html               # Configuração de APIs
├── ai-integration.js            # Integração com OpenAI e Azure
├── script-professional.js       # Lógica de negócio
├── styles-professional.css      # Estilos da interface
├── .env.example                 # Template de configuração
├── .gitignore                   # Arquivos ignorados pelo Git
├── CONFIGURACAO_API.md          # Guia de configuração
├── IA_INTEGRATION_GUIDE.md      # Documentação de IA
└── README.md                    # Este arquivo
```

---

## 🤖 Tecnologias de IA Utilizadas

### OpenAI GPT-4
- **Modelo**: `gpt-4-turbo-preview`
- **Função**: Análise semântica, geração de sugestões, insights
- **Custo**: ~$0.10 por entrevista

### Azure Cognitive Services
- **Serviço**: Text Analytics + Sentiment Analysis
- **Função**: Análise de sentimento, detecção de emoções
- **Custo**: ~$0.05 por entrevista

### Web Speech API
- **Serviço**: Nativo do navegador (Google)
- **Função**: Transcrição em tempo real
- **Custo**: Gratuito

### OpenAI Whisper
- **Modelo**: `whisper-1`
- **Função**: Transcrição avançada de áudio gravado
- **Custo**: ~$0.02 por minuto

**Total estimado**: ~$0.15-0.20 por entrevista completa

---

## 📊 Funcionalidades Detalhadas

### Dashboard Profissional
- Visão geral de candidatos e entrevistas
- Estatísticas e métricas em tempo real
- Insights da IA sobre tendências
- Cards de candidatos recentes

### Transcrição Inteligente
- Identificação automática de falantes
- Confiança da transcrição exibida
- Scroll automático
- Destaque de palavras-chave

### Sugestões da IA
- Perguntas contextuais baseadas na conversa
- Priorização (Alta/Média/Baixa)
- Categorização (Técnica/Comportamental/Liderança)
- One-click para usar sugestão

### Avaliação por Competências
- **Habilidades Técnicas** (0-100%)
- **Comunicação** (0-100%)
- **Problem Solving** (0-100%)
- **Liderança** (0-100%)

### Relatório Automático
- Gerado em 2 minutos (vs 30 minutos manual)
- Score geral e detalhado
- Insights personalizados
- Recomendação baseada em critérios objetivos

---

## 🎨 Interface

### Design Moderno
- **Cores**: Gradientes azul e roxo profissionais
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Glassmorphism, animações suaves
- **Responsivo**: Desktop, tablet e mobile

### Temas
- ✅ Modo Claro (padrão)
- 🌙 Modo Escuro (em desenvolvimento)

---

## 🚀 Roadmap

### Versão 2.1 (Em desenvolvimento)
- [ ] Exportação de relatórios em PDF
- [ ] Modo escuro completo
- [ ] Comparação entre candidatos
- [ ] Email automático de relatórios

### Versão 3.0 (Planejado)
- [ ] Backend com Node.js + Express
- [ ] Banco de dados MongoDB
- [ ] Sistema de autenticação
- [ ] API REST para integrações
- [ ] Dashboard de analytics avançado
- [ ] Integração com ATS (Applicant Tracking Systems)

---

## 🐛 Solução de Problemas

### A transcrição não funciona
```
✅ Permita acesso ao microfone
✅ Use Chrome ou Edge
✅ Verifique em chrome://settings/content/microphone
✅ Teste em config-ai.html
```

### OpenAI não responde
```
✅ Verifique se a API key está correta
✅ Confirme créditos em platform.openai.com
✅ Teste a conexão em config-ai.html
✅ Verifique o console do navegador (F12)
```

### Scores não atualizam
```
✅ Confirme que as APIs estão configuradas
✅ Verifique o console (F12) por erros
✅ Tente o modo demo para isolar o problema
✅ Limpe o cache do navegador
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abrir um Pull Request

---

## 📧 Contato

- **GitHub**: [@feelps04](https://github.com/feelps04)
- **Projeto**: [TalentAI Pro](https://github.com/feelps04/entrevistaI.A)

---

## ⭐ Agradecimentos

- OpenAI pela API GPT-4
- Microsoft pela Azure Cognitive Services
- Google pela Web Speech API
- Comunidade open-source

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=Dashboard)

### Configuração de API
![Config](https://via.placeholder.com/800x400/764ba2/ffffff?text=Config+AI)

### Entrevista ao Vivo
![Interview](https://via.placeholder.com/800x400/10b981/ffffff?text=Live+Interview)

### Relatório Gerado
![Report](https://via.placeholder.com/800x400/fbbf24/ffffff?text=Report)

---

<div align="center">

**Desenvolvido com ❤️ usando IA de última geração**

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

[Documentação](./IA_INTEGRATION_GUIDE.md) • [Configuração](./CONFIGURACAO_API.md) • [Issues](https://github.com/feelps04/entrevistaI.A/issues)

</div>
