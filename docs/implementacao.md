 # Implementação

Esta secção detalha a arquitetura e as principais decisões técnicas que nortearam a implementação do projeto SmartHive. O objetivo é fornecer uma visão clara sobre a estrutura do código, as tecnologias utilizadas e os padrões adotados para garantir um sistema robusto, escalável e de fácil manutenção.

## Estrutura de Ficheiros e Roteamento

A organização do código-fonte foi pensada para promover a modularidade e a clareza. A estrutura de pastas principal, dentro de `src/`, separa as responsabilidades da aplicação de forma lógica:

-   **`components/`**: Contém componentes React reutilizáveis, organizados por funcionalidade (ex: `auth`, `systemsManagement`).
-   **`pages/`**: Agrupa as páginas da aplicação, que são os componentes de mais alto nível renderizados para cada rota.
-   **`layouts/`**: Define a estrutura visual comum para diferentes secções da aplicação (ex: `AdminLayout`, `ClientLayout`).
-   **`guards/`**: Implementa a lógica de proteção de rotas, garantindo que apenas utilizadores autorizados acedam a determinadas áreas.
-   **`hooks/`**: Centraliza a lógica de comunicação com a API e gestão de estado, utilizando `react-query`.
-   **`services/`**: Contém a configuração de clientes de serviços externos, como o Supabase.
-   **`edge-functions-triggers/`**: Funções que servem como gatilho no frontend para as Edge Functions da Supabase.
-   **`supabase/functions/`**: Contém o código das Edge Functions que correm no servidor.

Uma das características centrais da arquitetura de frontend é a forma como as rotas são declaradas e protegidas. Em vez de uma lista única e extensa de rotas, a aplicação utiliza uma abordagem de **grupos de páginas**, definida no ficheiro `src/main.tsx`. Cada grupo de rotas é envolvido por um componente de alto nível (`page-group`) que, por sua vez, aplica a lógica de autorização necessária.

Por exemplo, o grupo `AdminGroup` é responsável por todas as rotas da área de administração. Este componente verifica se o utilizador tem a permissão de 'Admin' antes de renderizar qualquer uma das suas rotas filhas, que por sua vez são envolvidas por um `Layout` específico.

**Exemplo de declaração de rotas em `src/main.tsx`:**
```typescript
// ...
{
  Component: AdminGroup,
  children: [
    {
      path: '/Admin',
      Component: AdminLayout,
      children: [
        {
          path: '/Admin/Dashboard',
          Component: AdminDashboard
        },
        // ... outras rotas de admin
      ]
    },
  ]
},
{
  Component: ClientGroup,
  children: [
    // ... rotas do cliente
  ]
}
// ...
```
Esta abordagem simplifica a gestão de permissões e layouts, tornando o ficheiro de rotas mais limpo e declarativo.

## Guards de Autenticação e Autorização

Os *Guards* são um pilar fundamental da segurança da aplicação. São componentes de ordem superior (Higher-Order Components) que envolvem rotas ou grupos de rotas para controlar o acesso.

1.  **`AuthGuard`**: É o guarda mais básico. Verifica se existe um utilizador autenticado. Caso contrário, redireciona para a página de login, guardando a URL de origem para que o utilizador seja redirecionado para a página pretendida após a autenticação.

2.  **`AdminGuard` e `ClientGuard`**: Estes são guardas de autorização. Utilizam hooks customizados (`useIsAdminHook` e `useIsClientHook`) que, por sua vez, consultam a base de dados para verificar se o utilizador autenticado possui a `role` necessária ('Admin' ou 'Client'). Se a verificação falhar, o utilizador é redirecionado para uma página de 'acesso não autorizado'.

**Exemplo de implementação do `AdminGuard` em `src/guards/AdminGuard.tsx`:**
```typescript
// ...
const AdminGuard = ({ children }: AdminGuardProps) => {
  const { data: isAdmin, isLoading } = useIsAdminHook();

  if (isLoading) {
    return <SmartHiveLoadingSplash/>; 
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized-role" />; 
  }

  return <>{children}</>;
};

export default AdminGuard;
```

## Componentes de UI Reutilizáveis: O Exemplo dos Botões

Para manter a consistência visual e acelerar o desenvolvimento, a aplicação utiliza um conjunto de componentes de UI customizados. Os botões são um excelente exemplo desta prática. Em vez de repetir estilos TailwindCSS ou propriedades de componentes de bibliotecas como o Material-UI, foram criados botões genéricos como `SmartHivePrimaryBtn` e `SmartHiveDangerBtn`.

Estes componentes recebem `props` como `text`, `icon`, e `onClick`, encapsulando toda a lógica de estilização e comportamento. Isto traz várias vantagens:
-   **Consistência**: Todos os botões primários da aplicação têm a mesma aparência e comportamento.
-   **Manutenção**: Uma alteração no design do botão precisa de ser feita num único ficheiro.
-   **Produtividade**: Os programadores podem focar-se na lógica da aplicação em vez de se preocuparem com a estilização de cada botão.

**Exemplo do `SmartHivePrimaryBtn` em `src/components/utils/btns/SmartHivePrimaryBtn.tsx`:**
```typescript
// ...
const SmartHivePrimaryBtn: React.FC<SmartHivePrimaryBtnProps> = ({
  text,
  icon,
  onClick,
  // ... outras props
}) => {
  return (
    <button
      // ...
      className={`
        flex items-center justify-center gap-2
        bg-[#36916a] text-white px-4 py-2 rounded-full
        hover:bg-[#355c4c]  transition duration-200 ease-in-out
        hover:scale-[1.03] shadow-md hover:shadow-lg
      `}
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};
// ...
```

## Estruturas de Chamadas à API

A comunicação com o backend (Supabase) é gerida de forma centralizada e eficiente através de custom hooks e da biblioteca `react-query`.

### Hooks Customizados com `react-query`

Toda a lógica de `fetch`, `caching`, `revalidation` e `mutation` de dados é abstraída em hooks customizados, localizados em `src/hooks`. Cada ficheiro de hook agrupa as chamadas relacionadas a uma entidade específica (ex: `CostumerRecordsHooks.tsx`, `SystemsHooks.tsx`).

Esta abordagem oferece:
-   **Gestão de Estado do Servidor Simplificada**: `react-query` trata automaticamente do `loading`, `error`, e `data states`.
-   **Caching Inteligente**: Reduz o número de chamadas desnecessárias à API, melhorando a performance.
-   **Invalidação de Queries**: Após uma mutação (criar, atualizar, apagar), os hooks invalidam as queries em cache relevantes, garantindo que a UI reflete sempre os dados mais recentes.

**Exemplo de um hook de mutação em `src/hooks/CostumerRecordsHooks.tsx`:**
```typescript
// ...
export const usePostCostumerRecordHook = () => {
  const notifications = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: postCostumerRecord, // A função que faz a chamada à API
      onSuccess: () => {
        // Mostra uma notificação de sucesso
        notifications.show('Customer record created successfully!', {
          severity: 'success',
        });
        // Invalida a cache para que a lista de clientes seja atualizada
        queryClient.invalidateQueries({ queryKey: ["getCostumerRecords"] });
      },
      onError: (error: Error) => {
        // Mostra uma notificação de erro
      },
  });
};
// ...
```

### Triggers de Edge Functions

Para operações mais complexas ou sensíveis que devem ser executadas no lado do servidor (como interações com a API do Stripe), a aplicação utiliza as *Edge Functions* da Supabase. A invocação destas funções a partir do frontend é feita através de funções-gatilho, localizadas em `src/edge-functions-triggers`.

Estas funções-gatilho são essencialmente chamadas `fetch` assíncronas que enviam os dados necessários para a Edge Function correspondente e tratam da resposta.

**Exemplo de um gatilho em `src/edge-functions-triggers/create_stripe_product_trigger.ts`:**
```typescript
export const createStripeProduct = async (/* ... parâmetros ... */) => {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/create_stripe_product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    },
     body: JSON.stringify({
      // ... dados a enviar
    })
  });
  // ... tratamento da resposta
};
```

## Supabase Edge Functions

As Edge Functions são funções TypeScript server-side, baseadas em Deno, que correm na infraestrutura global da Supabase. Neste projeto, são utilizadas para orquestrar a lógica de negócio que envolve serviços de terceiros (Stripe) e interações seguras com a base de dados, que não deveriam ser expostas no cliente.

A função `create_stripe_product`, por exemplo, localizada em `supabase/functions/create_stripe_product/index.ts`, é responsável por:
1.  Receber os detalhes de um novo sistema a partir do frontend.
2.  Criar os produtos e preços correspondentes na plataforma Stripe.
3.  Guardar os IDs gerados pelo Stripe na base de dados da Supabase.
4.  Implementar lógica de *rollback* para garantir a consistência dos dados em caso de falha.

### Deploy de Edge Functions

O processo de deploy de Edge Functions para o projeto cloud da Supabase é gerido através da Supabase CLI. Os passos essenciais são:

1.  **Instalar a Supabase CLI**: Se ainda não estiver instalada na máquina de desenvolvimento.
2.  **Login**: Autenticar na sua conta Supabase via terminal com `supabase login`.
3.  **Ligar o Projeto**: Associar o diretório local ao projeto Supabase remoto com `supabase link --project-ref <ID_DO_PROJETO>`.
4.  **Fazer o Deploy**: Executar o comando de deploy. Pode-se fazer o deploy de todas as funções de uma vez ou de uma função específica.

**Comando para fazer o deploy de todas as funções:**
```bash
supabase functions deploy
```

É também crucial gerir as variáveis de ambiente (como as chaves de API do Stripe) de forma segura, utilizando os *secrets* da Supabase, que podem ser configurados tanto localmente (`.env.local`) como em produção (`supabase secrets set`).

Esta abordagem de separar a lógica de negócio sensível em Edge Functions garante uma maior segurança e controlo sobre as operações críticas do sistema.