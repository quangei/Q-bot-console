@echo off
rem Q Bot Console by quangei
rem https://github.com/quangei/Q-bot-console
setlocal

node -v 2> Nul
if not "%ERRORLEVEL%" == "0" goto errNode

cd %~dp0
set ver= 1.0.0
set link= https://github.com/quangei/Q-bot-console
title Q-bot-console Installer %ver%
echo.
echo Q-bot-console Installer by quangei
echo Version: %ver%
echo Link: %link%
echo.
echo This installer installs Q-bot modules to the %~dp0.
echo Enter Y if you want to install, otherwise N.
set /p yn=[Y/N] : 
if /i "%yn%" == "Y" goto install
goto stop

:install
echo Installing Modules...
echo Pls waiting install modules, it can be long
call npm install mineflayer
call npm install mineflayer-pathfinder
call npm install mineflayer-web-inventory
call npm install mineflayer-pvp
call npm install mineflayer-armor-manager
call npm install opn
call npm install readline
call npm install readline-sync

if not "%ERRORLEVEL%" == "0" goto errInstall

:finish
echo.
echo Q Bot Console Module Installer
echo Version: %ver%
echo.
echo Installation finished
echo Run start.bat to run Q-bot-console.
echo.
echo Contact: %link%
echo.
pause
goto stop

:errNode
echo No Node.js installation detected. 
echo Please install or repair Node.js.
echo.
echo Contact: %link%
pause
goto stop

:errInstall
echo There was a problem installing diabot.
echo ERRORLEVEL: %ERRORLEVEL%
echo.
echo Contact: %link%
pause
goto stop

:stop
endlocal
exit