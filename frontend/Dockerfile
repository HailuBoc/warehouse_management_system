FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies and source
COPY package*.json ./
COPY node_modules ./node_modules
COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
