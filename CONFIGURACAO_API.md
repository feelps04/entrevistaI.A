# 🔑 Guia de Configuração de API Keys

## 📋 Pré-requisitos

Para utilizar o **TalentAI Pro** com todas as funcionalidades de IA, você precisará das seguintes API keys:

### 1. **OpenAI API Key** (Obrigatório)
- **Para que serve**: Análise inteligente de respostas, geração de sugestões e insights
- **Como obter**:
  1. Acesse [https://platform.openai.com](https://platform.openai.com)
  2. Crie uma conta ou faça login
  3. Vá em "API Keys" no menu
  4. Clique em "Create new secret key"
  5. Copie a chave (começa com `sk-`)

### 2. **Azure Cognitive Services** (Opcional)
- **Para que serve**: Análise de sentimento e detecção de emoções
- **Como obter**:
  1. Acesse [https://portal.azure.com](https://portal.azure.com)
  2. Crie um recurso "Cognitive Services"
  3. Copie a chave e a região
  
### 3. **Web Speech API** (Gratuito)
- **Para que serve**: Transcrição em tempo real
- **Como usar**: Já integrado no navegador Chrome/Edge
- **Sem necessidade de API key**

---

## 🚀 Configuração Rápida

### **Método 1: Interface Web (Recomendado)**

1. Abra o arquivo `config-ai.html` no navegador
2. Insira suas API keys nos campos correspondentes
3. Clique em "Testar" para verificar cada API
4. Clique em "Salvar Configurações"
5. Pronto! As chaves ficam salvas no localStorage do navegador

### **Método 2: Arquivo de Ambiente**

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione suas chaves:
   ```env
   OPENAI_API_KEY=sk-sua-chave-aqui
   AZURE_SPEECH_KEY=sua-chave-azure-aqui
   AZURE_REGION=eastus
   ```

3. As chaves serão carregadas automaticamente

---

## 🔐 Segurança

### ⚠️ **IMPORTANTE**
- **NUNCA** compartilhe suas API keys publicamente
- **NUNCA** faça commit do arquivo `.env` no GitHub
- O arquivo `.gitignore` já está configurado para ignorar `.env`

### 💡 **Boas Práticas**
1. Use variáveis de ambiente para produção
2. Rotacione suas chaves periodicamente
3. Configure limites de uso nas plataformas
4. Monitore o uso e custos

---

## 📊 Custos Estimados

### OpenAI GPT-4
- **Custo**: ~$0.10 por entrevista completa
- **Inclui**: Análise de respostas, geração de sugestões, scores automáticos

### Azure Cognitive Services
- **Custo**: ~$0.05 por entrevista
- **Inclui**: Análise de sentimento, detecção de emoções

### Web Speech API
- **Custo**: Gratuito
- **Inclui**: Transcrição em tempo real

### **Total Estimado**: ~$0.15-0.20 por entrevista

---

## ✅ Testando as Configurações

### 1. **Teste via Interface**
```
1. Abra config-ai.html
2. Clique em "Testar" em cada API
3. Verifique os indicadores de status
4. Status verde = funcionando ✅
```

### 2. **Teste Manual**

#### OpenAI:
```javascript
// Abra o console do navegador (F12)
const apiKey = localStorage.getItem('openai_api_key');
console.log('OpenAI Key:', apiKey ? 'Configurada ✅' : 'Não configurada ❌');
```

#### Azure:
```javascript
const azureKey = localStorage.getItem('azure_speech_key');
console.log('Azure Key:', azureKey ? 'Configurada ✅' : 'Não configurada ❌');
```

---

## 🎯 Modos de Operação

### **Modo Completo** (Com APIs)
- Todas as funcionalidades ativas
- Análise em tempo real com IA
- Sugestões contextuais avançadas
- Precisão máxima

### **Modo Demo** (Sem APIs)
- Funciona sem configuração
- Dados simulados
- Ideal para demonstrações
- Sem custos

### **Modo Local** (Offline)
- Análise básica sem IA externa
- Extração de palavras-chave
- Funciona sem internet
- Limitado

---

## 🔧 Solução de Problemas

### **Erro: "API Key inválida"**
- Verifique se copiou a chave completa
- Confirme que a chave está ativa na plataforma
- Para OpenAI, deve começar com `sk-`

### **Erro: "Sem créditos"**
- Verifique seu saldo em platform.openai.com
- Adicione créditos ou configure billing
- Azure: verifique limites de uso gratuito

### **Web Speech API não funciona**
- Use Chrome ou Edge (melhor suporte)
- Permita acesso ao microfone
- Verifique em chrome://settings/content/microphone

### **Configurações não salvam**
- Verifique se localStorage está habilitado
- Limpe o cache do navegador
- Tente em modo anônimo para testar

---

## 📞 Links Úteis

- **OpenAI Platform**: https://platform.openai.com
- **OpenAI Docs**: https://platform.openai.com/docs
- **Azure Portal**: https://portal.azure.com
- **Azure Docs**: https://docs.microsoft.com/azure/cognitive-services
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

## 🎓 Tutoriais em Vídeo

1. **Como obter OpenAI API Key**: [YouTube Tutorial](https://www.youtube.com/results?search_query=how+to+get+openai+api+key)
2. **Configurar Azure Cognitive**: [Azure Tutorial](https://docs.microsoft.com/azure/cognitive-services/speech-service/get-started)

---

## 💬 Suporte

Se encontrar problemas:
1. Verifique a documentação oficial das APIs
2. Consulte o arquivo `IA_INTEGRATION_GUIDE.md`
3. Revise os logs do console (F12)
4. Tente o modo demo para isolar o problema

---

**TalentAI Pro** - Sistema Inteligente de Entrevistas 🎯

*Última atualização: Janeiro 2025*
