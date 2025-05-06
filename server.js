// server.js
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });

// 🔧 Add middleware to parse JSON/form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log('📥 Received PDF file:', filePath);

    // ✅ Replace with your actual Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@gmail.com',   // 🔁 Replace this
        pass: 'your_app_password_here', // 🔁 Replace this
      },
    });

    // Optional: Verify email transporter
    await transporter.verify();
    console.log("✅ Email transporter is ready.");

    const info = await transporter.sendMail({
      from: 'your_email@gmail.com', // 🔁 Replace this
      to: 'your_email@gmail.com',   // 🔁 Or make dynamic
      subject: 'Mortality PDF Report',
      text: 'PDF report is attached.',
      attachments: [
        {
          filename: 'mortality_report.pdf',
          path: filePath,
        },
      ],
    });

    console.log("✅ Mail sent:", info.response);

    // Delete file after sending
    fs.unlinkSync(filePath);
    res.send('✅ PDF sent!');
  } catch (err) {
    console.error("❌ Error in sending PDF:", err);
    res.status(500).send('Failed to send.');
  }
});

// ✅ Use the dynamic Render-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server ready on port ${PORT}`);
});
