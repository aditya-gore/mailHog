const express = require('express');
const nodemailer = require('nodemailer');
const config = require('config');

const app = express();

app.use(express.json({ extended: false }));
//docker-compose -f ./docker-compose.yml up -d
// config info
const transporter = nodemailer.createTransport({
  host: config.get('mailhog.host'),
  port: config.get('mailhog.smtp_port'),
});

// define routes

// @route GET /health
// @desc  Get application health
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'application is healthy',
  });
});

// @route POST /send
// @desc  Send email
app.post('/send', (req, res) => {
  // console.log(req.body);
  const { to, sub, body } = req.body;

  const obj = transporter.sendMail({
    from: 'My company <localhost@mailhog.local>',
    to: to,
    subject: sub,
    text: body,
  });

  if (!obj) {
    res.status(500).json({
      status: 'internal server error',
      message: 'error sending message',
    });
  }

  res.status(201).json({
    status: 'create',
    message: 'message sent',
  });
});

// driver code
const port = config.get('app_port');
app.listen(port, () => {
  console.log(`Service endpoint http://localhost:${port}`);
});
