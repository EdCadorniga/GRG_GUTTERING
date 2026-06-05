import paramiko, io

key = paramiko.Ed25519Key.from_private_key_file(r'C:\Users\edmon\.ssh\vps_caddy_key', password='Edm0nca12345!')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('46.250.242.79', username='root', pkey=key, timeout=15)

# Read FIXED template
with open('DPK_Job_Card_Ducted_Template.html', 'r', encoding='utf-8') as f:
    template = f.read()

print(f'Fixed template: {len(template)} bytes')
print(f'Has getFromPrefill: {"getFromPrefill" in template}')

# Upload to Caddy templates
sftp = ssh.open_sftp()
sftp.putfo(io.BytesIO(template.encode('utf-8')), '/opt/dpk/shared/templates/DPK_Job_Card_Ducted_Template.html')
sftp.close()
print('Uploaded to /opt/dpk/shared/templates/')

# Verify
sin, sout, serr = ssh.exec_command('ls -la /opt/dpk/shared/templates/')
print('Templates:')
print(sout.read().decode())

ssh.close()

# Also verify via HTTP
import urllib.request
url = 'https://caddy.katwillservices.com.au/templates/DPK_Job_Card_Ducted_Template.html'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
resp = urllib.request.urlopen(req, timeout=15)
content = resp.read().decode('utf-8')
print(f'Template via HTTP: {len(content)} bytes, has getFromPrefill: {"getFromPrefill" in content}')
