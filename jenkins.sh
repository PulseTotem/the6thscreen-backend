#!/usr/bin/env bash

if [ -z $1 ]
then
  echo "Give path for core-backend directory."
  exit 1
fi

if [ -z $2 ]
then
  echo "Give path for core directory."
  exit 1
fi


npm install
echo '{ "coreBackendRepoPath" : "'$1'", "coreRepoPath": "'$2'" }' > core-repos-config.json
grunt initJenkins
grunt jenkins