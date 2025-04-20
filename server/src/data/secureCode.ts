export const secureCode = [
    {
        id: 1,
        title: 'Insecure API',
        risks: [
            'Sensitive data exposure',
            'Unauthorized access',
            'Data manipulation',
        ],
        explanation: 'To prevent users from accessing API endpoints that are not intended for them, you can implement several security measures. The most common method is CORS (Cross-Origin Resource Sharing), which restricts which domains can access your API. RBAC (Role-Based Access Control) is also an option that will be described on a different page. In this example we will use CORS to restrict access to the API and JWT (JSON Web Tokens) to authenticate users and authorize them to access certain endpoints.',
        js: `
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const corsOptions = {
    origin: 'https://your-client-domain.com',
    credentials: true,
};
app.use(cors(corsOptions));

// Example route
app.get('/api/secure-endpoint', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
// DO NOT PUT YOUR SECRET KEY IN THE CODE. PUT IT IN A .ENV FILE
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json({ message: 'This is a secure endpoint' });
    });
});
app.listen(4000, () => {
    console.log('Server is running on port 3000');
});`,
        php: `
<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

header("Access-Control-Allow-Origin: https://your-client-domain.com");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$jwt = $matches[1];
$secretKey = $_ENV['JWT_SECRET'];

try {
    $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));

    echo json_encode([
        'message' => 'This is a secure endpoint',
        'user' => $decoded,
    ]);
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden', 'message' => $e->getMessage()]);
}
?>`,
        resourceLinks: [
            {
                title: 'CORS - MDN Web Docs',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS',
            },
            {
                title: 'JWT - JSON Web Tokens',
                url: 'https://jwt.io/',
            },
            {
                title: 'RBAC - Role-Based Access Control',
                url: 'https://en.wikipedia.org/wiki/Role-based_access_control',
            },
        ],
    },
    {
        id: 2,
        title: 'Publicly Accessible Environment Variable',
        risks: [
            'Sensitive data exposure',
            'Unauthorized access',
            'Data manipulation',
            'Environment variable leakage',
            'API key exposure',
            'Configuration exposure',
        ],
        explanation: 'To prevent users from accessing environment variables that are not intended for them, you can implement several security measures. The most common method is to use a .env file to store your environment variables and restrict access to it. You can also use a package like dotenv to load your environment variables from the .env file. \n In the example of this vulnerability. I used an API key in my frontend code to access the API. This is a security risk because anyone can see the API key in the frontend code and use it to access the API. To prevent this, you should never put your API key in your frontend code. Instead, you should use a package like dotenv to load your environment variables from the .env file and use them in your backend code.',
        js: `
import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();

app.get('/api/secure-endpoint', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json({ message: 'This is a secure endpoint' });
    });
});
app.listen(4000, () => {
    console.log('Server is running on port 3000');
});
`,
        php: `
<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Load the environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

header('Content-Type: application/json');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get Authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Extract token
$token = str_replace('Bearer ', '', $authHeader);

try {
    $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
    echo json_encode(['message' => 'This is a secure endpoint']);
} catch (Exception $e) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
}
?>`,
        resourceLinks: [
            {
                title: 'dotenv - npm',
                url: 'https://www.npmjs.com/package/dotenv',
            },
            {
                title: 'Environment Variables - MDN Web Docs',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Environment_variables',
            },
        ],
    },
    {
        id: 3,
        title: 'Directory Enumeration',
        risks: [
            'While directory enumeration is not a vulnerability in itself, it can lead to other vulnerabilities if sensitive files or directories are exposed. Make sure to restrict access to sensitive files and directories by using RBAC (Role-Based Access Control).'
        ],
        explanation: 'To prevent users from accessing directories that are not intended for them, you can use RBAC(Role-Based Access Control) to restrict access to certain directories. You can also use a package like express-rate-limit to limit the number of requests to your API and prevent brute-force attacks.',
        js: `
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false, 
});
app.use(limiter);
app.get('/api/secure-endpoint', (req, res) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.json({ message: 'This is a secure endpoint' });
    });
});
app.listen(4000, () => {
    console.log('Server is running on port 3000');
});`,
        resourceLinks: [
            {
                title: 'express-rate-limit - npm',
                url: 'https://www.npmjs.com/package/express-rate-limit',
            },
            {
                title: 'Directory Enumeration - OWASP',
                url: 'https://owasp.org/www-community/attacks/Directory_Enumeration',
            },
            {
                title: 'Directory Enumeration Payloads',
                url: 'https://github.com/danielmiessler/SecLists/blob/master/Discovery/Web-Content/directory-list-2.3-medium.txt',
            }
        ]
    }

]