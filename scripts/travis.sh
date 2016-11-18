if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  echo "linux"
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start
  sleep 3
  apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
fi

cd glacier
npm install
npm test
result=$?;
if [[$result != 0]]; then
  exit $result;
fi
cd ../

cd gluon
npm install
npm test
result=$?;
if [[$result != 0]]; then
    exit $result;
fi
cd ../
