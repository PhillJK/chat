# Как запустить:

### Сервер

1. `npm install`
2. создаем файл `.env` и добавляем туда переменные среды указанные в `.env.example`
3. `npm run prisma:migrate` и `npm run prisma:generate`
4. `npm run dev`

### Клиент

1. `npm install`
2. создаем файл  `.env` и добавляем в файл переменную среды `VITE_SERVER_URL=<Back-server-url>`
3. `npm run dev`
