// Configuração de posições, áreas e senioridades
const POSITIONS_CONFIG = {
    // DESENVOLVIMENTO
    'desenvolvedor-junior-react': {
        title: 'Desenvolvedor React Junior',
        area: 'Desenvolvimento Frontend',
        seniority: 'Junior',
        keywords: {
            technical: {
                keywords: ['react', 'javascript', 'html', 'css', 'jsx', 'hooks', 'state', 'props', 'components', 'npm', 'git', 'vscode'],
                phrases: ['componentes funcionais', 'useState', 'useEffect', 'jsx syntax', 'virtual dom'],
                weight: 0.4
            },
            communication: {
                keywords: ['explicar', 'aprender', 'perguntar', 'documentar', 'readme', 'comentários'],
                phrases: ['trabalho em equipe', 'feedback', 'code review'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['debug', 'console.log', 'erro', 'bug', 'resolver', 'pesquisar', 'stackoverflow'],
                phrases: ['resolvi um bug', 'encontrei a solução', 'debuguei'],
                weight: 0.2
            },
            leadership: {
                keywords: ['iniciativa', 'proativo', 'ajudar', 'colaborar'],
                phrases: ['tomei iniciativa', 'ajudei um colega'],
                weight: 0.1
            }
        },
        expectedScore: { min: 60, ideal: 75 }
    },

    'desenvolvedor-pleno-react': {
        title: 'Desenvolvedor React Pleno',
        area: 'Desenvolvimento Frontend',
        seniority: 'Pleno',
        keywords: {
            technical: {
                keywords: ['react', 'javascript', 'typescript', 'redux', 'context', 'hooks', 'testing', 'jest', 'webpack', 'babel', 'sass', 'styled-components'],
                phrases: ['custom hooks', 'context api', 'state management', 'unit tests', 'performance optimization'],
                weight: 0.35
            },
            communication: {
                keywords: ['explicar', 'ensinar', 'documentar', 'apresentar', 'code review', 'mentoria'],
                phrases: ['expliquei para o time', 'documentei o processo', 'fiz apresentação'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['otimizar', 'refatorar', 'arquitetura', 'performance', 'solução', 'análise', 'debugging'],
                phrases: ['otimizei a performance', 'refatorei o código', 'arquitetei a solução'],
                weight: 0.25
            },
            leadership: {
                keywords: ['mentoria', 'orientar', 'liderar', 'coordenar', 'decisão'],
                phrases: ['mentorei junior', 'liderei o desenvolvimento', 'tomei decisões técnicas'],
                weight: 0.15
            }
        },
        expectedScore: { min: 70, ideal: 85 }
    },

    'desenvolvedor-senior-react': {
        title: 'Desenvolvedor React Senior',
        area: 'Desenvolvimento Frontend',
        seniority: 'Senior',
        keywords: {
            technical: {
                keywords: ['react', 'typescript', 'next.js', 'graphql', 'microservices', 'ci/cd', 'docker', 'aws', 'performance', 'security', 'architecture'],
                phrases: ['arquitetura escalável', 'design patterns', 'code splitting', 'ssr', 'micro frontends'],
                weight: 0.3
            },
            communication: {
                keywords: ['stakeholders', 'apresentar', 'workshop', 'treinamento', 'documentação', 'technical writing'],
                phrases: ['apresentei para stakeholders', 'conduzi workshop', 'escrevi documentação técnica'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['arquitetura', 'escalabilidade', 'performance', 'otimização', 'debugging', 'monitoring'],
                phrases: ['arquitetei sistema escalável', 'otimizei performance crítica', 'implementei monitoring'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'mentoria', 'technical lead', 'decisões', 'estratégia', 'roadmap'],
                phrases: ['liderei equipe técnica', 'defini arquitetura', 'mentorei desenvolvedores'],
                weight: 0.2
            }
        },
        expectedScore: { min: 80, ideal: 90 }
    },

    // PYTHON
    'desenvolvedor-python-junior': {
        title: 'Desenvolvedor Python Junior',
        area: 'Desenvolvimento Backend',
        seniority: 'Junior',
        keywords: {
            technical: {
                keywords: ['python', 'django', 'flask', 'sql', 'git', 'pip', 'virtualenv', 'json', 'api', 'http'],
                phrases: ['python básico', 'django models', 'flask routes', 'sql queries'],
                weight: 0.4
            },
            communication: {
                keywords: ['explicar', 'aprender', 'documentar', 'perguntar'],
                phrases: ['aprendi python', 'documentei código'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['debug', 'erro', 'exception', 'resolver', 'testar'],
                phrases: ['debuguei erro', 'resolvi exception'],
                weight: 0.2
            },
            leadership: {
                keywords: ['iniciativa', 'colaborar', 'ajudar'],
                phrases: ['tomei iniciativa'],
                weight: 0.1
            }
        },
        expectedScore: { min: 55, ideal: 70 }
    },

    'desenvolvedor-python-senior': {
        title: 'Desenvolvedor Python Senior',
        area: 'Desenvolvimento Backend',
        seniority: 'Senior',
        keywords: {
            technical: {
                keywords: ['python', 'django', 'fastapi', 'postgresql', 'redis', 'celery', 'docker', 'kubernetes', 'aws', 'microservices', 'async'],
                phrases: ['arquitetura python', 'design patterns', 'async programming', 'microservices python'],
                weight: 0.3
            },
            communication: {
                keywords: ['arquitetura', 'documentação', 'technical lead', 'apresentar', 'workshop'],
                phrases: ['apresentei arquitetura', 'documentei sistema'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['performance', 'escalabilidade', 'otimização', 'profiling', 'monitoring'],
                phrases: ['otimizei performance', 'escalei sistema'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'mentoria', 'technical lead', 'arquitetura', 'decisões'],
                phrases: ['liderei desenvolvimento', 'arquitetei sistema'],
                weight: 0.2
            }
        },
        expectedScore: { min: 80, ideal: 90 }
    },

    // DATA & ANALYTICS
    'analista-dados-junior': {
        title: 'Analista de Dados Junior',
        area: 'Data & Analytics',
        seniority: 'Junior',
        keywords: {
            technical: {
                keywords: ['sql', 'excel', 'python', 'pandas', 'numpy', 'matplotlib', 'power bi', 'tableau', 'estatística'],
                phrases: ['análise de dados', 'sql queries', 'visualização de dados'],
                weight: 0.4
            },
            communication: {
                keywords: ['apresentar', 'relatório', 'dashboard', 'explicar', 'insights'],
                phrases: ['apresentei insights', 'criei dashboard'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['análise', 'investigar', 'padrões', 'tendências', 'hipótese'],
                phrases: ['analisei dados', 'identifiquei padrões'],
                weight: 0.2
            },
            leadership: {
                keywords: ['iniciativa', 'proativo', 'sugestões'],
                phrases: ['sugeri melhorias'],
                weight: 0.1
            }
        },
        expectedScore: { min: 60, ideal: 75 }
    },

    'cientista-dados-senior': {
        title: 'Cientista de Dados Senior',
        area: 'Data Science',
        seniority: 'Senior',
        keywords: {
            technical: {
                keywords: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'spark', 'hadoop', 'aws', 'docker', 'mlops'],
                phrases: ['machine learning', 'modelos preditivos', 'deep learning', 'feature engineering'],
                weight: 0.35
            },
            communication: {
                keywords: ['stakeholders', 'business', 'apresentar', 'workshop', 'storytelling'],
                phrases: ['apresentei para executivos', 'traduzi dados para negócio'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['algoritmo', 'otimização', 'performance', 'escalabilidade', 'experimentação'],
                phrases: ['otimizei algoritmo', 'escalei modelo', 'experimentei abordagens'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'estratégia', 'roadmap', 'mentoria', 'data driven'],
                phrases: ['liderei iniciativa de dados', 'defini estratégia'],
                weight: 0.15
            }
        },
        expectedScore: { min: 85, ideal: 95 }
    },

    // QLIK
    'desenvolvedor-qlik-junior': {
        title: 'Desenvolvedor Qlik Junior',
        area: 'Business Intelligence',
        seniority: 'Junior',
        keywords: {
            technical: {
                keywords: ['qlik', 'qlikview', 'qlik sense', 'qvd', 'script', 'sql', 'etl', 'dashboard', 'kpi'],
                phrases: ['qlik script', 'load data', 'qvd files', 'set analysis'],
                weight: 0.4
            },
            communication: {
                keywords: ['dashboard', 'relatório', 'usuário', 'requisitos', 'apresentar'],
                phrases: ['criei dashboard', 'apresentei relatório'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['dados', 'transformação', 'limpeza', 'validação', 'performance'],
                phrases: ['transformei dados', 'validei informações'],
                weight: 0.2
            },
            leadership: {
                keywords: ['iniciativa', 'melhoria', 'sugestão'],
                phrases: ['sugeri melhorias'],
                weight: 0.1
            }
        },
        expectedScore: { min: 65, ideal: 80 }
    },

    'arquiteto-qlik-senior': {
        title: 'Arquiteto Qlik Senior',
        area: 'Business Intelligence',
        seniority: 'Senior',
        keywords: {
            technical: {
                keywords: ['qlik sense', 'qmc', 'governance', 'security', 'scalability', 'architecture', 'apis', 'extensions', 'mashups'],
                phrases: ['arquitetura qlik', 'governance bi', 'qlik extensions', 'enterprise deployment'],
                weight: 0.35
            },
            communication: {
                keywords: ['stakeholders', 'arquitetura', 'estratégia', 'workshop', 'treinamento'],
                phrases: ['apresentei arquitetura', 'conduzi treinamento'],
                weight: 0.25
            },
            problemSolving: {
                keywords: ['performance', 'otimização', 'escalabilidade', 'arquitetura', 'governance'],
                phrases: ['otimizei performance qlik', 'arquitetei solução bi'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'estratégia', 'roadmap', 'mentoria', 'governance'],
                phrases: ['liderei implementação', 'defini estratégia bi'],
                weight: 0.15
            }
        },
        expectedScore: { min: 85, ideal: 95 }
    },

    // DESIGN
    'designer-ux-junior': {
        title: 'Designer UX Junior',
        area: 'Design & UX',
        seniority: 'Junior',
        keywords: {
            technical: {
                keywords: ['figma', 'sketch', 'adobe', 'wireframe', 'prototype', 'usability', 'user research', 'personas'],
                phrases: ['design thinking', 'user journey', 'wireframes', 'protótipos'],
                weight: 0.35
            },
            communication: {
                keywords: ['usuário', 'feedback', 'apresentar', 'stakeholders', 'requisitos'],
                phrases: ['apresentei design', 'coletei feedback'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['problema', 'solução', 'usabilidade', 'experiência', 'teste'],
                phrases: ['resolvi problema de usabilidade', 'melhorei experiência'],
                weight: 0.25
            },
            leadership: {
                keywords: ['iniciativa', 'criatividade', 'inovação'],
                phrases: ['propus solução criativa'],
                weight: 0.1
            }
        },
        expectedScore: { min: 65, ideal: 80 }
    },

    'head-design-senior': {
        title: 'Head of Design',
        area: 'Design & UX',
        seniority: 'Senior',
        keywords: {
            technical: {
                keywords: ['design system', 'design ops', 'user research', 'analytics', 'a/b testing', 'conversion', 'accessibility'],
                phrases: ['design system', 'design ops', 'user research', 'design strategy'],
                weight: 0.3
            },
            communication: {
                keywords: ['liderança', 'estratégia', 'stakeholders', 'apresentação', 'workshop', 'evangelização'],
                phrases: ['apresentei estratégia', 'evangelizei design'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['estratégia', 'otimização', 'conversão', 'experiência', 'inovação'],
                phrases: ['otimizei conversão', 'inovou experiência'],
                weight: 0.2
            },
            leadership: {
                keywords: ['liderança', 'equipe', 'mentoria', 'estratégia', 'visão', 'cultura'],
                phrases: ['liderei equipe design', 'defini visão', 'construí cultura'],
                weight: 0.2
            }
        },
        expectedScore: { min: 85, ideal: 95 }
    },

    // PRODUTO
    'product-manager-pleno': {
        title: 'Product Manager Pleno',
        area: 'Produto',
        seniority: 'Pleno',
        keywords: {
            technical: {
                keywords: ['roadmap', 'backlog', 'scrum', 'agile', 'jira', 'analytics', 'metrics', 'kpi', 'mvp'],
                phrases: ['product roadmap', 'user stories', 'product metrics', 'go-to-market'],
                weight: 0.3
            },
            communication: {
                keywords: ['stakeholders', 'desenvolvimento', 'design', 'negócio', 'apresentação', 'alinhamento'],
                phrases: ['alinhei stakeholders', 'apresentei roadmap'],
                weight: 0.3
            },
            problemSolving: {
                keywords: ['problema', 'solução', 'priorização', 'trade-off', 'decisão', 'dados'],
                phrases: ['priorizei features', 'tomei decisões baseadas em dados'],
                weight: 0.25
            },
            leadership: {
                keywords: ['liderança', 'visão', 'estratégia', 'influência', 'coordenação'],
                phrases: ['liderei produto', 'defini visão', 'influenciei decisões'],
                weight: 0.15
            }
        },
        expectedScore: { min: 75, ideal: 85 }
    }
};

// Exportar configuração
window.POSITIONS_CONFIG = POSITIONS_CONFIG;
