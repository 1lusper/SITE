# Dark System — Ideias de Design

## Contexto
Site de evento de música eletrônica underground (Hi-Tech / Dark Psytrance) com identidade visual cyberpunk/dark.
Paleta original: preto profundo + ciano elétrico (#00d9ff) + verde neon (#00ffa6).

---

<response>
<probability>0.07</probability>
<text>
## Ideia 1 — "Circuito Vivo" (Cyberpunk Industrial)

**Design Movement:** Cyberpunk Industrial + Brutalism Digital

**Core Principles:**
1. Contraste extremo: preto absoluto vs. ciano elétrico
2. Tipografia técnica/monospace como elemento visual dominante
3. Bordas e linhas como ornamento estrutural (circuit board aesthetic)
4. Ruído e textura para profundidade (grain overlay)

**Color Philosophy:**
- Fundo: #000000 puro com gradientes sutis de #0a0a0a
- Primário: #00d9ff (ciano elétrico) — energia, tecnologia, futuro
- Secundário: #00ffa6 (verde neon) — vida, psicodelia, contraste
- Destaque: #ff2b2b (vermelho) — urgência, badges ao vivo
- Texto: #b8c7d1 (cinza azulado) para corpo, branco puro para títulos

**Layout Paradigm:**
- Layout assimétrico com grid de 12 colunas
- Seções separadas por linhas de gradiente (circuit traces)
- Hero ocupa 100vw sem margens
- Cards de artistas em grid irregular com hover 3D

**Signature Elements:**
1. Partículas conectadas por linhas (canvas WebGL) no background
2. Bordas com efeito "glow" ciano em todos os elementos interativos
3. Texto com letter-spacing exagerado e uppercase

**Interaction Philosophy:**
- Hover revela informações com fade + translate
- Scroll suave com efeito parallax nos elementos de fundo
- Botões com efeito de "scan" de luz ao hover

**Animation:**
- Partículas flutuantes no canvas (já implementado no original)
- Pulse nos boxes do countdown
- Fade-in de seções ao entrar no viewport (IntersectionObserver)
- Glow pulsante nos elementos de destaque

**Typography System:**
- Display: Orbitron (700) — títulos, navbar, badges
- Body: Space Mono (400) — descrições, textos secundários
- Hierarchy: 48px títulos / 18px nav / 14px corpo
</text>
</response>

<response>
<probability>0.06</probability>
<text>
## Ideia 2 — "Abismo Digital" (Dark Ambient + Glitch)

**Design Movement:** Dark Ambient Glitch Art + Vaporwave Invertido

**Core Principles:**
1. Profundidade visual através de camadas de opacidade
2. Efeito glitch como elemento de identidade
3. Gradientes de cor quente-fria (roxo escuro → ciano)
4. Assimetria intencional como linguagem visual

**Color Philosophy:**
- Fundo: gradiente de #000000 para #0d0015 (preto com toque de roxo)
- Primário: #00d9ff com variações de opacidade
- Acento: #7b2fff (roxo elétrico) — profundidade psicodélica
- Contraste: #ff6b35 (laranja) para elementos de urgência

**Layout Paradigm:**
- Seções com clip-path diagonal para quebrar a monotonia
- Cards flutuantes com z-index variável
- Navbar com glassmorphism extremo

**Signature Elements:**
1. Efeito glitch em títulos (CSS animation com clip-path)
2. Scanlines sutis sobre imagens
3. Bordas com gradiente animado

**Interaction Philosophy:**
- Micro-animações de distorção ao hover
- Transições de página com efeito de "corrupção de dados"

**Animation:**
- Glitch keyframes em títulos importantes
- Scanline overlay animado
- Partículas com velocidade variável por zona

**Typography System:**
- Display: Orbitron (700) + efeito glitch CSS
- Mono: Space Mono para dados técnicos
- Accent: Rajdhani para subtítulos
</text>
</response>

<response>
<probability>0.08</probability>
<text>
## Ideia 3 — "Frequência Negra" (Minimalismo Técnico)

**Design Movement:** Technical Minimalism + Swiss Grid Subvertido

**Core Principles:**
1. Espaço negativo como elemento de design
2. Tipografia como único ornamento
3. Uma única cor de acento (ciano) usada com precisão cirúrgica
4. Grid estrito mas com quebras intencionais

**Color Philosophy:**
- Fundo: #050505 (quase preto, com textura)
- Único acento: #00d9ff — usado apenas em elementos críticos
- Texto: escala de cinza de #ffffff a #444444
- Sem gradientes complexos — apenas sólidos e transparências

**Layout Paradigm:**
- Grid de 12 colunas com gutters generosos
- Seções com padding vertical exagerado
- Alinhamento à esquerda dominante (anti-centralizado)

**Signature Elements:**
1. Linhas horizontais finas como separadores
2. Números grandes e translúcidos como decoração de fundo
3. Tipografia em escala extrema para impacto visual

**Interaction Philosophy:**
- Transições lentas e elegantes (500ms ease)
- Hover com apenas mudança de cor (sem transforms)

**Animation:**
- Fade-in sequencial de elementos
- Underline animado nos links
- Countdown com flip animation

**Typography System:**
- Display: Orbitron (900) em tamanhos extremos
- Body: Inter (400/500) para legibilidade
- Mono: JetBrains Mono para dados
</text>
</response>

---

## Escolha Final: **Ideia 1 — "Circuito Vivo"**

Fiel à identidade original do Dark System. Mantém a estética cyberpunk/industrial com:
- Partículas canvas no fundo
- Ciano elétrico + verde neon como cores principais
- Orbitron como fonte de display
- Bordas com glow, hover reveals, animações de pulse
- Layout responsivo com seções bem definidas
