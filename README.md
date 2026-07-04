# Calculadora de Precificação Amazon BR

Calculadora **inversa** de precificação para vendedores na Amazon Brasil. Informe todos os seus custos e a margem de lucro desejada — a ferramenta calcula o preço de venda ideal e mostra a margem de contribuição por unidade vendida.

## Funcionalidades

- **Custos fixos**: produto, embalagem, logística (FBA/DBA/FBM), custo fixo por unidade
- **Comissão Amazon**: por categoria (com regras progressivas para móveis e acessórios eletrônicos) ou personalizada
- **Plano de vendedor**: Individual (R$ 2/un) ou Profissional (mensalidade rateada)
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

## Aviso

Taxas baseadas nas informações públicas da Amazon Brasil. Sempre confirme valores atualizados no [Seller Central](https://sellercentral.amazon.com.br/).
