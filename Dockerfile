FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 5173

CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "5173"]
