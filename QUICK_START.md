# ⚡ Guia Rápido - TalentAI Pro

## 🚀 Começar em 5 minutos

### 1. Configure suas API Keys

**Opção Fácil (Recomendado):**
```
1. Abra o arquivo: config-ai.html
2. Clique em "OpenAI API"
3. Cole sua chave da OpenAI (começa com sk-)
4. Clique em "Testar" e depois "Salvar"
```

**Como obter a chave OpenAI:**
- Acesse: https://platform.openai.com/api-keys
- Faça login ou crie conta
- Clique em "Create new secret key"
- Copie a chave (guarde em local seguro!)

### 2. Abra o Sistema

```
Clique duas vezes em: index-professional.html
```

Ou use um servidor local:
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# Acesse: http://localhost:8000/index-professional.html
```

### 3. Teste o Sistema

**Modo Demo (Sem API Keys):**
```
1. Abra index-demo.html
2. Clique em "Simular Conversa"
3. Veja a IA em ação!
```

**Modo Completo (Com API Keys):**
```
1. Abra index-professional.html
2. Clique em "Nova Entrevista"
3. Preencha os dados
4. Clique em "Iniciar Entrevista"
5. Fale no microfone (permita acesso)
6. Veja sugestões aparecendo em tempo real
7. Clique em "Finalizar" para ver o relatório
```

---

## 🎯 Primeira Entrevista

### Passo 1: Nova Entrevista
- Nome: João Silva
- Posição: Desenvolvedor Senior
- Duração: 45 minutos
- Modo IA: Assistência Total

### Passo 2: Durante a Entrevista
- Permita acesso ao microfone
- Fale normalmente
- Observe as sugestões da IA
- Use as perguntas sugeridas
- Acompanhe os scores

### Passo 3: Finalizar
- Clique em "Finalizar Entrevista"
- Veja o relatório automático
- Score geral e por competência
- Insights e recomendações

---

## 🔑 Cheat Sheet de Atalhos

### Navegação
- **Dashboard**: Visão geral
- **Nova Entrevista**: Configurar entrevista
- **Candidatos**: Banco de talentos
- **Relatórios**: Histórico e análises
- **Configurações**: APIs e preferências

### Durante Entrevista
- **Espaço**: Pausar/Retomar
- **Esc**: Finalizar entrevista
- **S**: Ocultar/Mostrar sugestões
- **T**: Focar transcrição

---

## 🎨 Páginas do Sistema

| Arquivo | Descrição |
|---------|-----------|
| `index-professional.html` | **Versão completa** - Dashboard + Entrevistas |
| `config-ai.html` | **Configuração** - Setup de APIs |
| `index-demo.html` | **Demo** - Simulação sem APIs |
| `index-complete.html` | **Completo** - Todas funcionalidades |

---

## 💡 Dicas Pro

### 1. Melhor Qualidade de Transcrição
- Use microfone externo
- Ambiente silencioso
- Fale de forma clara
- Evite sobreposição de vozes

### 2. Melhores Sugestões
- Configure a posição corretamente
- Deixe a IA analisar por 30 segundos
- Use sugestões de alta prioridade
- Explore gaps identificados

### 3. Economia de Custos
- Use modo demo para testes
- Configure limites na OpenAI
- Monitore uso em platform.openai.com
- Desative Azure se não usar sentimento

---

## 🐛 Problemas Comuns

### Microfone não funciona
```
✅ Permita acesso em chrome://settings/content/microphone
✅ Use Chrome ou Edge
✅ Teste em config-ai.html
```

### API não funciona
```
✅ Verifique a chave em config-ai.html
✅ Teste a conexão (botão "Testar")
✅ Confirme créditos na OpenAI
✅ Veja erros no console (F12)
```

### Sugestões não aparecem
```
✅ Confirme que OpenAI está configurado
✅ Aguarde 30 segundos para análise
✅ Fale mais sobre o tópico
✅ Use modo demo para testar interface
```

---

## 📊 Custos

### Por Entrevista
- OpenAI GPT-4: ~$0.10
- Azure (opcional): ~$0.05
- Whisper (se usar): ~$0.02/min
- **Total: ~$0.15-0.20**

### Reduzir Custos
- Use apenas OpenAI (desative Azure)
- Use Web Speech API (gratuito)
- Configure limites mensais
- Use modo demo para testes

---

## 📞 Precisa de Ajuda?

### Documentação
- [README.md](README.md) - Documentação completa
- [CONFIGURACAO_API.md](CONFIGURACAO_API.md) - Guia de APIs
- [IA_INTEGRATION_GUIDE.md](IA_INTEGRATION_GUIDE.md) - Detalhes técnicos

### Suporte
- Issues: https://github.com/feelps04/entrevistaI.A/issues
- Discussões: https://github.com/feelps04/entrevistaI.A/discussions

---

## ⚡ Comandos Úteis

```bash
# Clonar projeto
git clone https://github.com/feelps04/entrevistaI.A.git

# Navegar para pasta
cd entrevistaI.A

# Configurar API (copiar exemplo)
cp .env.example .env

# Editar configurações (opcional)
nano .env

# Iniciar servidor local
python -m http.server 8000

# Ou com Node.js
npx http-server -p 8000

# Acessar
http://localhost:8000/index-professional.html
```

---

**Pronto! Você está pronto para usar o TalentAI Pro! 🎉**

*Dica: Comece com o modo demo (index-demo.html) para conhecer o sistema antes de configurar as APIs.*
