FROM node:18 AS BUILD

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /tmp

RUN corepack enable

# Install pnpm
# RUN npm install -g pnpm && mkdir -p /usr/.pnpm-store

# Copy package.json and pnpm-lock.yaml and install dependencies
COPY ./package.json ./pnpm-lock.yaml ./

# Install dependencies with or without cache based on the USE_BUILDKIT environment variable
RUN pnpm install

# Copy Prisma schema and generate Prisma client
COPY ./prisma ./prisma/
RUN pnpm prisma generate

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# ---------------------------------------------------------

FROM node:18 AS RUNTIME

RUN addgroup --system application_users && \
    adduser --system --ingroup application_users application_user && \
    mkdir /usr/bin/application && \
    chown -R application_user:application_users /usr/bin/application && \
    chmod -R 777 /usr/bin/application

WORKDIR /usr/bin/application

COPY --from=BUILD /tmp/node_modules /usr/bin/application/node_modules
COPY --from=BUILD /tmp/dist/src /usr/bin/application/bin
COPY --from=BUILD /tmp/package.json /usr/bin/application/package.json

RUN chmod -R 777 /usr/bin/application/bin

USER application_user

# Set the NODE_ENV to production as a default
ENV NODE_ENV production

EXPOSE 80
EXPOSE 443

CMD ["node", "/usr/bin/application/bin/main.js"]