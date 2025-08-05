const nodemailer = require('nodemailer');
require('dotenv').config(); // Only works locally, not on Netlify

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { to, subject, text } = JSON.parse(event.body || '{}');

  if (!to) {
        return res.status(400).json({ error: 'Missing To field' });
    }

    if (!subject) {
        return res.status(400).json({ error: 'Missing Subject field' });
    }

    if (!text) {
        return res.status(400).json({ error: 'Missing Text field' });
    }
  

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
});

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success:true, message: 'Email sent', id: info.messageId }),
    };
  } 
  
  catch (err) {
    console.error('Error sending email:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success:false, error: 'Failed to send email' }),
    };
  }
};