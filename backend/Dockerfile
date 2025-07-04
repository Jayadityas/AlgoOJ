# Use official Node.js 22.15.0 image
FROM node:22.15.0

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY backend/package*.json ./

# Install all dependencies including devDependencies (nodemon)
RUN npm install

# Copy all source code into the container
COPY backend/. ./  

COPY testcases ./testcases
# Expose port 3000
EXPOSE 3000
RUN apt-get update && apt-get install -y time
# Create a non-root user and switch to it for better security
RUN mkdir -p temp && chmod -R 777 temp
RUN useradd -m appuser
RUN chown -R appuser:appuser /usr/src/app
USER appuser

# Run the compiler service using nodemon with 'npm run dev'
CMD ["npm", "run", "dev"]
