from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

STORAGE_FOLDER = "storage"
os.makedirs(STORAGE_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return jsonify({
        "node": "Node 2",
        "status": "Running"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.route("/files")
def list_files():
    files = os.listdir(STORAGE_FOLDER)
    return jsonify(files)


@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    file.save(os.path.join(STORAGE_FOLDER, file.filename))

    return jsonify({
        "message": "File uploaded successfully",
        "filename": file.filename
    })

@app.route("/download/<filename>", methods=["GET"])
def download_file(filename):

    file_path = os.path.join(STORAGE_FOLDER, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    return send_from_directory(STORAGE_FOLDER, filename, as_attachment=True)

@app.route("/delete/<filename>", methods=["DELETE"])
def delete_file(filename):

    file_path = os.path.join(STORAGE_FOLDER, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    os.remove(file_path)

    return jsonify({
        "message": "File deleted successfully"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)