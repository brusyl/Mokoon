@ECHO OFF

echo.Start Mokoon build

cd /d D:\Perso\Mokoon
call npm install
call npm install -g grunt-cli
call npm install socket.io-client
call grunt