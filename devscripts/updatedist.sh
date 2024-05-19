#!/bin/sh
export remoteHost=crv214
# send package to remote server
scp testDir/dist.tar.gz $remoteHost:/data/updf
# update remote server
./devscripts/rmtupdate.sh $remoteHost dist.tar.gz
# clean up local package
rm -rf /data/lgwapp/gwadmin/dist
# update local package
cp -r dist /data/lgwapp/gwadmin
echo "package over."
