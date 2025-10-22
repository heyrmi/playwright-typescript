# Use base image of alpine node
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm ci
RUN npm ci

# copy all files from host to container's working directory
COPY . .

# Install Chrome browser
RUN npx playwright install

# to install all the browsers provided by playwright
CMD ["npx", "playwright", "test"]