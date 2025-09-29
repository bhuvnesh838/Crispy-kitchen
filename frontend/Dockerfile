# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json from the 'frontend' directory
# This is the corrected path!
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code from the 'frontend' directory
# This is also a corrected path!
COPY frontend/ ./

# Create the optimized production build
RUN npm run build


# Stage 2: Serve the application from a lightweight Nginx server
FROM nginx:stable-alpine

# Copy the built files from the 'builder' stage to Nginx's web server directory
COPY --from=builder /app/build /usr/share/nginx/html

# Tell Docker that the container listens on port 80
EXPOSE 80

# The command to start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
