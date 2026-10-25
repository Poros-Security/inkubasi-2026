#!/bin/bash

WORKDIR=$(mktemp -d /tmp/.XXXXXXXXXX)
chown ctf:ctf "$WORKDIR"
chmod 700 "$WORKDIR"
trap 'rm -rf "$WORKDIR"' EXIT

export WORKDIR

exec su ctf -s /bin/bash -c '
while true; do
    printf "$ "
    IFS= read -r cmd || break
    [[ -z "$cmd" ]] && continue
    (cd "$WORKDIR" && eval "$cmd") 2>&1
done
'
