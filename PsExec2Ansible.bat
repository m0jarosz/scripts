@echo off
psexec -h -d \\192.168.1.112 cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
psexec -h -d \\192.168.0.194 cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
psexec -h -d \\192.168.49.4 cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
psexec -h -d \\192.168.1.49 cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat
psexec -h -d \\192.168.49.1 cmd.exe /c \\nas24\tech\ansible\ConfigureRemotingForAnsible.bat