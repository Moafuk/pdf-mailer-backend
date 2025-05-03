const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

app.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'YOUR_EMAIL@hotmail.com',
        pass: 'YOUR_PASSWORD',
      },
    });

    const mailOptions = {
      from: 'YOUR_EMAIL@hotmail.com',
      to: 'YOUR_EMAIL@hotmail.com',
      subject: 'New Mortality PDF',
      text: 'A new mortality PDF is attached.',
      attachments: [
        {
          filename: 'report.pdf',
          content: req.file.buffer,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send email.');
  }
});

app.get('/', (req, res) => {
  res.send('PDF Mailer Backend is working!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
