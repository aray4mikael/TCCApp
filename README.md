# TCC Monitor - Sistema de Monitoramento

Sistema de monitoramento desenvolvido como Trabalho de Conclusão de Curso (TCC), utilizando Next.js e Firebase para gerenciamento de dados em tempo real.

## Sobre o Projeto

O TCC Monitor é uma aplicação web desenvolvida para monitoramento em tempo real, integrando com dispositivos ESP32 através do Firebase. O sistema permite:

- Monitoramento em tempo real de dados
- Autenticação de usuários
- Armazenamento seguro de dados
- Interface responsiva e moderna

## Tecnologias Utilizadas

- **Frontend**: Next.js
- **Backend**: Firebase
  - Authentication
  - Firestore
  - Realtime Database
- **Dispositivos**: ESP32

## Configuração do Ambiente

1. Clone o repositório

   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   ```

2. Instale as dependências

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente

   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
     NEXT_PUBLIC_FIREBASE_DATABASE_URL=seu_database_url
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
     ```

4. Inicie o servidor de desenvolvimento
   ```bash
   npm run dev
   ```

## Estrutura do Projeto

- `/app` - Diretório principal da aplicação
  - `/firebase` - Configuração e serviços do Firebase
  - `/components` - Componentes reutilizáveis
  - `/pages` - Páginas da aplicação

## Segurança

- Credenciais do Firebase são armazenadas em variáveis de ambiente
- Autenticação implementada para controle de acesso
- Dados sensíveis protegidos através de regras de segurança do Firebase

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença [MIT](LICENSE).

## Contato

Para mais informações sobre o projeto, entre em contato através de [SEU_EMAIL].
