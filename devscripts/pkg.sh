#!/bin/sh
pnpm build:pro
tar -zcf testDir/dist.tar.gz dist
# copy to tsm/testData for pkg
cp -f testDir/dist.tar.gz ../tsm/testData
echo "package over."
