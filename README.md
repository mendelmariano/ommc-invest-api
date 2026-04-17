# OMMC Invest API

Uma API simples construída com Spring Boot para gerenciar investimentos, conectada a um banco de dados PostgreSQL.

## Pré-requisitos

- Java 11
- Maven
- PostgreSQL rodando localmente na porta 5432
- Banco de dados 'omm-invest' criado no PostgreSQL
- Usuário: postgres, Senha: postgres

## Como executar

1. Certifique-se de que o PostgreSQL está rodando e o banco 'omm-invest' existe.
2. Navegue até o diretório do projeto.
3. Execute: `mvn spring-boot:run`

A aplicação iniciará na porta 8080.

## Endpoints

### Users
- GET /users?page=0&size=10: Lista usuários paginados
- GET /users/{id}: Busca usuário por ID (UUID)
- POST /users: Cria um novo usuário (com validação)
- PUT /users/{id}: Atualiza usuário por ID
- DELETE /users/{id}: Deleta usuário por ID

### Categories
- GET /categories?page=0&size=10: Lista categorias paginadas
- GET /categories/{id}: Busca categoria por ID
- POST /categories: Cria uma nova categoria
- PUT /categories/{id}: Atualiza categoria por ID
- DELETE /categories/{id}: Deleta categoria por ID

### Movements
- GET /movements?page=0&size=10: Lista movimentos paginados
- GET /movements/{id}: Busca movimento por ID (UUID)
- POST /movements: Cria um novo movimento
- PUT /movements/{id}: Atualiza movimento por ID
- DELETE /movements/{id}: Deleta movimento por ID

### Patrimonies
- GET /patrimonies?page=0&size=10: Lista patrimônios paginados
- GET /patrimonies/{id}: Busca patrimônio por ID
- POST /patrimonies: Cria um novo patrimônio
- PUT /patrimonies/{id}: Atualiza patrimônio por ID
- DELETE /patrimonies/{id}: Deleta patrimônio por ID

### Profiles
- GET /profiles?page=0&size=10: Lista perfis paginados
- GET /profiles/{id}: Busca perfil por ID
- POST /profiles: Cria um novo perfil
- PUT /profiles/{id}: Atualiza perfil por ID
- DELETE /profiles/{id}: Deleta perfil por ID

### Types
- GET /types?page=0&size=10: Lista tipos paginados
- GET /types/{id}: Busca tipo por ID
- POST /types: Cria um novo tipo
- PUT /types/{id}: Atualiza tipo por ID
- DELETE /types/{id}: Deleta tipo por ID

## Estrutura Moderna

- **Entidades JPA**: Mapeadas diretamente para todas as tabelas do banco.
- **Repositórios**: JpaRepository para cada entidade.
- **DTOs com Validação**: Para entrada/saída com validações apropriadas.
- **Serviços**: Lógica de negócio separada para cada entidade.
- **Controladores REST**: Endpoints completos para CRUD com paginação.
- **Tratamento de Exceções**: GlobalExceptionHandler para validações e erros.
- **Paginação**: Suporte em todos os GET com parâmetros page e size.

## Configuração

As configurações de banco estão em `src/main/resources/application.properties`. Elas são apenas para desenvolvimento local.