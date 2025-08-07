const nodemailer = require('nodemailer');
require('dotenv').config(); // Only works locally, not on Netlify


exports.handler = async function (event, context) {

    //NOTE: Specifies Which URLs to allow cross-origin requests from. 
    //      Will need to update once hosting website properly
    const allowedOrigins = [
        'http://localhost:3000',
        'https://fb1e278d.lakeshore-website.pages.dev/'
    ];

    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Origin': '', 
    };

    const origin = event.headers.origin;


    if(allowedOrigins.includes(origin)){
        headers['Access-Control-Allow-Origin'] = origin;
    }

    

    // Handle preflight requests (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: 'OK',
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { to, subject, text } = JSON.parse(event.body || '{}');

    if (!to) {
        return res.status(400).json({ 
            headers,
            error: 'Missing To field' 
        });
    }

    if (!subject) {
        return res.status(400).json({ 
            headers,
            error: 'Missing Subject field' 
        });
    }

    if (!text) {
        return res.status(400).json({ 
            headers,
            error: 'Missing Text field' 
        });
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
        headers,
        body: JSON.stringify({ success:true, message: 'Email sent', id: info.messageId }),
    };
  } 
  
  catch (err) {
    console.error('Error sending email:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success:false, error: 'Failed to send email' }),
    };
  }
};