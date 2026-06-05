import paramiko

host = "46.250.242.79"
keyfile = r"C:\Users\edmon\.ssh\vps_caddy_key"

for user in ["root", "edmon", "caddy"]:
    for passphrase in ["caddy12345", "Edm0nca12345!", None]:
        try:
            key = paramiko.RSAKey.from_private_key_file(keyfile, password=passphrase)
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(host, username=user, pkey=key, timeout=10)
            print(f"SUCCESS: user={user}, passphrase={passphrase}")
            stdin, stdout, stderr = ssh.exec_command("ls /opt/dpk/shared/templates/")
            print("Templates:", stdout.read().decode().strip()[:500])
            ssh.close()
            exit(0)
        except Exception as e:
            print(f"  Failed: user={user}, passphrase={'None' if passphrase is None else passphrase[:3]+'...'}: {str(e)[:80]}")
            continue

print("All attempts failed")
