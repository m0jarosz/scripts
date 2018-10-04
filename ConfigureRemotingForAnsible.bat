@echo on
Powershell -command "Set-ExecutionPolicy -ExecutionPolicy Unrestricted"
Powershell.exe -command "Unblock-File -Path \\nas24\tech\ansible\ConfigureRemotingForAnsible.ps1"
Powershell.exe \\nas24\tech\ansible\ConfigureRemotingForAnsible.ps1
Powershell -command "Set-ExecutionPolicy -ExecutionPolicy Restricted"
