FROM public.ecr.aws/docker/library/node:20.18.2

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app