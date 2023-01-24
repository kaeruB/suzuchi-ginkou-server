FROM node:16
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN npm install # remove this and use the code below
#RUN if [ "$NODE_ENV" = "development" ]; \
#      then npm install; \
#      else npm install --only=production; \
#      fi

COPY . ./
ENV PORT 3005
EXPOSE $PORT
# it doesnt matter whats the CMD because it will be overriten in docker-compose files (command option)
CMD ["node", "src/index.ts"]