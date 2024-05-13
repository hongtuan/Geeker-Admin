#!/bin/sh
pnpm build:pro
tar -zcf testDir/dist.tar.gz dist
echo "package over."
