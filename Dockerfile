FROM node:18-alpine

WORKDIR /app

# Install only once using cache
COPY package*.json ./
RUN npm install --silent

# Copy project files
COPY . .

EXPOSE 3000

# Run dev server efficiently
CMD ["sh","-c","npm run dev -- --host 0.0.0.0 --port 3000"]
