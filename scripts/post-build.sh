#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd stage/_book

git init
git config user.name "Zach Calfin"
git config user.email "calfinz@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/glimpseio/glacier"
git fetch upstream

git checkout master

git add ../docs/baselines
git commit -m "rebuild pages at ${rev}"
git push
