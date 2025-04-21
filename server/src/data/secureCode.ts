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
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

function jsonResponse(array $data, int $statusCode = 200): never {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getBearerToken(): ?string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }

    return null;
}

header("Access-Control-Allow-Origin: https://your-client-domain.com");
header("Access-Control-Allow-Credentials: true");

$token = getBearerToken();
if (!$token) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$secretKey = $_ENV['JWT_SECRET'];

try {
    $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
    jsonResponse([
        'message' => 'This is a secure endpoint',
        'user' => $decoded,
    ]);
} catch (Exception $e) {
    jsonResponse([
        'error' => 'Forbidden',
        'message' => $e->getMessage(),
    ], 403);
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
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

function jsonResponse(array $data, int $statusCode = 200): never {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getBearerToken(): ?string {
    $headers = function_exists('getallheaders') ? getallheaders() : [];

    if (isset($headers['Authorization']) && str_starts_with($headers['Authorization'], 'Bearer ')) {
        return substr($headers['Authorization'], 7);
    }

    if (isset($_SERVER['HTTP_AUTHORIZATION']) && str_starts_with($_SERVER['HTTP_AUTHORIZATION'], 'Bearer ')) {
        return substr($_SERVER['HTTP_AUTHORIZATION'], 7);
    }

    return null;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method Not Allowed'], 405);
}

$token = getBearerToken();

if (!$token) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

try {
    $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
    jsonResponse(['message' => 'This is a secure endpoint']);
} catch (Exception $e) {
    jsonResponse(['error' => 'Forbidden'], 403);
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
        php: `
<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

function respondJson(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getAuthorizationHeader(): ?string {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }

    if (function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        return $headers['Authorization'] ?? null;
    }

    return null;
}

function rateLimit(string $keyPrefix = 'rate_limit_', int $limit = 100, int $windowSeconds = 900): void {
    if (!function_exists('apcu_fetch')) {
        respondJson(['error' => 'APCu not enabled'], 500);
    }

    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = $keyPrefix . $ip;

    $requests = apcu_fetch($key);
    if ($requests === false) {
        apcu_store($key, 1, $windowSeconds);
    } else {
        if ($requests >= $limit) {
            respondJson(['error' => 'Too many requests, please try again later.'], 429);
        }
        apcu_inc($key);
    }
}


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondJson(['error' => 'Method Not Allowed'], 405);
}

rateLimit();

$authHeader = getAuthorizationHeader();
if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
    respondJson(['error' => 'Unauthorized'], 401);
}

$token = substr($authHeader, 7);

try {
    $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
    respondJson(['message' => 'This is a secure endpoint']);
} catch (Exception $e) {
    respondJson(['error' => 'Forbidden'], 403);
}
?>`,
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
    },
    {
        id: 4,
        title: "SQL Injection",
        risks: [
            "Data manipulation",
            "Data leakage",
            "Unauthorized access",
            "Denial of service",
            "Privilege escalation",
            "Data loss",
        ],
        explanation: "To prevent users from accessing SQL Injection vulnerabilities, you can implement several security measures. The most common method is to use prepared statements and parameterized queries to prevent SQL Injection attacks.",
        js: `
import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const app = express();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server is running on port 4000');
});
`,
        php: `
<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

header('Content-Type: application/json');

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $_ENV['DB_HOST'],
        $_ENV['DB_NAME']
    );
    $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
        exit;
    }

    echo json_encode(['message' => 'Login successful']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>`,
        resourceLinks: [
            {
                title: 'SQL Injection - OWASP',
                url: 'https://owasp.org/www-community/attacks/SQL_Injection',
            },
            {
                title: 'Prepared Statements - PHP Manual',
                url: 'https://www.php.net/manual/en/mysqli.quickstart.prepared-statements.php',
            },
        ],
    },
    {
        id: 5,
        title: 'Cross Site Scripting (XSS)',
        risks: [
            'Data manipulation',
            'Data leakage',
            'Unauthorized access',
        ],
        explanation: 'To prevent users from accessing XSS vulnerabilities, you can implement several security measures. React and Angular have built-in XSS protection. You can also use a package like DOMPurify to sanitize user input and prevent XSS attacks.',
        js: `
import express from 'express';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = require('dompurify')(window);
app.use(express.json());
app.post('/api/submit', (req, res) => {
    const { userInput } = req.body;
    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });   
    }
    const sanitizedInput = DOMPurify.sanitize(userInput);
    res.json({ message: 'Input submitted successfully', sanitizedInput } );
    return;
}
);
app.listen(4000, () => {
    console.log('Server is running on port 4000');
}
);
`,
        php: `
<?php
declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';
use HTMLPurifier;
use HTMLPurifier_Config;
use Dotenv\Dotenv;
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
function jsonResponse(array $data, int $statusCode = 200): never {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}
$input = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method Not Allowed'], 405);
    return;
}
$userInput = $input['userInput'] ?? null;
if (!$userInput) {
    jsonResponse(['error' => 'User input is required'], 400);
    return;
}
$config = HTMLPurifier_Config::createDefault();
$config->set('HTML.Allowed', 'p,b,a[href],i,br');
$config->set('HTML.AllowedAttributes', 'a.href');
$config->set('HTML.AllowedClasses', 'class1,class2');
$config->set('HTML.ForbiddenElements', 'script,iframe');
$config->set('HTML.ForbiddenAttributes', 'style');
$config->set('HTML.AllowedProtocols', 'http,https');
$config->set('URI.AllowedSchemes', ['http' => true, 'https' => true]);
$purifier = new HTMLPurifier($config);
$sanitizedInput = $purifier->purify($userInput);
jsonResponse(['message' => 'Input submitted successfully', 'sanitizedInput' => $sanitizedInput]);
    return;
}
?>`,
        resourceLinks: [
            {
                title: 'XSS - OWASP',
                url: 'https://owasp.org/www-community/attacks/xss/',
            },
            {
                title: 'DOMPurify - npm',
                url: 'https://www.npmjs.com/package/dompurify',
            },
        ],
    },
    {
       id: 6,
        title: 'Broken Access Control',
        risks: [
            'Unauthorized access',
            'Data manipulation',
            'Data leakage',
        ],
    },
    {
        id: 7,
        title: 'Unsafe Hash Algorithm',
        risks: [
            'Data Leakage',
            'Data Manipulation',
            'Unauthorized Access',
        ],
        explanation: 'We advise the use of a strong hash algorithm such as bcrypt, scrypt, or Argon2. These algorithms are designed to be slow and computationally expensive, making them more resistant to brute-force attacks. In the example of this vulnerability, I used the MD5 hash algorithm to hash the password. This is a security risk because MD5 is a weak hash algorithm that can be easily cracked using rainbow tables or brute-force attacks.',
        js: `
import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
const app = express();
app.use(express.json());
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);
app.listen(4000, () => {
    console.log('Server is running on port 4000');
}
);
`,
        php: `
<?php
require 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

try {
    $dsn = "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_NAME']};charset=utf8mb4";
    $pdo = new PDO($dsn, $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    $stmt->execute([$username, $hashedPassword]);

    echo json_encode(['message' => 'User registered successfully']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error', 'details' => $e->getMessage()]);
}
?>`,
        resourceLinks: [
            {
                title: 'bcrypt - npm',
                url: 'https://www.npmjs.com/package/bcrypt',
            },
            {
                title: 'bcrypt - PHP Manual',
                url: 'https://www.php.net/manual/en/book.password.php',
            },
        ],
    },
        

]