# Use the official Node.js image as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install dependencies first for better caching
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose port 3000 to access the application
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]



# Use the official Node.js image as a base image
# Use the official Node.js image as a base image for the build stage
# Stage 1: Build the Next.js app
# FROM node:18-alpine AS builder

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock) to install dependencies
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Build the Next.js app for production
# RUN npm run build

# # Stage 2: Serve the Next.js app
# FROM node:18-alpine

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the built app from the previous stage
# COPY --from=builder /app ./

# # Install only production dependencies
# RUN npm install --production

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the Next.js app
# CMD ["npm", "start"]


# # Stage 1: Build the Next.js app
# FROM node:18-alpine AS builder

# # Install gcompat for glibc compatibility (needed for SWC)
# RUN apk add --no-cache gcompat

# # Set the working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json (or yarn.lock) to install dependencies
# COPY package*.json ./
# RUN npm cache clean --force && rm -rf package-lock.json


# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Build the Next.js app for production
# RUN npm run build:dev

# # Stage 2: Serve the Next.js app
# FROM node:18-alpine

# # Install gcompat for glibc compatibility (needed for SWC during runtime)
# RUN apk add --no-cache gcompat

# # Set the working directory inside the container
# WORKDIR /app

# # Copy the built app from the previous stage
# COPY --from=builder /app ./

# # Install only production dependencies
# RUN npm install --production

# # Expose the port the app runs on
# EXPOSE 3000

# # Start the Next.js app
# CMD ["npm", "start"]
