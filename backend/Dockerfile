FROM node:18-alpine

WORKDIR /app

# Copy dependencies and source
COPY package*.json ./
COPY node_modules ./node_modules
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
