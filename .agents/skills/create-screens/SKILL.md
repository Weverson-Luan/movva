---
name: create-screens
description: Cria uma tela do Movva (rota + View + ViewModel + schema) no padrão MVVM do projeto, com cores do tema e padrão de tela obrigatório. Use ao criar ou reestruturar uma tela.
---

<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/create-screens/SKILL.md. Edite a fonte e rode: pnpm ai:sync -->

# SKILL — Criar tela (MVVM)

Referência viva: o login — `src/app/signin.tsx`,
`src/modules/signin/presentation/{view,view-model}/`.

## Estrutura

```txt
src/app/<rota>.tsx                                        rota: liga VM + View
src/modules/<modulo>/presentation/view/<tela>-view.tsx    View: só desenha
src/modules/<modulo>/presentation/view-model/<tela>-view-model.ts
src/modules/<modulo>/presentation/view-model/<tela>-schema.ts   (se tiver formulário)
```

Rota privada (exige login): dentro de `src/app/(private)/`.

## Rota

Só compõe. Nada de estado, efeito ou dado aqui.

```tsx
/**
 * IMPORTS
 */
import SignInView from "@/modules/signin/presentation/view/signin-view";
import { useSignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";

// A rota liga o view-model à view: a view só recebe props.
const SignIn = () => {
  const viewModel = useSignInViewModel();
  return <SignInView {...viewModel} />;
};

/**
 * EXPORTS
 */
export default SignIn;
```

## ViewModel

Responsável por: estado de tela, formulário, chamar o hook de dados do módulo, navegação.
**Não pode:** JSX, componente visual, axios, toast de erro (o hook já mostra).

```ts
/**
 * IMPORTS
 */
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { useSignInMutation } from "@/modules/signin/presentation/hooks/queries/auth/use-signin-mutation";
import { type SignInFormData, signInSchema } from "./signin-schema";

const useSignInViewModel = () => {
  const signInMutation = useSignInMutation();

  const { control, handleSubmit } = useForm<SignInFormData>({
    resolver: yupResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  // Erro: o service trata e o hook mostra o toast. Aqui só o caminho de sucesso.
  const onSubmit = handleSubmit((signInData) => {
    signInMutation.mutate(signInData, {
      onSuccess: () => router.replace("/(private)/dashboard"),
    });
  });

  return {
    control,
    onSubmit,
    isSubmitting: signInMutation.isPending,
  };
};

type SignInViewModel = ReturnType<typeof useSignInViewModel>;

/**
 * EXPORTS
 */
export type { SignInViewModel };
export { useSignInViewModel };
```

Regras:

- `mutate(dados, { onSuccess })`, não `mutateAsync` + `try/catch`.
- Retorne só o que a View usa, com nomes de intenção (`isSubmitting`, `goToSignUp`).
- Exporte o tipo `XViewModel` — é o tipo das props da View.

## Schema (formulário)

```ts
/**
 * IMPORTS
 */
import * as yup from "yup";

const signInSchema = yup.object({
  email: yup.string().trim().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
});

type SignInFormData = yup.InferType<typeof signInSchema>;

/**
 * EXPORTS
 */
export type { SignInFormData };
export { signInSchema };
```

Regra de validação igual à do backend (ex.: tamanho mínimo de senha) para o erro
aparecer no campo, em português, antes da requisição.

## View

Recebe tudo por props. Padrão de tela obrigatório (`CLAUDE.md`).

```tsx
/**
 * IMPORTS
 */
import type { FC } from "react";
import { Text } from "react-native";
import type { SignInViewModel } from "@/modules/signin/presentation/view-model/signin-view-model";
import { useBrand } from "@/shared/brand/BrandProvider";
import { InputControlled } from "@/shared/components/ui/input/input-controlled";
import { Screen } from "@/shared/components/ui/screen";

const SignInView: FC<SignInViewModel> = ({ control, onSubmit, isSubmitting }) => {
  const { displayName } = useBrand();

  return (
    <Screen keyboard scroll contentClassName="justify-center gap-6 px-6 py-12">
      <Text className="text-3xl font-bold text-text">{displayName}</Text>
      <InputControlled control={control} name="email" label="E-mail" icon="mail-outline" />
      {/* ... */}
    </Screen>
  );
};

/**
 * EXPORTS
 */
export default SignInView;
```

Regras:

- Só classes do tema (`bg-background`, `text-text`, `text-muted`, `text-primary`, `text-danger`).
- Nome do app: `useBrand().displayName`. `useBrand`/`useTheme` são permitidos na View (são marca, não dados).
- **Raiz sempre `<Screen>`** (`@/shared/components/ui/screen`): fundo do tema + área segura com o
  mesmo respiro em todas as telas. Nunca `useSafeAreaInsets`/`SafeAreaView`/`KeyboardAvoidingView` na View.
  - Conteúdo que rola: `<Screen scroll>`. Formulário: `<Screen keyboard scroll>`.
  - Tela com cabeçalho fixo: `<Screen header={<AppHeader ... />} scroll>` (o header protege o topo).
  - Layout do conteúdo em `contentClassName` (gap, padding horizontal, `justify-*`).
- Formulário com `InputControlled`; lista longa com `ScrollView`/`FlatList` dentro do `Screen`.
- Comportamento por cliente: `<Feature name="...">`, nunca `if (client ...)`.
- Componente auxiliar: `const` arrow declarado antes da tela; se repetir em outra tela, extraia (skill `create-components`).

## Checklist

- [ ] Rota só compõe VM + View
- [ ] View tipada com `FC<XViewModel>`, sem hook de dados
- [ ] Padrão IMPORTS/EXPORTS, `export default` único, sem `export function`
- [ ] Só cores do tema
- [ ] Raiz `<Screen>` (área segura); conteúdo que rola com `scroll`, formulário com `keyboard`
- [ ] Rota registrada no `Stack` do `_layout` correspondente, se precisar de opção específica
- [ ] `pnpm check`, `npx tsc --noEmit`, check do tech-lead
