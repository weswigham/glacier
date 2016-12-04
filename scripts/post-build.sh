#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  echo "Not running pages build on a PR"
  exit 0
fi

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

msg=$(git log -1 --pretty=%B)
if [[ "$msg" =~ ^rebuild.pages.* ]]
then
  echo "Not building pages in response to a pages build commit."
  exit 0
fi

rev=$(git rev-parse --short HEAD)

git init
git config user.name "Travis CI"
git config user.email "calfinz@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/glimpseio/glacier"
git fetch upstream

git checkout master

cp -R ./data/baselines/ ./docs/baselines
git add ./docs/baselines

git commit -m "rebuild pages at ${rev}"
git push -u upstream master
git log -3
git push
