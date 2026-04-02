from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

DEFAULT_OPTIONS = [
    "大獎",
    "二獎",
    "三獎",
    "再來一次",
    "神秘禮物",
    "安慰獎"
]

@app.route("/")
def index():
    return render_template("index.html", options=DEFAULT_OPTIONS)

@app.route("/spin", methods=["POST"])
def spin():
    data = request.get_json()
    options = data.get("options", [])

    # 去掉空白項目
    options = [item.strip() for item in options if item.strip()]

    if not options:
        return jsonify({"error": "請至少輸入一個選項"}), 400

    winner_index = random.randint(0, len(options) - 1)

    return jsonify({
        "winner_index": winner_index,
        "winner_text": options[winner_index]
    })

if __name__ == "__main__":
    app.run(debug=True)
