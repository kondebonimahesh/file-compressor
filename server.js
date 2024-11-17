const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(fileUpload());
app.use(express.static('public'));

app.post('/compress', (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const uploadPath = path.join(__dirname, 'uploads', file.name);
    const outputFilePath = path.join(__dirname, 'compressed', file.name + '.bin');

    file.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed' });
        }

        exec(`./compressor "${uploadPath}" "${outputFilePath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                return res.status(500).json({ message: 'Compression failed' });
            }

            console.log(stdout);
            res.json({ downloadUrl: `/compressed/${path.basename(outputFilePath)}` });
        });
    });
});

app.use('/compressed', express.static(path.join(__dirname, 'compressed')));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
