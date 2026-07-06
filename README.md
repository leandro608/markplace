# Calculadora de Precificação Amazon BR

Calculadora **inversa** de precificação para vendedores na Amazon Brasil. Informe todos os seus custos e a margem de lucro desejada — a ferramenta calcula o preço de venda ideal e mostra a margem de contribuição por unidade vendida.

## Funcionalidades

- **Identidade visual de marca**: exibição dos logotipos Markplace e Amazon no topo da calculadora
- **Custos fixos**: produto, embalagem, logística (FBA/DBA/FBM), custo fixo por unidade
- **Comissão Amazon (ref. julho/2026)**: por categoria com comissão mínima de R$ 1,00 ou R$ 2,00, além de regras progressivas para móveis e acessórios eletrônicos
- **Plano de vendedor (ref. julho/2026)**: Individual (R$ 2/un) ou Profissional (R$ 19/mês), com opção de promoção de 1º ano grátis
- **Custos variáveis**: impostos, campanhas, ads, cupons, afiliados, parcelamento, devoluções
- **Margem desejada**: percentual sobre preço ou valor fixo em R$
- **Resultado**: preço sugerido, breakdown completo e margem de contribuição

## Como usar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Build

```bash
npm run build
npm run preview
```

## Fórmula

A calculadora resolve o preço de venda (P) de forma inversa:

```
P = Custos Fixos + Custos Variáveis(P) + Margem Desejada
```

Como vários custos são percentuais sobre P (comissão, impostos, ads, etc.), o cálculo usa busca binária para encontrar o preço exato que atinge sua margem.

## Referência de custos de plataforma (julho/2026)

- Plano Individual: **R$ 2,00 por item vendido**
- Plano Profissional: **R$ 19,00/mês** (com promoção de 1º ano grátis para novos sellers)
- Comissão por categoria: **10% a 15%**, com mínimos por item de **R$ 1,00** ou **R$ 2,00**

## Governança de atualização

- A interface exibe um card com:
  - data da última revisão
  - links oficiais de consulta
  - checklist operacional de atualização
  - alerta automático quando a revisão ultrapassa 30 dias
- Também exibe um **badge global no topo da página** quando a revisão está vencida
- Os metadados e fontes ficam centralizados em:
  - `src/data/platformReferences.ts`

### Rotina recomendada

1. Revisar páginas oficiais da Amazon.
2. Ajustar categorias/taxas em `src/data/amazonCategories.ts`.
3. Atualizar metadados em `src/data/platformReferences.ts`.
4. Executar `npm run build` antes de publicar.

## Aviso

Taxas baseadas nas informações públicas da Amazon Brasil. Sempre confirme valores atualizados no [Seller Central](https://sellercentral.amazon.com.br/).
