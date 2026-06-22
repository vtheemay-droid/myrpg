# 🎲 Sistema de Fichas RPG

Site de fichas de RPG com painel de Mestre e Player, usando Netlify Blobs como banco de dados.

---

## 🚀 Deploy no Netlify

### Passo a Passo

1. **Faça upload desta pasta para o GitHub**
   - Crie um repositório no GitHub
   - Envie todos os arquivos desta pasta

2. **Conecte ao Netlify**
   - Acesse [netlify.com](https://netlify.com) e faça login
   - Clique em **"Add new site" → "Import an existing project"**
   - Escolha seu repositório GitHub

3. **Configurações de build**
   - Build command: `npm install`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

4. **Ative o Netlify Blobs**
   - No painel do Netlify, vá em **Site configuration → Blobs**
   - Ative o Blob storage (é gratuito no plano Free)

5. **Faça o deploy** — pronto! 🎉

---

## 🔑 Credenciais

| Role   | Acesso                          |
|--------|---------------------------------|
| Mestre | Token: `mA1B2C3D4`              |
| Player | ID de 6 dígitos gerado ao criar |

---

## 🌈 Hibricidades e Cores

| Hibricidade                  | Cor HUD  |
|------------------------------|----------|
| Humano Comum                 | `#c0c8d0` Cinza frio |
| Humano Meca                  | `#ff7a00` Laranja maquinário |
| Humano Bestial               | `#5cba3c` Verde selvagem |
| Humano c/ Energia Negativa   | `#9b30ff` Roxo sombrio |
| Humano c/ Energia Positiva   | `#ffe600` Amarelo solar |
| Humano Perfeito              | `#00f0c8` Ciano esmeralda |
| Humano Infernal              | `#ff2020` Vermelho infernal |

---

## 📋 Funcionalidades

- **Mestre**: cria fichas, edita todos os campos, vê todas as fichas na sidebar
- **Player**: acessa sua ficha pelo ID de 6 dígitos, visualização somente-leitura
- **Banco de dados**: Netlify Blobs (sem localStorage, dados persistem no servidor)
- **HUD dinâmico**: cor muda automaticamente conforme a hibricidade selecionada
- **Ctrl+S**: salva a ficha rapidamente no painel do Mestre
- **Copiar ID**: botão para copiar o ID e passar pro player

## 📁 Estrutura

```
rpg-ficha/
├── public/
│   └── index.html          ← Site principal (single page)
├── netlify/
│   └── functions/
│       └── ficha.js        ← API backend (Netlify Functions + Blobs)
├── netlify.toml            ← Configuração do Netlify
├── package.json
└── README.md
```
