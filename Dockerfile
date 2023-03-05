###########################**DEPENDENCIES**#########################
# Install dependency only when needed
FROM node:14-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install


#######################**BUILDER**##################################
# build stage for kmag
FROM node:14-alpine AS builder

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build && npm install --production --ignore-scripts --prefer-offline
# COPY ./.next ./.next


#######################**RUNNER**###################################
FROM node:14-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY --from=builder /app ./

# Expose port
EXPOSE 3000
# Start the app
CMD [ "npm", "start" ]