# Deploy do rayzer.fun na HostGator

Este projeto usa Vite (frontend em `dist/public`) + servidor Node opcional.

## 1) Escolha de hospedagem

### A) HostGator compartilhada (sem Node dedicado)
Use **somente frontend estático**.

1. Instale dependências:
   ```bash
   pnpm install
   ```
   Se o ambiente bloquear pacotes opcionais de backend (ex.: AWS SDK), use:
   ```bash
   npm install --omit=optional
   ```
2. Gere o pacote pronto para HostGator:
   ```bash
   pnpm run deploy:hostgator
   ```
3. Faça upload do conteúdo de `deploy/hostgator/public_html/` para `public_html/` do domínio `rayzer.fun`.
4. Garanta que o arquivo `.htaccess` foi enviado (ele faz fallback SPA para `index.html`).

> Se você tiver APIs próprias em Node/Express, elas não vão rodar em hospedagem compartilhada comum.

### B) HostGator VPS/Cloud com Node
Use projeto completo (frontend + backend).

1. Configure variáveis de ambiente (`.env`).
2. Build completo:
   ```bash
   pnpm build
   ```
3. Inicie com PM2 (exemplo):
   ```bash
   pm2 start dist/index.js --name rayzer
   pm2 save
   ```
4. Configure Nginx/Apache como reverse proxy para a porta da app.

## 2) Atualização direta do site (sem abrir cPanel)

Sim, tem como atualizar direto por FTP com um comando.

### Pré-requisito
- Ter `lftp` (preferencial) ou `curl` instalado na máquina que vai executar o deploy.

### Variáveis necessárias
```bash
export HOSTGATOR_FTP_HOST='ftp.rayzer.fun'
export HOSTGATOR_FTP_USER='SEU_USUARIO_FTP'
export HOSTGATOR_FTP_PASS='SUA_SENHA_FTP'
# opcional (padrão: public_html)
export HOSTGATOR_FTP_REMOTE_DIR='public_html'
# opcional: ftp (padrão) ou ftps
export HOSTGATOR_FTP_PROTOCOL='ftp'
# opcional: porta customizada
export HOSTGATOR_FTP_PORT=''
```

### Gerar arquivo necessário automaticamente

Para criar o arquivo que você vai usar no deploy (`.env.hostgator`) sem digitar caminho/manual:

```bash
pnpm run deploy:hostgator:setup-env
```

Depois edite o `.env.hostgator` e rode:

```bash
pnpm run deploy:hostgator:check
pnpm run deploy:hostgator:public-only
# ou
pnpm run deploy:hostgator:direct
```

### Teste de conexão (antes do deploy)

```bash
pnpm run deploy:hostgator:check
```

Se retornar `Conexão FTP OK.`, o deploy direto está pronto para uso.

### Comando único (build + upload direto)
```bash
pnpm run deploy:hostgator:direct
```

Esse comando:
1. gera `dist/public`,
2. prepara `deploy/hostgator/public_html`,
3. sincroniza tudo por FTP (`lftp mirror -R --delete` ou fallback `curl`).

> Atenção: no modo `lftp`, `--delete` remove no servidor arquivos que não existem localmente. No modo fallback `curl`, não há limpeza remota automática.

### Atualizar imediatamente (sem build, só arquivos públicos)

Se quiser aplicar ajustes imediatos de arquivos estáticos (ex.: `.htaccess`, assets em `client/public`) sem depender de `pnpm install`/build:

```bash
pnpm run deploy:hostgator:public-only
```

Opcional para mudar pasta local:
```bash
export HOSTGATOR_PUBLIC_ONLY_DIR='client/public'
```

### Modo Codex -> HostGator (recomendado para deploy recorrente)

1. Crie o arquivo de segredos local (não versionado):
   ```bash
   cp .env.hostgator.example .env.hostgator
   ```
2. Edite `.env.hostgator` com seu FTP da HostGator.
3. Rode deploy direto:
   ```bash
   pnpm run deploy:hostgator:direct
   ```

Isso permite atualizar direto do ambiente de terminal/Codex para a HostGator sem passar pelo cPanel.

## Método alternativo (arquivo ZIP pronto)

Se preferir subir um único arquivo no Gerenciador de Arquivos da HostGator:

```bash
pnpm run deploy:hostgator:zip
```

Isso gera `deploy/hostgator/rayzer-fun-public_html.zip`.
Depois, envie esse ZIP para `public_html` e extraia no próprio cPanel.

## 3) DNS do domínio rayzer.fun
No painel DNS, configure:

- `@` apontando para IP do servidor (A record)
- `www` apontando para `@` (CNAME)

## 4) SSL
Ative Let's Encrypt/AutoSSL no painel HostGator e force HTTPS.

## 5) Checklist rápido

- [ ] `rayzer.fun` abre sem erro 404 em refresh de rota interna.
- [ ] HTTPS ativo e válido.
- [ ] Se usar backend: endpoint `/api/...` respondendo.
- [ ] Logs sem erro crítico.
