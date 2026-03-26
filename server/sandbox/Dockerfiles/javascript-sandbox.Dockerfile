FROM node:20-alpine

RUN adduser -D sandboxuser
WORKDIR /home/sandboxuser
RUN chown -R sandboxuser:sandboxuser /home/sandboxuser

USER sandboxuser
