import paramiko, io, json, urllib.request

key = paramiko.Ed25519Key.from_private_key_file(r'C:\Users\edmon\.ssh\vps_caddy_key', password='Edm0nca12345!')
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('46.250.242.79', username='root', pkey=key, timeout=15)

# Read fresh template
with open('DPK_Job_Card_Ducted_Template.html', 'r', encoding='utf-8') as f:
    template = f.read()

prefill_obj = {
    'job_number': 'J12618',
    'customer_name': 'Ambient - 21 Valley Way, Gymea Bay',
    'site_customer_name': 'Ambient - 21 Valley Way, Gymea Bay',
    'site_contact_name': 'Jimmy',
    'site_customer_phone_number': '',
    'job_address': '21 Valley Way Gymea Bay 2227',
    'job_type': 'Builder/Commercial Ducted Installation',
    'sales_rep': 'Dane Kennedy',
}
prefill_json = json.dumps(prefill_obj)

marker = "const urlParams = new URLSearchParams(window.location.search);"
embedded = 'const urlParams = new URLSearchParams(window.__DPK_PREFILL_QUERY__ && typeof window.__DPK_PREFILL_QUERY__ === "string" ? window.__DPK_PREFILL_QUERY__ : window.location.search);'
out = template.replace(marker, embedded)

# Inject prefill BEFORE the first </head>
# Find the FIRST </head> and inject before it
first_head_end = out.find('</head>')
inject = f'<script>window.__DPK_PREFILL_QUERY__ = {prefill_json};</script>'
out = out[:first_head_end] + inject + '\n</head>' + out[first_head_end + len('</head>'):]

print(f'Output: {len(out)} bytes')
print(f'Before upload occurrences: {out.count("window.__DPK_PREFILL_QUERY__")}')

# Upload
sftp = ssh.open_sftp()
sftp.putfo(io.BytesIO(out.encode('utf-8')), '/opt/dpk/shared/cards/J12618/index.html')
sftp.close()
print('Uploaded')

ssh.close()

# Verify via HTTP
req = urllib.request.Request('https://caddy.katwillservices.com.au/cards/J12618/index.html',
    headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
resp = urllib.request.urlopen(req, timeout=15)
content = resp.read().decode('utf-8')
print(f'HTTP {resp.status}, {len(content)} bytes')
print(f'Occurrences: {content.count("window.__DPK_PREFILL_QUERY__")}')

u 