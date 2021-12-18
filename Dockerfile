FROM node:15.13.0 as build
RUN echo "Running on node/npm verson:"
RUN node --version
RUN npm --version

ARG build_env=somevar
ENV BUILD_ENV=${build_env}
RUN echo "Building 141x-game-authorizer docker image in $build_env mode."

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm i
RUN npm run build
RUN cd server && npm i --production && cd ..

ENV NODE_ENV $build_env
ENV REACT_APP_BUILD_ENV $build_env

RUN ls -lah
RUN chmod a+x exec.sh
ENTRYPOINT ["bash", "-c", "./exec.sh"]
