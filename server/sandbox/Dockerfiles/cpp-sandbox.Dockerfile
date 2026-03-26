FROM gcc:latest
RUN useradd -m sandboxuser
WORKDIR /home/sandboxuser
# Ensure the user owns the directory BEFORE switching
RUN chown -R sandboxuser:sandboxuser /home/sandboxuser
USER sandboxuser