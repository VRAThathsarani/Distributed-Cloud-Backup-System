const API = "http://localhost";


// ---------------------- Upload ----------------------

async function uploadFile() {

    const file = document.getElementById("file").files[0];

    if (!file) {
        alert("Please choose a file.");
        return;
    }

    const form = new FormData();
    form.append("file", file);

    try {

        const response = await fetch(API + "/upload", {
            method: "POST",
            body: form
        });

        const data = await response.json();

        if (response.ok) {

            alert(
                "✅ Upload Successful!\n\n" +
                "File : " + data.filename +
                "\nSHA256 : " + data.sha256
            );

            document.getElementById("file").value = "";

            loadFiles();

            loadHealth();

        } else {

            alert(data.error);

        }

    }

    catch (error) {

        alert("Upload Failed!");

        console.error(error);

    }

}


// ---------------------- Health ----------------------

async function loadHealth() {

    try {

        const response = await fetch(API + "/health");

        const data = await response.json();

        let html = "";

        for (let node in data) {

            let status = data[node].status;

            let icon = status === "healthy"
                ? "🟢"
                : "🔴";

            html += `

            <div class="health-card">

                <h3>${icon} ${node}</h3>

                <p>Status :
                <strong>${status}</strong>
                </p>

            </div>

            `;

        }

        document.getElementById("health").innerHTML = html;

    }

    catch (error) {

        document.getElementById("health").innerHTML =
            "<p>Unable to connect to Gateway.</p>";

    }

}


// ---------------------- Files ----------------------

async function loadFiles() {

    try {

        const response = await fetch(API + "/files");

        const data = await response.json();

        let html = "";

        for (let node in data) {

            html += `
                <h3 style="
                color:#A98B76;
                margin-top:20px;
                margin-bottom:10px;
                ">
                ${node}
                </h3>
            `;

            if (Array.isArray(data[node]) && data[node].length > 0) {

                data[node].forEach(file => {

                    html += `

                    <div class="file-card">

                        <div class="file-name">

                            📄 ${file}

                        </div>

                        <div class="file-buttons">

                            <button
                            class="download"
                            onclick="downloadFile('${file}')">

                            Download

                            </button>

                            <button
                            class="delete"
                            onclick="deleteFile('${file}')">

                            Delete

                            </button>

                        </div>

                    </div>

                    `;

                });

            }

            else {

                html += `

                <div class="file-card">

                    No files found.

                </div>

                `;

            }

        }

        document.getElementById("files").innerHTML = html;

    }

    catch (error) {

        document.getElementById("files").innerHTML =
            "<p>Unable to load files.</p>";

    }

}


// ---------------------- Download ----------------------

function downloadFile(filename) {

    window.location = API + "/download/" + filename;

}


// ---------------------- Delete ----------------------

async function deleteFile(filename) {

    const confirmDelete = confirm(
        "Delete " + filename + " ?"
    );

    if (!confirmDelete)
        return;

    try {

        const response = await fetch(
            API + "/delete/" + filename,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        alert(data.message);

        loadFiles();

        loadHealth();

    }

    catch (error) {

        alert("Delete Failed!");

    }

}


// ---------------------- Auto Load ----------------------

window.onload = function () {

    loadHealth();

    loadFiles();

};

function showFileName(){

    const file=document.getElementById("file").files[0];

    if(file){

        document.getElementById("fileName").innerHTML=file.name;

    }
    else{

        document.getElementById("fileName").innerHTML="No file selected";

    }

}