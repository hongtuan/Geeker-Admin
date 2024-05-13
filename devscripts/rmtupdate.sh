#!/bin/sh
# nice shell script for deploying gwapp
# set env for heredoc script
export work_path=/data/updf
export gwadmin_path=/data/lgwapp/gwadmin
export page_path=dist
export gwadminsrv=gwadmin
# run remote script
ssh -Tq $1 2>&1 << remoteTask
  # 同步远程服务器时间
  cd $work_path
  rm -rf $page_path
  tar xzf $2
  ls -lh $page_path
  chown root:root $page_path -R
  ls -lh $page_path
  systemctl stop $gwadminsrv
  rm -rf $gwadmin_path/$page_path
  cp -r $page_path $gwadmin_path
  systemctl start $gwadminsrv
  ls -lh $gwadmin_path/$page_path
  echo "$gwadminsrv page update over."
remoteTask
