---
name: create-api-flow
description: Cria a integração de um endpoint no Movva em camadas — DTO, contrato do repositório, implementação, service, factory e hook React Query — com o fluxo de erros (AppError + toast). Use ao consumir um endpoint novo.
---

# SKILL — Integrar endpoint (camadas)

Referência viva: login — `src/modules/signin/{domain,data,factories,presentation/hooks}`.

```txt
1 DTO → 2 contrato → 3 repositório → 4 service → 5 factory → 6 hook → ViewModel
```

Antes de começar: confirme o endpoint e o formato da resposta (ex.: `curl` na API de dev).

## 1. DTO — `src/shared/interfaces/http/<recurso>/index.ts`

```ts
/**
 * IMPORTS
 */
import type { UserInterface } from "@/shared/interfaces/http/user";

interface SignInHttpParams {
  email: string;
  password: string;
}

interface SignInHttpResponse {
  access_token: string;
  user: UserInterface;
}

/**
 * EXPORTS
 */
export type { SignInHttpParams, SignInHttpResponse };
```

## 2. Contrato — `src/modules/<m>/domain/repositories/<nome>-repository-contract.ts`

```ts
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

interface ISignInRepository {
  signIn(params: SignInHttpParams): Promise<SignInHttpResponse>;
}

export type { ISignInRepository };
```

## 3. Repositório — `src/modules/<m>/data/repositories/<nome>-repository-impl.ts`

Só a chamada. Só o **caminho** (a base vem do cliente). Sem `try/catch`: o
interceptor já converte o erro em `AppError`.

```ts
import type { AxiosInstance } from "axios";
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository-contract";
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

class SignInRepositoryImpl implements ISignInRepository {
  constructor(private readonly http: AxiosInstance) {}

  async signIn(params: SignInHttpParams): Promise<SignInHttpResponse> {
    const { data } = await this.http.post<SignInHttpResponse>("/auth/sign-in", params);
    return data;
  }
}

export { SignInRepositoryImpl };
```

## 4. Service — `src/modules/<m>/domain/use-cases/<nome>.service.ts`

Regra de negócio e normalização de entrada. TypeScript puro. **Sempre relança.**

```ts
import type { ISignInRepository } from "@/modules/signin/domain/repositories/signin-repository-contract";
import { AppError, UnexpectedError } from "@/shared/domain/errors";
import type { SignInHttpParams, SignInHttpResponse } from "@/shared/interfaces/http/signin";

class AuthService {
  constructor(private readonly signInRepository: ISignInRepository) {}

  async signIn({ email, password }: SignInHttpParams): Promise<SignInHttpResponse> {
    try {
      return await this.signInRepository.signIn({ email: email.trim().toLowerCase(), password });
    } catch (error) {
      // Só sai erro de domínio daqui; relançar é o que faz a mutation saber que falhou.
      throw error instanceof AppError ? error : new UnexpectedError();
    }
  }
}

export { AuthService };
```

Não reescreva a mensagem: ela vem pronta do backend. Para reagir a um tipo
específico, use `instanceof UnauthorizedError` etc.

## 5. Factory — `src/modules/<m>/factories/make-<nome>-service.ts`

```ts
import { SignInRepositoryImpl } from "@/modules/signin/data/repositories/signin-repository-impl";
import { AuthService } from "@/modules/signin/domain/use-cases/auth.service";
import { apiClient } from "@/shared/data/infra/http/axios";

// Único lugar que liga as camadas: troque o repositório aqui (ex.: mock em teste).
const makeAuthServiceFactory = () => new AuthService(new SignInRepositoryImpl(apiClient));

export { makeAuthServiceFactory };
```

## 6. Hook — `src/modules/<m>/presentation/hooks/queries/<recurso>/use-<acao>-mutation.ts`

```ts
import { useMutation } from "@tanstack/react-query";
import { makeAuthServiceFactory } from "@/modules/signin/factories/make-auth-service";
import type { SignInHttpParams } from "@/shared/interfaces/http/signin";
import { showErrorToast } from "@/shared/utils/toast";

const authService = makeAuthServiceFactory(); // uma instância, fora do hook

const useSignInMutation = () =>
  useMutation({
    mutationKey: ["auth", "signin"],
    mutationFn: (payload: SignInHttpParams) => authService.signIn(payload),
    onError: showErrorToast,
  });

export { useSignInMutation };
```

Leitura (GET): `useQuery({ queryKey: ["orders", filtro], queryFn: () => service.list(filtro), ... })`,
com `onError` tratado no ViewModel ou via `showErrorToast` no efeito do erro.
Depois de mutation que altera uma lista: `queryClient.invalidateQueries({ queryKey: [...] })`.

## Checklist

- [ ] Endpoint e resposta confirmados na API
- [ ] Repositório usa só o caminho; sem `try/catch`, sem toast
- [ ] Service relança `AppError`; sem React/axios
- [ ] Hook com `mutationKey`/`queryKey` e `onError: showErrorToast`
- [ ] ViewModel usa `mutate(..., { onSuccess })`
- [ ] `pnpm check`, `npx tsc --noEmit`, check do tech-lead
