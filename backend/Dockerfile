# backend/Dockerfile

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install application dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app is running on port 5014, so we expose that
EXPOSE 5014

# Command to run the application
CMD ["node", "server.js"]