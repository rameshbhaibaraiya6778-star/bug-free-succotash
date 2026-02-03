from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_video")
def get_video():
    """
    Fetch video URL and handshake key from the Classplus API
    URL parameters:
      url: media URL
      user_id: user id
    """
    url = request.args.get("url")
    user_id = request.args.get("")
    api_url = f"https://cp-api-v5.onrender.com/Saini_bots?url={url}&user_id={user_id}"

    try:
        res = requests.get(api_url)
        data = res.json()  # Expect JSON with fields like 'stream_url', 'handshake_key', 'drm'
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)})
