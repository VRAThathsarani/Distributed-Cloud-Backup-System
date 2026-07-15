from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import logging

from config_docker import NODES
# from config_local import NODES
from utils import calculate_sha256

app = Flask(__name__)

# Enable CORS
CORS(app)

logging.basicConfig(level=logging.INFO)


# ---------------- HOME ----------------

@app.route("/")
def home():
    return jsonify({
        "service": "Gateway Server",
        "status": "Running"
    })


# ---------------- HEALTH ----------------

@app.route("/health")
def health():

    nodes = {}

    for name, url in NODES.items():

        try:

            response = requests.get(
                f"{url}/health",
                timeout=2
            )

            nodes[name] = response.json()

        except Exception as e:

            nodes[name] = {
                "status": "Offline",
                "error": str(e)
            }

    return jsonify(nodes)


# ---------------- UPLOAD ----------------

@app.route("/upload", methods=["POST"])
def upload():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    uploaded_file = request.files["file"]

    if uploaded_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    # Read uploaded file
    file_data = uploaded_file.read()

    # Calculate SHA-256 checksum
    checksum = calculate_sha256(file_data)

    results = {}

    for name, url in NODES.items():

        logging.info(f"Uploading {uploaded_file.filename} to {name}")

        try:

            files = {
                "file": (
                    uploaded_file.filename,
                    file_data,
                    uploaded_file.content_type
                )
            }

            response = requests.post(
                f"{url}/upload",
                files=files, timeout=10
            )

            results[name] = response.json()

        except Exception as e:

            results[name] = {
                "error": str(e)
            }

    return jsonify({
        "message": "Replication completed",
        "filename": uploaded_file.filename,
        "sha256": checksum,
        "results": results
    })


# ---------------- FILE LIST ----------------

@app.route("/files", methods=["GET"])
def get_all_files():

    all_files = {}

    for name, url in NODES.items():

        try:

            response = requests.get(f"{url}/files", timeout=5)

            all_files[name] = response.json()

        except Exception as e:

            all_files[name] = {
                "error": str(e)
            }

    return jsonify(all_files)


# ---------------- DOWNLOAD ----------------

@app.route("/download/<filename>", methods=["GET"])
def download(filename):

    for node in NODES.values():

        try:

            response = requests.get(
                f"{node}/download/{filename}",
                stream=True, timeout=10
            )

            if response.status_code == 200:

                return (
                    response.content,
                    200,
                    {
                        "Content-Disposition":
                        f'attachment; filename="{filename}"',
                        "Content-Type": response.headers.get(
                            "Content-Type", "application/octet-stream"
                        )
                    }
                )

        except Exception:
            continue

    return jsonify({
        "error": "File not found"
    }), 404


# ---------------- DELETE ----------------

@app.route("/delete/<filename>", methods=["DELETE"])
def delete(filename):

    results = {}

    for name, url in NODES.items():

        try:

            response = requests.delete(
                f"{url}/delete/{filename}", timeout=5
            )

            results[name] = response.json()

        except Exception as e:

            results[name] = {
                "error": str(e)
            }

    return jsonify({
        "message": "Delete completed",
        "results": results
    })


# ---------------- RUN ----------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)