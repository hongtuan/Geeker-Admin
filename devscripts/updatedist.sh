#!/bin/sh
# send package to remote server
scp testDir/dist.tar.gz crv107:/data/updf
# update remote server
./devscripts/rmtupdate.sh crv107 dist.tar.gz
# clean up local package
rm -rf /data/lgwapp/gwadmin/dist
# update local package
cp -r dist /data/lgwapp/gwadmin
echo "package over."
