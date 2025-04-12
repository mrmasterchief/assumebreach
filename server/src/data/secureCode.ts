export const secureCode = [
    {
        id: 1,
        title: 'Insecure API',
        risks: [
            'Sensitive data exposure',
            'Unauthorized access',
            'Data manipulation',
        ],
        explanation: 'To prevent users from accessing API endpoints that are not intended for them, you can implement several security measures. The most common method is CORS (Cross-Origin Resource Sharing), which restricts which domains can access your API. RBAC (Role-Based Access Control) is also an option that will be described on a different page.',
        js: `
        import express from 'express';
        import cors from 'cors';

        const app = express();
        const corsOptions = {
            origin: 'https://your-client-domain.com',
            credentials: true,
        };
        app.use(cors(corsOptions));

        // Example route
        app.get('/api/data', (req, res) => {
            res.json({ message: 'This is a secure endpoint' });
        });
`,
        php: `
        <?php
            header('Access-Control-Allow-Origin: https://your-client-domain.com');
            header('Access-Control-Allow-Credentials: true');
            header('Content-Type: application/json');
            // Example route
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                echo json_encode(['message' => 'This is a secure endpoint']);
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'Method not allowed']);    
            }
        ?>`,
    }
]