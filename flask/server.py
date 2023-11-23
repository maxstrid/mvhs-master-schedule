from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test")
def test():
    return {"info": "This is test data"}


if __name__ == "__main__":
    app.run(debug=True)
