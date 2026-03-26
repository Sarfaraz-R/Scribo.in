FROM python:3.10-slim

# Create user
RUN useradd -m sandboxuser

# Set working directory
WORKDIR /home/sandboxuser

# Set permissions
RUN chown -R sandboxuser:sandboxuser /home/sandboxuser

# Switch to non-root user
USER sandboxuser