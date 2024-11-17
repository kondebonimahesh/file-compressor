document.getElementById('uploadForm').onsubmit = async function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', document.getElementById('file').files[0]);

    const response = await fetch('/compress', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    const messageElem = document.getElementById('message');
    if (result.downloadUrl) {
        messageElem.textContent = "File compressed successfully!";
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = result.downloadUrl;
        downloadLink.textContent = "Download Compressed File";
        downloadLink.style.display = 'block';
    } else {
        messageElem.textContent = "Compression failed: " + result.message;
    }
};