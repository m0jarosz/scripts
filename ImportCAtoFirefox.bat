@echo off
rem for /f "tokens=*" %%G in ('dir /b /s "%USERPROFILE%\AppData\Roaming\Mozilla\firefox\Profiles\cert*.db"') do (
for /f "tokens=*" %%G in ('dir /b /s "%USERPROFILE%\..\cert9.db"') do (
	\\dc01\NETLOGON\FirefoxTools\certutil.exe -A -n "Fortinet_CA_SSL" -i "\\dc01\NETLOGON\FirefoxTools\Fortinet_CA_SSL.cer" -t "CT,c,C" -d sql:%%~dpG
)
