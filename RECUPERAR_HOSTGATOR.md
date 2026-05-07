# Recuperar projeto do HostGator e subir para o GitHub

Use este guia para pegar a versão que estava sendo editada no HostGator e continuar no GitHub/Codex.

## 1. Encontrar a pasta do site no HostGator

No cPanel, abra **File Manager / Gerenciador de Arquivos** e procure por uma dessas pastas:

- `public_html`
- `rayzer.fun`
- `rayer.fun`
- `domains/rayzer.fun/public_html`
- `domains/rayer.fun/public_html`
- `subdomains`

Se tiver SSH, rode:

```bash
pwd
ls -la
find ~ -maxdepth 4 -iname "package.json" -o -iname "vite.config.*" -o -iname "next.config.*" -o -iname "index.html"
```

## 2. Fazer backup antes de mexer

Dentro da pasta do site, rode:

```bash
cd ~/public_html
zip -r backup-site-hostgator.zip . -x "node_modules/*" ".git/*" "dist/*" ".next/*"
```

Se a pasta não for `public_html`, troque pelo caminho correto.

## 3. Inicializar Git na pasta do site

```bash
cd ~/public_html

git init
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/1lusper/SITE.git
git checkout -B hostgator-recuperado
```

## 4. Evitar subir arquivos pesados ou sensíveis

Crie/atualize `.gitignore`:

```bash
cat > .gitignore <<'EOF'
node_modules/
dist/
build/
.next/
.env
.env.*
*.log
.cache/
.DS_Store
backup-*.zip
EOF
```

## 5. Subir para o GitHub

```bash
git add .
git commit -m "recupera versao do HostGator"
git push -u origin hostgator-recuperado
```

## 6. Continuar no Codex

Depois abra o Codex usando:

- Repositório: `1lusper/SITE`
- Branch: `hostgator-recuperado`

## Se pedir login do GitHub no terminal

Use usuário `1lusper` e um token do GitHub no lugar da senha. No GitHub:

Settings > Developer settings > Personal access tokens > Tokens classic > Generate new token

Permissões mínimas: `repo`.

## Atenção

Não suba `.env`, senhas de banco, tokens, credenciais do cPanel, chaves API ou arquivos de backup grandes.