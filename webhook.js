require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.GITHUB_SECRET;
const CLIENT_PATH = process.env.CLIENT_PATH;
const SERVER_PATH = process.env.SERVER_PATH;

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(bodyParser.json());

function verifySignature(req) {
  const sig = req.headers['x-hub-signature-256'];
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
}

app.post('/github-webhook', (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).send('Invalid signature');
  }

  exec(`cd ${SERVER_PATH}/.. && git pull`, (err, stdout, stderr) => {
    if (err) {
      console.error('Git pull error:', stderr);
      return res.status(500).send('Git pull failed');
    }
    console.log('Git pull output:', stdout);

    exec(`cd ${CLIENT_PATH} && npm install && npm run build`, (err, stdout, stderr) => {
      if (err) {
        console.error('Next.js build error:', stderr);
        return res.status(500).send('Client build failed');
      }
      console.log('Next.js build output:', stdout);

      exec(`pm2 restart assumebreach-client && pm2 restart assumebreach-server`, (err, stdout, stderr) => {
        if (err) {
          console.error('PM2 restart error:', stderr);
          return res.status(500).send('PM2 restart failed');
        }
        console.log('PM2 restart output:', stdout);
        res.status(200).send('Deployment complete');
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on port ${PORT}`);
});
