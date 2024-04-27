document.getElementById('splitButton').addEventListener('click', function() {
    var fileInput = document.getElementById('audioFile');
    var file = fileInput.files[0];

    if (file) {
        var formData = new FormData();
        formData.append('audioFile', file);

        var outputFormat = document.getElementById('outputFormat').value;

        // Show progress indication
        var progressBar = document.createElement('progress');
        progressBar.value = 0;
        progressBar.max = 100;
        document.getElementById('result').appendChild(progressBar);

        fetch('/split', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Remove progress indication
            progressBar.remove();
            displayResult(data.result, outputFormat);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert('Please select an audio file.');
    }
});

function displayResult(result, outputFormat) {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Vocals:</p><audio controls><source src="' + result.vocals + '" type="audio/' + outputFormat + '"></audio>' +
                          '<p>Instrumental:</p><audio controls><source src="' + result.instrumental + '" type="audio/' + outputFormat + '"></audio>' +
                          '<button onclick="downloadFile(\'' + result.vocals + '\', \'' + outputFormat + '\')">Download Vocals</button>' +
                          '<button onclick="downloadFile(\'' + result.instrumental + '\', \'' + outputFormat + '\')">Download Instrumental</button>';
}

// Function to download file
function downloadFile(url, format) {
    var link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.' + format);
    document.body.appendChild(link);
    link.click();
}

// Validate file size and type
function validateFile(input) {
    var file = input.files[0];
    if (file) {
        if (file.size > 300 * 1024 * 1024) {
            alert("File size exceeds 300MB limit.");
            input.value = "";
        }
    }
}
