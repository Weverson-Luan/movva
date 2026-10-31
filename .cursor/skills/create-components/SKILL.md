---
name: create-components
description: Cria um componente reutilizável do Movva com NativeWind + tailwind-variants, props tipadas e só cores do tema (white label). Use ao criar ou extrair um componente de UI.
---

<!-- GERADO por scripts/sync-ai.mjs a partir de .claude/skills/create-components/SKILL.md. Edite a fonte e rode: pnpm ai:sync -->

# SKILL — Criar componente

Referência viva: `src/shared/components/ui/input/`.

## Onde

- Usado por 2+ módulos → `src/shared/components/ui/<componente>/`
- Só um módulo → `src/modules/<m>/components/<componente>/`

## Estrutura

```txt
<componente>/
├── index.tsx                    componente (export nomeado)
├── interface.ts                 props
├── <componente>.variants.ts     estilos (tv)
└── <componente>-controlled.tsx  opcional: ligado ao react-hook-form
```

## interface.ts

```ts
/**
 * IMPORTS
 */
import type { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { TextInputProps } from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  error?: string;
  isDisabled?: boolean;
};

/**
 * EXPORTS
 */
export type { InputProps };
```

Estenda as props do componente nativo quando fizer sentido.

## <componente>.variants.ts

Uma propriedade por estado visual — evita duas classes de borda/cor ao mesmo tempo.

```ts
/**
 * IMPORTS
 */
import { tv } from "tailwind-variants";

// Só cores do tema do cliente (tailwind.config.js), nunca cores fixas.
const inputVariants = tv({
  slots: {
    container: "w-full gap-1",
    wrapper: "flex-row items-center gap-3 border-b pb-2",
    input: "flex-1 bg-transparent py-1 text-base text-text",
    error: "text-sm text-danger",
  },
  variants: {
    state: {
      default: { wrapper: "border-muted/40" },
      focused: { wrapper: "border-primary" },
      error: { wrapper: "border-danger" },
    },
    isDisabled: { true: { container: "opacity-50" } },
  },
  defaultVariants: { state: "default", isDisabled: false },
});

/**
 * EXPORTS
 */
export { inputVariants };
```

## index.tsx

```tsx
/**
 * IMPORTS
 */
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useTheme } from "@/shared/brand/BrandProvider";
import type { InputProps } from "./interface";
import { inputVariants } from "./input.variants";

const Input = ({ label, icon, error, isDisabled = false, ...textInputProps }: InputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const state = error ? "error" : isFocused ? "focused" : "default";
  const styles = inputVariants({ state, isDisabled });

  return (
    <View className={styles.container()}>
      {/* ícone recebe cor por prop: useTheme(), não className */}
      {icon && <Ionicons name={icon} size={20} color={state === "error" ? theme.danger : theme.muted} />}
      <TextInput className={styles.input()} placeholderTextColor={theme.muted} {...textInputProps} />
      {error && <Text className={styles.error()}>{error}</Text>}
    </View>
  );
};

/**
 * EXPORTS
 */
export { Input };
```

## Versão controlada (react-hook-form)

```tsx
const InputControlled = <T extends FieldValues>({ control, name, ...inputProps }: InputControlledProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
      <Input {...inputProps} value={value} onChangeText={onChange} onBlur={onBlur} error={error?.message} />
    )}
  />
);
```

## Regras

- Sem dados, React Query, navegação ou regra de negócio — só props.
- `className` + `tv`; sem `StyleSheet.create`; sem cor fixa nem paleta padrão do Tailwind.
- Componente: export **nomeado** (`export { Input }`). Tela: export default.
- Botão de ícone: `accessibilityRole`, `accessibilityLabel`, `hitSlop`.
- API de uma plataforma só → arquivo `.android.ts` / `.ios.ts`.

## Checklist

- [ ] Pasta certa (`shared` × módulo)
- [ ] Props em `interface.ts`
- [ ] Estados visuais em `tv()` sem classes concorrentes
- [ ] Testado mentalmente com dois clientes de cores diferentes
- [ ] `pnpm check`, `npx tsc --noEmit`, check do tech-lead
