#!/bin/sh
set -e
CA=/app/docker/certs/rootCA.pem
if [ -f "$CA" ]; then
  mkdir -p "$HOME/.pki/nssdb"
  [ -f "$HOME/.pki/nssdb/cert9.db" ] || certutil -d "sql:$HOME/.pki/nssdb" -N --empty-password
  certutil -d "sql:$HOME/.pki/nssdb" -D -n mkcert-local 2>/dev/null || true
  certutil -d "sql:$HOME/.pki/nssdb" -A -t "C,," -n mkcert-local -i "$CA"
fi
exec "$@"
