# ❓ FAQ - Perguntas Frequentes

## 🎯 Geral

### O que é o TalentAI Pro?
É um sistema inteligente de assistência para entrevistas que usa IA (GPT-4, Azure, Web Speech API) para:
- Transcrever conversas em tempo real
- Gerar sugestões contextuais de perguntas
- Avaliar candidatos automaticamente
- Criar relatórios profissionais

### É gratuito?
O sistema é **open-source e gratuito**, mas você precisa de:
- **API Key da OpenAI** (~$0.10 por entrevista)
- **Azure** (opcional, ~$0.05 por entrevista)
- **Web Speech API** (gratuito, nativo do navegador)

### Funciona offline?
**Parcialmente**. Você pode usar:
- ✅ **Modo Demo** - Totalmente offline com simulações
- ✅ **Modo Local** - Análise básica sem IA externa
- ❌ **Modo Completo** - Requer internet para APIs de IA

---

## 🔑 Configuração

### Como obter a OpenAI API Key?
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie conta ou faça login
3. Vá em **API Keys** > **Create new secret key**
4. Copie a chave (começa com `sk-`)
5. Cole em `config-ai.html`

💡 **Dica**: Guarde a chave em local seguro, ela só aparece uma vez!

### Preciso de todas as APIs?
**Não!** Você pode usar apenas:
- **Mínimo**: OpenAI GPT-4 (análise e sugestões)
- **Opcional**: Azure (análise de sentimento)
- **Gratuito**: Web Speech API (transcrição)

### Onde ficam salvas minhas API keys?
No **localStorage** do navegador, de forma local e segura. Nunca são enviadas para servidores externos além das próprias APIs (OpenAI, Azure).

### Posso usar em modo demo sem API keys?
**Sim!** Abra `index-demo.html` para usar o sistema com dados simulados, ideal para:
- Demonstrações para clientes
- Testes da interface
- Treinamento de usuários
- Desenvolvimento

---

## 💻 Uso

### Como iniciar uma entrevista?
```
1. Configure APIs em config-ai.html
2. Abra index-professional.html
3. Clique em "Nova Entrevista"
4. Preencha dados do candidato
5. Clique em "Iniciar Entrevista"
6. Permita acesso ao microfone
7. Comece a conversar!
```

### O microfone não funciona, o que fazer?
```
✅ Verifique permissões em chrome://settings/content/microphone
✅ Use Chrome ou Edge (melhor suporte)
✅ Teste em config-ai.html primeiro
✅ Recarregue a página (F5)
✅ Permita acesso quando solicitado
```

### As sugestões não aparecem, por quê?
Possíveis causas:
- ⏱️ **Aguarde 30 segundos** - IA precisa de contexto
- 🔑 **API não configurada** - Verifique em config-ai.html
- 💬 **Pouca conversa** - Fale mais sobre o tópico
- 💰 **Sem créditos** - Verifique saldo na OpenAI
- 🐛 **Erro técnico** - Abra console (F12) e veja erros

### Como funciona a transcrição?
O sistema usa **Web Speech API** (nativo do navegador):
- 🎤 Captura áudio do microfone
- 📝 Converte fala em texto
- 👤 Identifica quem está falando
- 💾 Salva transcrição completa

### Posso editar a transcrição?
**Atualmente não**, mas está no roadmap (v2.1). Por enquanto, você pode:
- Copiar texto e editar externamente
- Usar função de busca (Ctrl+F)
- Exportar relatório depois

---

## 🤖 Inteligência Artificial

### Qual IA é usada?
- **OpenAI GPT-4**: Análise de respostas e sugestões
- **Azure Cognitive**: Análise de sentimento (opcional)
- **Web Speech API**: Transcrição em tempo real (Google)
- **OpenAI Whisper**: Transcrição de áudio gravado (opcional)

### Como a IA avalia candidatos?
1. **Transcrição**: Converte fala em texto
2. **Análise semântica**: GPT-4 entende contexto
3. **Extração de palavras-chave**: Identifica competências
4. **Scoring**: Calcula pontuação por categoria
5. **Insights**: Gera recomendações

### A IA é 100% precisa?
**Não**. A IA é uma **ferramenta de apoio**, não substitui o julgamento humano:
- ✅ Usa para **orientação e consistência**
- ✅ **Complementa** sua análise
- ❌ Não toma decisões finais sozinha
- ❌ Pode ter vieses (como qualquer IA)

### Posso treinar a IA para minha empresa?
**Não diretamente** na versão atual. Mas você pode:
- Customizar prompts no código
- Ajustar pesos de scoring
- Criar templates personalizados
- (v3.0 terá IA customizável)

---

## 💰 Custos

### Quanto custa cada entrevista?
**Estimativa** (45 minutos):
- OpenAI GPT-4: ~$0.10
- Azure (opcional): ~$0.05
- Web Speech: Gratuito
- **Total: ~$0.10-0.15**

### Como reduzir custos?
```
💡 Use apenas OpenAI (desative Azure)
💡 Configure limites na plataforma OpenAI
💡 Use modo demo para testes/treinamentos
💡 Otimize duração das entrevistas
💡 Monitore uso em platform.openai.com
```

### Tem plano mensal fixo?
**Não**. É **pay-per-use** (paga pelo que usar):
- 10 entrevistas/mês = ~$1-2
- 50 entrevistas/mês = ~$5-10
- 100 entrevistas/mês = ~$10-20

### E se acabar meus créditos?
O sistema para de funcionar com IA, mas você pode:
- Adicionar créditos em platform.openai.com
- Usar modo local (sem IA externa)
- Usar modo demo (simulação)

---

## 🔒 Segurança e Privacidade

### Meus dados são seguros?
**Sim**! O sistema:
- ✅ Armazena dados **localmente** (localStorage)
- ✅ Usa **HTTPS** para todas APIs
- ✅ **Não envia** dados para servidores próprios
- ✅ **Não compartilha** com terceiros
- ✅ Você controla seus dados

### Onde ficam as transcrições?
- **localStorage** do navegador (local)
- APIs processam em tempo real e descartam
- **Você é responsável** por gerenciar/deletar

### É LGPD/GDPR compliant?
**Sim**, seguindo boas práticas:
- Dados processados com consentimento
- Usuário pode deletar dados
- Transparência sobre uso de IA
- Minimização de dados
- Sem compartilhamento desnecessário

### Posso usar para dados sensíveis?
**Com cuidado**:
- ✅ Anonimize dados quando possível
- ✅ Não inclua informações pessoais desnecessárias
- ✅ Delete transcrições antigas
- ⚠️ Revise políticas de privacidade das APIs usadas

---

## 🛠️ Técnico

### Quais navegadores são suportados?
**Recomendado**:
- ✅ Google Chrome (melhor suporte)
- ✅ Microsoft Edge

**Suporte parcial**:
- ⚠️ Firefox (Web Speech limitado)
- ⚠️ Safari (funciona mas com limitações)

**Não suportado**:
- ❌ Internet Explorer

### Preciso instalar algo?
**Não!** É 100% web-based:
- Sem instalação
- Sem dependências
- Apenas abra no navegador
- (Opcional: servidor local para desenvolvimento)

### Funciona no mobile?
**Interface sim**, mas:
- ✅ Design responsivo
- ⚠️ Web Speech API limitada no mobile
- ⚠️ Microfone pode ter problemas
- 🔜 App mobile planejado (v3.0)

### Posso integrar com meu sistema?
**Atualmente não** (frontend only), mas:
- 🔜 v3.0 terá API REST
- 🔜 Webhooks
- 🔜 Integração com ATS
- Você pode modificar o código (open-source)

---

## 📊 Relatórios

### Como gerar um relatório?
Automático ao finalizar entrevista:
1. Clique em "Finalizar Entrevista"
2. Aguarde processamento (~10 segundos)
3. Relatório aparece automaticamente
4. Inclui scores, insights e recomendação

### Posso exportar em PDF?
**Ainda não** (em desenvolvimento v2.1). Por enquanto:
- Use "Print" do navegador (Ctrl+P)
- Salve como PDF
- Ou copie/cole em documento

### Como comparar candidatos?
**Ainda não disponível** (planejado v2.1). Por enquanto:
- Mantenha screenshots dos relatórios
- Use planilha externa
- Copie scores manualmente

### Relatórios ficam salvos?
**Sim**, no localStorage. Para ver histórico:
- Vá em "Relatórios" na sidebar
- (Funcionalidade em desenvolvimento)

---

## 🐛 Problemas Comuns

### Erro: "Failed to fetch"
**Causa**: Problema de conexão com API
**Solução**:
```
✅ Verifique sua internet
✅ Confirme API key em config-ai.html
✅ Teste API em config-ai.html
✅ Verifique firewall/proxy
```

### Erro: "Insufficient credits"
**Causa**: Sem créditos na OpenAI
**Solução**:
```
✅ Acesse platform.openai.com/account/billing
✅ Adicione créditos
✅ Configure billing method
```

### Console mostra erro de CORS
**Causa**: Restrições de segurança do navegador
**Solução**:
```
✅ Use servidor local (não file://)
✅ python -m http.server 8000
✅ Ou Live Server no VS Code
```

### Página não carrega CSS
**Causa**: Caminhos relativos incorretos
**Solução**:
```
✅ Mantenha estrutura de pastas original
✅ Use servidor local
✅ Verifique caminhos dos arquivos
```

---

## 🚀 Próximos Passos

### Roadmap

**v2.1** (Q1 2025):
- Exportação PDF
- Modo escuro
- Comparação de candidatos
- Email de relatórios

**v3.0** (Q2 2025):
- Backend + Database
- Autenticação
- API REST
- Integração ATS

### Como contribuir?
Veja [CONTRIBUTING.md](CONTRIBUTING.md) para:
- Reportar bugs
- Sugerir features
- Enviar pull requests
- Melhorar documentação

---

## 📞 Precisa de Ajuda?

### Documentação
- [README.md](README.md) - Visão geral
- [QUICK_START.md](QUICK_START.md) - Início rápido
- [CONFIGURACAO_API.md](CONFIGURACAO_API.md) - Setup de APIs
- [IA_INTEGRATION_GUIDE.md](IA_INTEGRATION_GUIDE.md) - Detalhes técnicos

### Suporte
- **Issues**: https://github.com/feelps04/entrevistaI.A/issues
- **Discussions**: https://github.com/feelps04/entrevistaI.A/discussions

### Links Úteis
- **OpenAI**: https://platform.openai.com
- **Azure**: https://portal.azure.com
- **Web Speech API**: https://developer.mozilla.org/docs/Web/API/Web_Speech_API

---

**Sua pergunta não está aqui?**

Abra uma [Discussion](https://github.com/feelps04/entrevistaI.A/discussions) ou [Issue](https://github.com/feelps04/entrevistaI.A/issues) no GitHub! 💬
