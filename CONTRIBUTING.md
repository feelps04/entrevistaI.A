# 🤝 Contribuindo para o TalentAI Pro

Obrigado por considerar contribuir para o TalentAI Pro! Este documento fornece diretrizes para contribuições.

## 📋 Como Contribuir

### 1. Reportar Bugs

Se encontrar um bug, abra uma [Issue](https://github.com/feelps04/entrevistaI.A/issues) incluindo:

- **Descrição clara** do problema
- **Passos para reproduzir**
- **Comportamento esperado vs atual**
- **Screenshots** (se aplicável)
- **Ambiente** (navegador, OS, versão)
- **Console logs** (F12)

### 2. Sugerir Melhorias

Para sugerir novas funcionalidades:

- Verifique se já não existe uma issue similar
- Descreva claramente o caso de uso
- Explique por que seria útil
- Forneça exemplos de uso

### 3. Enviar Pull Requests

#### Processo

1. **Fork** o repositório
2. **Clone** seu fork
   ```bash
   git clone https://github.com/seu-usuario/entrevistaI.A.git
   ```

3. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/minha-funcionalidade
   ```

4. **Faça suas alterações**
   - Siga o estilo de código existente
   - Adicione comentários quando necessário
   - Teste suas mudanças

5. **Commit** suas alterações
   ```bash
   git commit -m "✨ Adiciona nova funcionalidade X"
   ```

6. **Push** para seu fork
   ```bash
   git push origin feature/minha-funcionalidade
   ```

7. **Abra um Pull Request** no repositório original

#### Padrão de Commits

Use commits semânticos com emojis:

- ✨ `:sparkles:` - Nova funcionalidade
- 🐛 `:bug:` - Correção de bug
- 📝 `:memo:` - Documentação
- 🎨 `:art:` - Melhoria de UI/UX
- ♻️ `:recycle:` - Refatoração
- ⚡ `:zap:` - Melhoria de performance
- 🔧 `:wrench:` - Configuração
- 🚀 `:rocket:` - Deploy/Release

Exemplo:
```bash
git commit -m "✨ Adiciona exportação de relatórios em PDF"
```

## 🎯 Áreas para Contribuição

### Frontend
- Melhorias na interface
- Responsividade mobile
- Modo escuro
- Animações e transições
- Acessibilidade

### IA Integration
- Novos modelos de IA
- Otimização de prompts
- Análise de sentimento melhorada
- Novos idiomas

### Features
- Exportação de relatórios (PDF, Excel)
- Comparação entre candidatos
- Sistema de templates
- Integração com calendário
- Notificações por email

### Documentação
- Tutoriais em vídeo
- Exemplos de uso
- Traduções
- FAQ expandido
- Casos de uso

## 📏 Padrões de Código

### HTML
```html
<!-- Estrutura semântica -->
<section class="nome-secao">
    <h2>Título</h2>
    <p>Conteúdo</p>
</section>

<!-- Indentação: 4 espaços -->
<!-- Classes descritivas em kebab-case -->
```

### CSS
```css
/* Organização por componente */
/* BEM notation quando apropriado */
.componente {
    /* Layout */
    display: flex;
    
    /* Espaçamento */
    padding: 1rem;
    
    /* Tipografia */
    font-size: 1rem;
    
    /* Cores */
    color: var(--primary-color);
}

/* Variáveis CSS para cores e medidas */
:root {
    --primary-color: #667eea;
    --spacing-sm: 0.5rem;
}
```

### JavaScript
```javascript
// ES6+ syntax
// Funções descritivas
// Comentários em português
// JSDoc quando necessário

/**
 * Analisa resposta do candidato com IA
 * @param {string} transcript - Texto transcrito
 * @param {string} position - Posição do candidato
 * @returns {Promise<Object>} Análise completa
 */
async function analyzeWithAI(transcript, position) {
    // Implementação
}
```

## 🧪 Testando

Antes de enviar um PR:

1. **Teste no Chrome e Edge**
2. **Verifique responsividade** (F12 > Device Toolbar)
3. **Teste com API keys reais** (se aplicável)
4. **Teste modo demo** (sem APIs)
5. **Verifique console** (sem erros)
6. **Valide HTML/CSS** (W3C Validator)

## 📦 Estrutura de Branches

- `main` - Produção (stable)
- `develop` - Desenvolvimento (próximo release)
- `feature/*` - Novas funcionalidades
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes
- `docs/*` - Documentação

## ⚖️ Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a [Licença MIT](LICENSE).

## 🌟 Reconhecimento

Contribuidores serão listados no README.md e terão seus nomes eternizados no projeto!

## 📞 Dúvidas?

- Abra uma [Discussion](https://github.com/feelps04/entrevistaI.A/discussions)
- Entre em contato via Issues
- Revise a documentação existente

---

**Obrigado por contribuir para tornar o TalentAI Pro ainda melhor! 🎉**

Toda contribuição, por menor que seja, é valiosa e apreciada.
