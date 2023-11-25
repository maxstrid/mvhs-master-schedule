from flask import Flask

app = Flask(__name__)

ScheduleResponseBody = list[dict[str, int | list[str]]]


class ScheduleResponse:

    def __init__(self) -> None:
        self.body: ScheduleResponseBody = []

    def add_classes(self, period: int, classes: list[str]) -> None:
        self.body.append({"period": period, "classes": classes})

    def get_response(self) -> dict[str, ScheduleResponseBody]:
        return {"body": self.body}


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test")
def test():
    return {"info": "This is test data"}


@app.route("/generate_schedule")
def generate_schedule():
    scheduleRes = ScheduleResponse()

    scheduleRes.add_classes(1, ["a", "b", "c"])
    scheduleRes.add_classes(2, ["d", "e", "f"])

    return scheduleRes.get_response()


if __name__ == "__main__":
    app.run(debug=True)
