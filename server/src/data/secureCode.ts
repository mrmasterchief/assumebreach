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
header('Access-Control-Allow-Origin: https://your-client-domain.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Example route
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    // DO NOT PUT YOUR SECRET KEY IN THE CODE. PUT IT IN A .ENV FILE
    $decoded = jwt_verify($token, 'your-secret-key');
    if (!$decoded) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit();
    }
    echo json_encode(['message' => 'This is a secure endpoint']);
}
function jwt_verify($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    $header = json_decode(base64_decode($parts[0]), true);
    $payload = json_decode(base64_decode($parts[1]), true);
    $signature = base64_decode($parts[2]);
    $expectedSignature = hash_hmac('sha256', "$parts[0].$parts[1]", $secret, true);
    return hash_equals($signature, $expectedSignature);
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
header('Access-Control-Allow-Origin: https://your-client-domain.com');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Example route
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $token = $_SERVER['HTTP_AUTHORIZATION'];
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    $decoded = jwt_verify($token, getenv('JWT_SECRET'));
    if (!$decoded) {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit();
    }
    echo json_encode(['message' => 'This is a secure endpoint']);
}
    
function jwt_verify($token, $secret) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    $header = json_decode(base64_decode($parts[0]), true);
    $payload = json_decode(base64_decode($parts[1]), true);
    $signature = base64_decode($parts[2]);
    $expectedSignature = hash_hmac('sha256', "$parts[0].$parts[1]", $secret, true);
    return hash_equals($signature, $expectedSignature);
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


    
    }
]