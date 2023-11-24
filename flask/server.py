from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test")
def test():
    return {"info": "This is test data"}


@app.route("/generate_schedule")
def generate_schedule():
    return {1: ["a", "b", "c"], 2: ["d", "e", "f"]}


if __name__ == "__main__":
    app.run(debug=True)
