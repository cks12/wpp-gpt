# Define the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

RUN npm install yarn

# Install dependencies
RUN yarn

# Copy the src folder
COPY src/ src/

# Build the TypeScript code
RUN yarn run

# Expose port 3000
EXPOSE 3000

# Run the app
CMD ["yarn", "start"]