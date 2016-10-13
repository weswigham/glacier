if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  sleep 3
fi

cd glacier
npm install
npm test
cd ../

cd gluon
npm install
npm test
cd ../
