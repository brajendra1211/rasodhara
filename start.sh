#!/bin/bash
# Raises the virtual-memory ulimit before starting the server. Prisma's WASM
# query engine (used via @prisma/adapter-mariadb) needs a large contiguous
# virtual address space reservation; the host's default 8GB ulimit -v is too
# tight for it and causes intermittent "Cannot allocate Wasm memory" crashes
# under load. This only affects this app's own process, not the shared PM2
# daemon or any other app on the host.
ulimit -v unlimited
exec node server.js
