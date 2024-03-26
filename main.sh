export CHROMIUM_EXECUTABLE_PATH=$(whereis chromium | grep -oP '(?<=chromium: ).+') # Don't touch this!

node index.js