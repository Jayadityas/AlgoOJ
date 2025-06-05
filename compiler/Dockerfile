# Use official Node.js 22.15.0 image
FROM node:22.15.0

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies including devDependencies (nodemon)
RUN npm install

# Copy all source code into the container
COPY . .
RUN chmod -R 777 temp

# Expose port 4000
EXPOSE 4000

# Create a non-root user and switch to it for better security
RUN useradd -m appuser
USER appuser

# Run the compiler service using nodemon with 'npm run dev'
CMD ["npm", "run", "dev"]
