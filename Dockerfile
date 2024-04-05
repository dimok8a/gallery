# Используем официальный образ Node.js
FROM node:latest

# Установка рабочей директории внутри контейнера
WORKDIR /app

# Копирование зависимостей для backend
COPY package*.json ./

# Установка зависимостей для backend
RUN npm install

# Копирование backend в контейнер
COPY . .

#RUN npm run client:install
# Сборка frontend
#RUN npm run client:install && npm run client:build


# Запуск backend
CMD ["node", "index.js"]
