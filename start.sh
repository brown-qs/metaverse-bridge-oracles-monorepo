#! /bin/bash
set -e

if [ -z "$1" ]
then
    APP=minecraft-oracle-api
else
    APP=$1
fi

cd packages/$APP

exec rushx start
