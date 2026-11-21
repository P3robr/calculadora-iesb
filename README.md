# Calculadora IESB

Calculadora de médias para celular e computador. Digite as notas de P1 e P2 para ver média, menção e projeções de P2 ou P3. Funciona inteiramente no navegador, sem cadastro, dependências ou coleta de notas.

## Regras preservadas

As fórmulas e a ordem das operações seguem a [calculadora de Gabriel Sancho](https://github.com/Sancho41/calculadora_iesb/blob/master/calculadora.vue): P1 com peso de 40%, P2 com peso de 60%, aprovação em 4,96, projeções mirando 5,00, escolha da substituição e arredondamento em duas casas. As menções usam a média arredondada; a aprovação usa a média original. Portanto, aprovação e menção MI podem aparecer juntas.

Cada menção tem uma cor própria, compartilhada entre a legenda, o selo do resultado e a barra da média. A menção atual também fica contornada na legenda. A logo e o favicon foram obtidos do [site do IESB](https://www.iesb.br/); a calculadora é um projeto independente.

## Desenvolvimento

Requer Node.js 20 ou superior apenas para os comandos locais:

```sh
node serve.mjs
node --test
```

Abra o endereço mostrado pelo servidor. O teste de paridade pode também comparar diretamente com uma cópia local do componente Vue original:

```sh
node --test tests/calculator.test.mjs
node tests/compare-original.mjs caminho/para/calculadora.vue
```

## Publicação

No GitHub Pages, configure a publicação pela branch `main`, pasta `/` (raiz). Os arquivos usam caminhos relativos e `.nojekyll`; não há etapa de build. As notas ficam apenas na memória da página e são apagadas ao recarregar.
