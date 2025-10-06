# 🔒 Política de Segurança

## 🛡️ Versões Suportadas

| Versão | Suportada          |
| ------ | ------------------ |
| 2.0.x  | ✅ Sim             |
| 1.0.x  | ❌ Não             |

## 🚨 Reportar Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, por favor **NÃO** abra uma issue pública.

### Como Reportar

1. **Email**: Entre em contato através das Issues (privadamente)
2. **GitHub Security**: Use o tab "Security" do repositório
3. **Inclua**:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (se possível)

### Tempo de Resposta

- Reconhecimento: 48 horas
- Análise inicial: 5 dias úteis
- Correção: 30 dias (dependendo da severidade)

## 🔐 Boas Práticas de Segurança

### Para Desenvolvedores

#### 1. Proteção de API Keys

**❌ NUNCA faça isso:**
```javascript
// NÃO hardcode API keys no código
const apiKey = "sk-1234567890abcdef";

// NÃO comite .env para o repositório
git add .env  // ❌
```

**✅ SEMPRE faça isso:**
```javascript
// Use localStorage para armazenamento local
const apiKey = localStorage.getItem('openai_api_key');

// Ou variáveis de ambiente
const apiKey = process.env.OPENAI_API_KEY;

// Verifique se .gitignore inclui .env
.env  // ✅
```

#### 2. Validação de Entrada

```javascript
// Sempre sanitize inputs do usuário
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags básicos
        .substring(0, 500);    // Limite de caracteres
}
```

#### 3. HTTPS

```javascript
// Use HTTPS para todas as APIs
const API_BASE = 'https://api.openai.com';  // ✅
// NUNCA: 'http://api.openai.com'          // ❌
```

#### 4. Limites de Rate

```javascript
// Implemente rate limiting
let requestCount = 0;
const MAX_REQUESTS_PER_MINUTE = 60;

function checkRateLimit() {
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
        throw new Error('Rate limit exceeded');
    }
    requestCount++;
}
```

### Para Usuários

#### 1. Proteção de API Keys

- ✅ **Guarde suas chaves em local seguro**
- ✅ **Rotacione chaves periodicamente**
- ✅ **Configure limites de uso na OpenAI**
- ✅ **Monitore uso e custos regularmente**
- ❌ **Nunca compartilhe suas chaves**
- ❌ **Nunca exponha em screenshots**
- ❌ **Nunca comite em repositórios públicos**

#### 2. Configuração de Limites

**OpenAI:**
1. Acesse https://platform.openai.com/account/billing/limits
2. Configure limites mensais
3. Ative alertas de uso
4. Revise logs de uso

**Azure:**
1. Configure quotas no portal Azure
2. Ative Cost Management
3. Configure alertas de billing

#### 3. Acesso ao Microfone

- ✅ Revise permissões do navegador
- ✅ Use apenas em sites confiáveis
- ✅ Desative quando não usar
- ❌ Não permita acesso permanente

#### 4. Dados Sensíveis

- ✅ **Cuidado com dados pessoais** dos candidatos
- ✅ **Cumpra LGPD/GDPR**
- ✅ **Anonimize dados quando possível**
- ✅ **Delete dados antigos periodicamente**
- ❌ **Não compartilhe transcrições sem consentimento**
- ❌ **Não armazene dados desnecessariamente**

## 🔍 Auditoria de Segurança

### Checklist

- [x] API keys não hardcoded
- [x] .gitignore configurado corretamente
- [x] HTTPS em todas as APIs
- [x] Input sanitization
- [x] localStorage usado corretamente
- [x] Sem SQL/NoSQL injection (frontend only)
- [x] Sem XSS vulnerabilities
- [x] CORS configurado (quando aplicável)
- [ ] Rate limiting (planejado v2.1)
- [ ] Autenticação (planejado v3.0)
- [ ] Criptografia de dados (planejado v3.0)

## 🚦 Níveis de Severidade

### Crítico 🔴
- Exposição de API keys
- Acesso não autorizado a dados
- Execução remota de código

**Ação**: Correção imediata (< 24h)

### Alto 🟠
- Bypass de autenticação
- Vazamento de dados sensíveis
- Vulnerabilidades conhecidas (CVE)

**Ação**: Correção prioritária (< 7 dias)

### Médio 🟡
- Vulnerabilidades de validação
- Problemas de configuração
- Exposição de informações

**Ação**: Correção planejada (< 30 dias)

### Baixo 🟢
- Melhorias de segurança
- Hardening
- Atualizações preventivas

**Ação**: Próximo release

## 📋 Compliance

### LGPD (Lei Geral de Proteção de Dados)

- ✅ Dados processados apenas com consentimento
- ✅ Usuário pode solicitar exclusão de dados
- ✅ Transparência sobre uso de IA
- ✅ Dados armazenados localmente (localStorage)
- ✅ Sem compartilhamento com terceiros (exceto APIs necessárias)

### GDPR (General Data Protection Regulation)

- ✅ Right to access
- ✅ Right to erasure
- ✅ Data portability
- ✅ Privacy by design
- ✅ Minimização de dados

## 🔐 Criptografia

### Atual (v2.0)
- ✅ HTTPS para todas as comunicações
- ✅ TLS 1.2+ para APIs
- ✅ localStorage (browser security)

### Planejado (v3.0)
- [ ] Criptografia end-to-end
- [ ] Hashing de senhas (bcrypt)
- [ ] Tokens JWT para autenticação
- [ ] Criptografia de dados em repouso

## 🛠️ Ferramentas de Segurança

### Recomendadas

1. **GitHub Security Alerts** - Vulnerabilidades em dependências
2. **Snyk** - Scan de vulnerabilidades
3. **OWASP ZAP** - Teste de penetração
4. **npm audit** - Auditoria de packages (quando usar backend)
5. **SonarQube** - Análise de código

### Comandos Úteis

```bash
# Verificar dependências (quando usar npm)
npm audit

# Corrigir vulnerabilidades automáticas
npm audit fix

# Scan com Snyk
npx snyk test

# Verificar commits por segredos
git secrets --scan
```

## 📞 Recursos

### Links Úteis

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OpenAI Security Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [Azure Security](https://docs.microsoft.com/azure/security/)
- [LGPD Brasil](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

### Contato de Segurança

- **GitHub Issues** (marque como security)
- **Discussions** para dúvidas gerais
- **Email** para vulnerabilidades críticas

---

## 🙏 Agradecimentos

Agradecemos aos pesquisadores de segurança que reportarem vulnerabilidades de forma responsável.

---

**TalentAI Pro** - Comprometido com a segurança dos seus dados 🔒

*Última atualização: Janeiro 2025*
