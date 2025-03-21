FROM node:22.12-alpine

WORKDIR /app

# Install deps
COPY package.json /app
COPY package-lock.json /app
RUN npm install --legacy-peer-deps

# Copy src
COPY components.json /app
COPY db.json /app
COPY next.config.ts /app
COPY postcss.config.mjs /app
COPY tailwind.config.ts /app
COPY tsconfig.json /app
COPY public/ /app/docs
COPY src/ /app/src

# TODO: We should do a build here
EXPOSE 3000
CMD ["npm", "run", "dev"]
