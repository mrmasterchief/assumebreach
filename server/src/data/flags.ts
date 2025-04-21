export const flags = [
        {
        "id": 1,
        "title": "Insecure Public API Endpoint Flag",
        "description": "You have found an API Endpoint that shouldn't be accessible publicly. This is a security risk and should be fixed.",
        "hint" : "Look for an API endpoint that is being called in the network tab.",
        "secureCodeID": 1,
        "securityCategory": "Enumeration",
        "difficulty": "Easy",
        "flag": "CTF{3ndp0int5_4r3_c00l}",
        "youtubeExplainer": "tGv7CUutzqU",
        "active": true
        },
        {
        "id": 2,
        "title": "Publicly Accessible Environment Variable Flag",
        "description": "You have found an environment variable that shouldn't be accessible publicly. This could result in someone gaining access to our API's which could be a security risk.",
        "hint" : "Look for network requests that are being made to the server.",
        "secureCodeID": 2,
        "securityCategory": "Environment Variable",
        "difficulty": "Easy",
        "flag": "CTF{3nv_v4r14bl3s_4r3_1mp0rt4nt}",
        "youtubeExplainer": "WoTaqZW13bY",
        "active": true
        },
        {
        "id": 3,
        "title": "Hidden Page Flag",
        "description": "You have found a hidden page using a tool like Go Buster or looked up common directories. This page shouldn't be accessible to the public and could contain sensitive information.",
        "hint" : "Try finding a hidden page using a tool like Go Buster or by looking up common directories. Source can be found in the secure code.",
        "secureCodeID": 3,
        "securityCategory": "Enumeration",
        "difficulty": "Medium",
        "flag": "CTF{h1dd3n_p4g3s_4r3_c00l}",
        "youtubeExplainer": "tGv7CUutzqU",
        "active": true
        },
        {
        "id": 4,
        "title": "SQL Injection Flag",
        "description": "You have found a SQL Injection vulnerability in the login form. This could allow an attacker to bypass the login form and gain access to the application.",
        "hint" : "Try entering a SQL Injection payload in the login form.",
        "secureCodeID": 4,
        "securityCategory": "SQL Injection",
        "difficulty": "Easy",
        "flag": "CTF{5ql_1nj3ct10n5_4r3_d4ng3r0u5}",
        "youtubeExplainer": "",
        "active": true
        },
        {   
        "id": 5,
        "title": "Cross Site Scripting Flag",
        "description": "You have found a Cross Site Scripting (XSS) vulnerability in the address bar. This could allow an attacker to execute malicious scripts in the browser.",
        "hint" : "Try entering a XSS payload in the address bar where a query parameter is present.",  
        "secureCodeID": 5,
        "securityCategory": "XSS",
        "difficulty": "Easy",
        "flag": "CTF{X55_15_4w350m3}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 6,
        "title": "Broken Access Control Flag",
        "description": "You have accessed an api route that you shouldn't have access to. This could allow an attacker to access sensitive information or perform actions that they shouldn't be able to.",
        "hint" : "Try accessing a page that you shouldn't have access to by changing the request parameters.",
        "secureCodeID": 6,
        "securityCategory": "Broken Access Control",
        "difficulty": "Hard",
        "flag": "CTF{br0k3n_4cc355_c0ntr0l}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 7,
        "title": "Use of Unsafe Hash Algorithm Flag",
        "description": "You have found a use of an unsafe hash algorithm in the password hashing function. This allows you to use a rainbow table to crack the password hash.",
        "hint" : "Try using a rainbow table to crack the password hash.",
        "secureCodeID": 7,
        "securityCategory": "Insecure API",
        "difficulty": "Medium",
        "flag": "CTF{r41nb0w_t4bl3_4r3_c00l}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 8,
        "title": "Open Source Intelligence Flag",
        "description": "You have managed to reset the account password of an admin account using Open Source Intelligence (OSINT) techniques.",
        "hint" : "Look for a unique e-mail address that you have found in an earlier flag. Find information about that user on LinkedIn or other social media platforms to answer the security question and reset the password.",
        "secureCodeID": 8,
        "securityCategory": "OSINT",
        "difficulty": "Hard",
        "flag": "CTF{0p3n_50urc3_1nt3ll1g3nc3}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 9,
        "title": "IDOR Flag on orders",
        "description": "You have found an Insecure Direct Object Reference (IDOR) vulnerability in the orders. This could allow an attacker to access other users orders.",
        "hint" : "Try changing the user ID in the request header to another orderID using a proxy tool or just the url bar.",
        "secureCodeID": 9,
        "securityCategory": "IDOR",
        "difficulty": "Medium",
        "flag": "CTF{1d0r_1n_0rd3r5_4r3_b4d_pr4ct1c3}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 10,
        "title": "Steganography Flag",
        "description": "You have found a steganography flag hidden in an image. This is not a vulnerability but a fun way to hide information.",
        "hint" : "Try using a steganography decoder to find the flag. You need a decryption key to decrypt the image. You can find the decryption key by finding another flag.",
        "secureCodeID": 10,
        "securityCategory": "Steganography",
        "difficulty": "Hard",
        "flag": "CTF{57394n09r4phy_15_c001}",
        "youtubeExplainer": "",
        "active": true
        },
        {
        "id": 11,
        "title": "Shopping Cart IDOR Flag",
        "description": "You have found an Insecure Direct Object Reference (IDOR) vulnerability in the shopping cart.",
        "hint" : "Try using a proxy tool to view the requests being made when using the shopping cart.",
        "secureCodeID": 11,
        "securityCategory": "IDOR",
        "difficulty": "Medium",
        "flag": "CTF{1d0r_1n_sh0pp1ng_c4rt5_4r3_b4d_pr4ct1c3}",
        "youtubeExplainer": "",
        "active": true
        }


    ]
