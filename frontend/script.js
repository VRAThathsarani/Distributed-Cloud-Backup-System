document.getElementById("uploadForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const file = document.getElementById("fileInput").files[0];

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    document.getElementById("status").innerText =
        JSON.stringify(data, null, 2);
});