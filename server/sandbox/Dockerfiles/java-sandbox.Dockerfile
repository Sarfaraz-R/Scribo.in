FROM eclipse-temurin:21-jdk-alpine

RUN adduser -D sandboxuser
WORKDIR /home/sandboxuser
RUN chown -R sandboxuser:sandboxuser /home/sandboxuser

USER sandboxuser
