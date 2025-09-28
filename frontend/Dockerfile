# frontend/Dockerfile

# --- Build Stage ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

# Copy the static files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the NGINX configuration
# Note: We will handle this on the server with docker-compose instead.
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# We don't need an entrypoint if Nginx is configured directly
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]