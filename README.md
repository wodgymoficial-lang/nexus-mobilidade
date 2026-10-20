# Relph Nexus Mobilidade

Site comercial e área administrativa para a oferta da tecnologia 21Driver pela Relph Nexus. Projeto local em Next.js (App Router), React, TypeScript, Node.js, MySQL e Prisma. Nenhuma alteração é feita nos sistemas existentes da 21Driver ou da Relph.

## Subir tudo com Docker Compose

Requisitos: Docker Engine ou Docker Desktop com Compose v2 e Git. Não é necessário instalar Node.js ou MySQL no servidor.

```sh
git clone git@github.com:wodgymoficial-lang/nexus-mobilidade.git
cd nexus-mobilidade
# Linux: gera as credenciais usando o próprio container Node.
docker run --rm --user "$(id -u):$(id -g)" --volume "$PWD:/work" --workdir /work node:24-bookworm-slim node scripts/setup-docker.mjs
docker compose --env-file .env.docker up -d --build --wait --wait-timeout 240
```

O Compose sobe três serviços, nesta ordem:

1. `mysql`: MySQL 8.4, sem porta exposta ao host, com dados no volume `nexus_mysql`.
2. `migrate`: aplica as migrações do Prisma e termina. A aplicação só inicia quando essa etapa conclui com sucesso.
3. `app`: aplicação Next.js em produção, executada sem root e com healthcheck da conexão ao banco.

No PowerShell, substitua a linha de geração das credenciais por:

```powershell
docker run --rm --volume "${PWD}:/work" --workdir /work node:24-bookworm-slim node scripts/setup-docker.mjs
```

Se já tiver Node.js no host, `node scripts/setup-docker.mjs` é equivalente e não instala dependências.

Site: http://127.0.0.1:3000. Administração: http://127.0.0.1:3000/admin. O arquivo `.admin-access.docker.local.txt` contém o primeiro acesso. As credenciais Docker são independentes das credenciais de desenvolvimento. O setup é idempotente e preserva `.env.docker` existente. Os segredos ficam fora do Git, do contexto de build e das imagens.

O Dockerfile usa estágios separados para dependências, migrações, build e runtime standalone. O build usa o lockfile do pnpm. A senha SMTP é configurada em `/admin/smtp` depois do primeiro acesso e persiste no MySQL criptografada com a chave do ambiente. Não é necessário criar um servidor de e-mail no Compose: configure seu provedor SMTP no admin.

### Operação

```sh
# Estado e logs
docker compose --env-file .env.docker ps -a
docker compose --env-file .env.docker logs -f app

# Atualizar o código, reconstruir e aplicar novas migrações
git pull --ff-only
docker compose --env-file .env.docker up -d --build --wait --wait-timeout 240

# Parar os serviços, preservando o volume do banco
docker compose --env-file .env.docker down
```

Não use `down --volumes` no ambiente com dados que deseja preservar. Faça backup do MySQL e mantenha cópia segura de `.env.docker`, especialmente `ENCRYPTION_KEY`. Não altere apenas as senhas do MySQL no arquivo depois que o volume foi inicializado: a troca deve ser aplicada também ao usuário no banco.

Se a porta 3000 estiver ocupada pelo servidor de desenvolvimento, encerre-o ou altere juntos `APP_PORT` e `APP_URL` em `.env.docker`. `APP_BIND` é `127.0.0.1` por padrão.

### Domínio e HTTPS

Defina `APP_URL` como a origem pública exata (por exemplo, `https://mobilidade.suaempresa.com.br`) e coloque um reverse proxy com HTTPS na frente da porta da aplicação. O cookie de sessão recebe `Secure` automaticamente quando `APP_URL` usa HTTPS. O endereço HTTP padrão destina-se ao uso local. O Compose não configura DNS ou certificados de um domínio.

Reexecute o comando de atualização após mudar `APP_URL`: ele é usado no build dos metadados e no runtime para validar a origem das requisições. Não passe senhas ou chaves como argumentos de build.

Para trocar a senha administrativa do Docker:

```sh
node scripts/admin-password.mjs --env-file .env.docker
docker compose --env-file .env.docker up -d --force-recreate app
```

### Validação automática

O workflow `.github/workflows/ci.yml` executa os testes unitários, valida o Compose, constrói as imagens e sobe uma instância descartável de MySQL e da aplicação. Em seguida, testa autenticação, rotas privadas e a gravação de um contato sintético no banco. Essa base é removida ao final do CI; os testes não usam credenciais do ambiente real nem enviam e-mails.

## Requisitos e execução sem Docker

- Node.js 20.9 ou superior e npm ou pnpm.
- MySQL 8 com banco e usuário próprios para este site.

```sh
npm install
npm run setup
# Configure DATABASE_URL no .env antes de usar os formulários e o admin.
npm run db:generate
npm run db:migrate
npm run dev
```

Acesse http://127.0.0.1:3000. O setup gera chaves aleatórias, um hash de senha e o arquivo local `.admin-access.local.txt` com o primeiro acesso. Não sobrescreve `.env` existente. `.env` e o arquivo de acesso não são versionados. Altere o e-mail administrativo no `.env` e use `npm run admin:password` para trocar a senha. Reinicie o servidor após alterações. A troca do hash invalida sessões anteriores.

## Banco

Exemplo de URL (substitua os valores):

```dotenv
DATABASE_URL="mysql://USUARIO:SENHA@127.0.0.1:3306/nexus_mobilidade?connect_timeout=5"
```

Codifique caracteres especiais da senha na URL. Há uma migração inicial em `prisma/migrations`. Em desenvolvimento, use `npm run db:dev` ao alterar o schema. Em produção, `npm run db:migrate` aplica apenas migrações já versionadas.

O ambiente Docker usa um banco separado, acessível internamente pelo hostname `mysql`. Para executar Next.js diretamente no host, configure `.env` com um MySQL acessível pelo host. Não use o banco de produção da 21Driver para este site.

## Administração

- `/admin/login`: autenticação.
- `/admin`: resumo e situação do banco/SMTP.
- `/admin/smtp`: host, porta, TLS, usuário, senha, remetente e destinatário; envio de teste.
- `/admin/contatos`: contatos persistidos, com paginação e situação da notificação.

As sessões usam assinatura HMAC, expiram em oito horas e ficam em cookie HttpOnly e SameSite=Strict (Secure quando `APP_URL` usa HTTPS). As APIs verificam a sessão e a origem das mutações. `APP_URL` deve coincidir com a origem acessada, inclusive protocolo e porta. Em produção, configure o endereço HTTPS real.

A senha SMTP é criptografada com AES-256-GCM antes de ser armazenada e não é enviada de volta ao cliente. Preserve `ENCRYPTION_KEY` e faça backup seguro; sua perda impede recuperar credenciais SMTP. Porta 587 usa STARTTLS obrigatório; porta 465 exige TLS direto. O teste envia uma mensagem real somente ao destinatário salvo, por ação do administrador.

Os limites contra abuso são em memória e globais por processo. Para múltiplas réplicas ou tráfego de produção, acrescente limitação compartilhada no proxy/WAF/Redis e monitoramento. A primeira versão tem um único administrador configurado no ambiente; gestão de múltiplos usuários não está incluída.

## Contatos comerciais

`POST /api/contact` valida dados com Zod, exige consentimento, verifica origem e campo honeypot, limita requisições e salva o contato no MySQL antes de tentar o envio SMTP. Sem SMTP configurado ou em caso de falha no e-mail, o contato permanece disponível no admin como pendente. Não há fila de reenvio automático nesta versão. Sem MySQL disponível, a API retorna erro e a interface não anuncia sucesso.

Não há integração com o backend operacional da 21Driver. As interfaces da home são ilustrações, identificadas como tal; demonstrações comerciais reais devem ser feitas no sistema existente. A apresentação da Vou Te Buscar usa informações fornecidas pelo responsável pelo projeto; a composição gráfica da seção é ilustrativa.

## Verificação e produção

```sh
npm run test
npm run typecheck
npm run build
npm run start
```

O site é responsivo e inclui navegação móvel, abas de produto, perguntas expansíveis, formulário comercial, política de privacidade e páginas administrativas protegidas. Fontes Manrope e DM Sans são carregadas do Google Fonts com fallback local.

Antes de publicar: configure MySQL, `APP_URL`, SMTP e credenciais administrativas reais; revise dados empresariais, aviso de privacidade e condições comerciais com o responsável. Habilite HTTPS, backups do banco e gestão das chaves do ambiente. Use um processo Node e reverse proxy próprios do ambiente de hospedagem. Este projeto foi solicitado para desenvolvimento local; não foi publicado.

## Estrutura

- `src/app`: páginas e APIs Node/Next.
- `src/components`: site e administração.
- `src/lib`: Prisma, validação, autenticação, criptografia e SMTP.
- `prisma`: schema e migrações MySQL.
- `public/images`: artes aprovadas da Nexus Mobilidade.
- `tests`: testes de autenticação, criptografia, validação e limites.
- `Dockerfile`, `compose.yaml`: imagens, inicialização, migrações e persistência.
- `.github/workflows/ci.yml`: testes unitários e integração com o Compose no GitHub Actions.

Para definir novas configurações, amplie o schema e a área administrativa existente. Não armazene credenciais no frontend.
