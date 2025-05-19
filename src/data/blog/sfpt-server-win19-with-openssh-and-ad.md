---
author: David Küng
pubDatetime: 2025-05-06T11:00:00Z
title: SFTP-Server setup (OpenSSH, Win19 Server & Active Directory-Integration)
slug: sfpt-server-win19-with-openssh-and-ad
featured: true
draft: false
tags:
  - SFTP-Server
  - Windows Server 2019
  - Active Directory
  - OpenSSH
description: How to setup an SFTP Server on WIN19 with AD-Untegration
---

# SFTP Server with OpenSSH on Windows Server and Active Directory Integration
## Overview
This guide describes how to set up an SFTP server on a Windows Server using OpenSSH, allowing users from Active Directory (AD) to log in via SFTP and access a dedicated directory. Authentication is handled via AD, while access control is managed through a local group and NTFS permissions.

## 1. Install OpenSSH Server
```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
```
Check if OpenSSH is installed:
```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
```

## 2. Configure the OpenSSH Service
Set the service to start automatically and start it:
```powershell
Get-Service -Name "sshd" | Set-Service -StartupType "Automatic" -PassThru | Start-Service -PassThru
```

## 3. Check and Enable Firewall Rule
Check the status of the firewall rule:
```powershell
Get-NetFirewallRule -Name *ssh*
```

Enable the firewall rule (for the domain profile):
```powershell
Set-NetFirewallRule -Name OpenSSH-Server-In-TCP -Enabled True -Profile Domain
```

## 4. Configure SFTP Directory and Chroot
Create the SFTP directory:
```powershell
New-Item -Path "C:\sftp" -ItemType Directory
```

Edit ```sshd_config```:
File: ```C:\ProgramData\ssh\sshd_config```
Add or adjust the following lines:
```text
ChrootDirectory "C:\sftp"
AllowGroups sftpusers
```

> Note:
> The ChrootDirectory line ensures that SFTP users are restricted to the C:\sftp directory.
> The AllowGroups sftpusers line allows only members of the sftpusers group to access SFTP.

**Restart the OpenSSH service:**
```powershell
Restart-Service sshd
```

## 5. Add Active Directory Users to the Local Group
Create the local group ```sftpusers``` **(if it does not already exist)**:
```powershell
net localgroup sftpusers /add
```

Add AD users to the local group:
```powershell
net localgroup sftpusers "DOMAIN\username" /add
```

> Replace ```DOMAIN\username``` with the actual AD username.

## 6. Set NTFS Permissions for the SFTP Directory
- Grant the ```sftpusers``` group (or the AD users) **Full Control** or the desired permissions on ```C:\sftp```.
- Remove any other users/groups that should not have access.

## 7. Test the Connection
- **SFTP Client**: e.g., FileZilla, WinSCP
- **Server**: IP address or hostname of the server
- **Port**: 22
- **Protocol**: SFTP
- **Username**: ```DOMAIN\username```
- **Password**: AD password

## Notes & Troubleshooting
- ChrootDirectory on Windows has limitations. The directory must be owned by the SYSTEM account and must not be writable by users.
  → If necessary, create a subdirectory for users, e.g., C:\sftp\home\%USERNAME%, and adjust permissions accordingly.
- Check if the service is running:
  ```powershell
  Get-Service sshd
  ```
- Check if port 22 is open:
  ```powershell
  Test-NetConnection -ComputerName <SERVER-IP> -Port 22
  ```
- If you encounter issues:
  - Check log files under C:\ProgramData\ssh\logs\
  - Use the Event Viewer


## Sources
- [Microsoft Docs: OpenSSH auf Windows](https://docs.microsoft.com/de-de/windows-server/administration/openssh/openssh_install_firstuse)
- [OpenSSH ChrootDirectory Dokumentation](https://man.openbsd.org/sshd_config#ChrootDirectory)
- [windowspro.de](https://www.windowspro.de/thomas-joos/sftp-server-windows-einrichten)