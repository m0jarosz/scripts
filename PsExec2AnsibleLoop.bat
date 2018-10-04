@echo off
for /L %%n in (1,1,255) do start psexec -h -d \\192.168.1.%%n cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
for /L %%n in (1,1,255) do start psexec -h -d \\192.168.0.%%n cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
for /L %%n in (1,49,255) do start psexec -h -d \\192.168.49.%%n cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
