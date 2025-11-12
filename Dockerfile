FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose backend port (e.g. 5000)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
