# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the 'backend' directory
# This is the corrected path!
COPY backend/package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your backend source code from the 'backend' directory
# This is also a corrected path!
COPY backend/. .

# Expose the port your server runs on (e.g., 5000)
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]
