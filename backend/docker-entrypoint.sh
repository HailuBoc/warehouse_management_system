#!/bin/sh
set -e
prisma migrate deploy
node dist/scripts/seed.js
exec node dist/index.js
