#!/bin/sh
set -eu

printf '%s\n' "${FLAG:-PorosCTF{7hi5_wh013_ch411_i5_fr0m_my_bu9_b0un7y_r3p0r7_53k3145_UB_p4k3_xampp_bu47_w3b53rv3r_wkwk}}" > /flag.txt
chmod 0644 /flag.txt

exec docker-entrypoint.sh "$@"