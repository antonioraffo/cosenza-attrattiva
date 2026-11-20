# Playwright + certutil: la CA mkcert viene registrata nell'NSS di Chromium,
# così i test verificano davvero il certificato di https://cosenzaattrattiva.test.
FROM mcr.microsoft.com/playwright:v1.65.1-noble
RUN apt-get update \
 && apt-get install -y --no-install-recommends libnss3-tools \
 && rm -rf /var/lib/apt/lists/*
COPY docker/e2e/entrypoint.sh /usr/local/bin/e2e-entrypoint
RUN chmod +x /usr/local/bin/e2e-entrypoint
ENTRYPOINT ["e2e-entrypoint"]
