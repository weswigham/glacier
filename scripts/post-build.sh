#!/bin/bash

set -o errexit -o nounset

git pull

if [ "$TRAVIS_PULL_REQUEST" = "false" ]
then
  echo "Not running pages build when branch is not in a PR"
  exit 0
fi

if [ "$TRAVIS_BRANCH" != "master" ]
then
  echo "This PR was not made against master! No deploy!"
  exit 0
fi

if [ "$TRAVIS_PULL_REQUEST_BRANCH" = "" ]
then
  echo "Not running on pull, only on pull."
  exit 0
fi



rev=$(git rev-parse --short HEAD)

git init
git config user.name "Travis CI"
git config user.email "calfinz@gmail.com"

git remote add upstream "https://$GH_TOKEN@github.com/glimpseio/glacier"
git fetch upstream

git checkout $TRAVIS_PULL_REQUEST_BRANCH

msg=$(git log -1 --pretty=%B)
if [[ "$msg" =~ ^rebuild.pages.* ]]
then
  echo "Not building pages in response to a pages build commit."
  exit 0
fi

cp -R ./data/baselines/ ./docs

stats=$(git status ./docs -s)
echo $stats
if [[ ! "$stats" =~ ^$ ]]
then
  npm install handlebars
  node ./docs/template.js
  git add ./docs/baselines
  git add ./docs/index.html
  git commit -m "rebuild pages at ${rev}"
  git push -u upstream $TRAVIS_PULL_REQUEST_BRANCH
  git log -3
  git push
fi
