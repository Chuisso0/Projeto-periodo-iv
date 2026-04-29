# 🎮 GoldOffers – Monitoramento e Agregador de Ofertas de Jogos

## 📌 Informações Acadêmicas

* **Instituição:** Centro Universitário Augusto Motta (UNISUAM)
* **Curso:** Análise e Desenvolvimento de Sistemas (ADS)
* **Módulo:** Mobile / 4º Período
* **Professor:** Charles Bastos
* **Ano:** 2026 / 1º Semestre

### 👥 Grupo

* Guilherme de Souza Chuisso
* Rogério Dorcelino

---

## 🚀 Sobre o Projeto

O **GoldOffers** é um aplicativo híbrido desenvolvido para auxiliar jogadores na busca pelas melhores ofertas de jogos para PC.

A aplicação centraliza dados de múltiplas lojas, permitindo que o usuário:

* monitore preços em tempo real
* encontre promoções rapidamente
* salve seus jogos favoritos na nuvem

---

## ✅ Funcionalidades Implementadas

* ✔️ **Autenticação e Cadastro**
  Integração com Firebase Authentication

* ✔️ **Feed de Ofertas**
  Consumo dinâmico das APIs RAWG e IsThereAnyDeal

* ✔️ **Busca em Tempo Real**
  Pesquisa com filtros de preço e metadados

* ✔️ **Favoritos (CRUD)**
  Armazenamento persistente no Cloud Firestore

* ✔️ **Recurso Nativo (Desafio)**
  Exportação da lista de desejos em `.txt` usando @capacitor/filesystem

* ✔️ **Tela de Desenvolvedores**
  Identificação criativa da equipe

---

## 🛠️ Tecnologias e Ferramentas

* **Framework:** Ionic (Standalone Components)
* **Linguagem:** Angular & TypeScript
* **APIs:** RAWG API e IsThereAnyDeal API
* **Banco de Dados:** Firebase Cloud Firestore
* **Prototipagem:** Figma

---

## 📁 Links Obrigatórios (Entregáveis)

### 🎨 Design (Wireframes)

Protótipos desenvolvidos no Figma:
🔗 **Link:** [Figma](https://www.figma.com/design/MlKQbohNyiEDDJZuUhtcWt/Untitled?node-id=0-1&p=f&m=draw)

---

### 📲 Aplicativo (Android)

Arquivo APK pronto para instalação:
📥 **Download:** [APK](./GoldOffers.apk)

---

### 💻 Código Fonte

Este repositório contém todo o código do projeto, exceto:

* `node_modules`
* `android`
* `www`

---

## ⚙️ Como rodar o projeto localmente

### 🔹 Clone o repositório

```bash
git clone https://github.com/Chuisso0/Projeto-periodo-iv.git
```

### 🔹 Instale as dependências

```bash
npm install
```

### 🔹 Execute no navegador

```bash
ionic serve
```

### 🔹 Executar no Android

```bash
ionic build
npx cap sync android
npx cap run android
```

---

## 📄 Documentação Final

A documentação técnica completa (PDF), seguindo normas ABNT, está disponível na raiz do projeto:

📥 **Download:** [PDF](./PDF-PROJETO.pdf)

---

## 📚 Considerações Finais

Projeto desenvolvido para fins acadêmicos na disciplina de **Desenvolvimento de Aplicativos Mobile**.

---
