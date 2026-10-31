# Fast-path — quando a revisão é pulada

Implementado em [`.claude/hooks/lib/change-classifier.mjs`](../../../hooks/lib/change-classifier.mjs).
O hook decide sozinho; na dúvida ele **revisa** (o classificador é conservador).

## Passa direto

Só quando **as quatro** condições valem:

**1. O arquivo é visual**

```txt
src/modules/*/presentation/view/**
src/modules/*/components/**
src/shared/components/**
```

**2. Nenhuma linha alterada tem lógica**

Invalida: `import`, `export`, `if`, `return`, `await`, `=>`, `?`, `&&`, `||`,
`router`, `useState`, `useQuery`, `useMutation`, `useForm`, `useFeature`...

**3. Nenhuma linha nova arrisca o white label**

Invalida: hex (`#fff`), `rgb(`, paleta padrão do Tailwind (`bg-gray-200`, `text-white`), a palavra `client`.

**4. Só o conteúdo mudou, não a estrutura**

Strings e texto de JSX são neutralizados; se a quantidade de linhas ou a forma de
qualquer linha mudar, revisa.

## Nunca passa direto

- domain, data, factories, `presentation/hooks`, `presentation/view-model`
- `src/app/**`, `src/shared/{brand,data,domain,utils}`, `clients/**`
- arquivo novo; `Write` sobrescrevendo o arquivo inteiro
- linha com `http`, `/api/`, `baseURL`, `token`, `password`...

## Exemplos

| Mudança                                                               | Fast-path            |
| --------------------------------------------------------------------- | -------------------- |
| `<Text>Entre na sua conta.</Text>` → `<Text>Acesse sua conta.</Text>` | ✅                   |
| `className="bg-surface p-4"` → `className="bg-background p-6"`        | ✅                   |
| `className="bg-surface"` → `className="bg-gray-100"`                  | ❌ paleta padrão     |
| `title="Entrar"` → `title={isSubmitting ? "..." : "Entrar"}`          | ❌ lógica            |
| texto em `domain/use-cases`                                           | ❌ camada de negócio |

## Testar o critério

```bash
node --input-type=module -e "import('./.claude/hooks/lib/change-classifier.mjs').then(m => console.log(m.classifyEdit('src/modules/signin/presentation/view/signin-view.tsx', 'p-4', 'p-6')))"
```
