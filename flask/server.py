from flask import Flask, jsonify

app = Flask(__name__)

ScheduleResponseBody = dict[str, int | list[dict[str, int | list[str]]]]


class ScheduleResponse:

    def __init__(self, grade_level: int) -> None:
        self.body: ScheduleResponseBody = {
            "grade": grade_level,
            "schedule": []
        }

    def add_classes(self, period: int, classes: list[str]) -> None:
        self.body["schedule"].append({"period": period, "classes": classes})

    def get_response(self) -> dict[str, ScheduleResponseBody]:
        return {"body": self.body}


@app.route("/api/generate_schedule/grade=<grade>", methods=["GET"])
def generate_schedule(grade: int):
    scheduleRes = ScheduleResponse(grade)

    scheduleRes.add_classes(1, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(2, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(3, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(4, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(5, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(6, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])
    scheduleRes.add_classes(7, ["Geometry", "AP CS", "Fine Art", "Advanced CS", "Advanced CS", "AP Calculus BC", "AP Lit"])

    response = jsonify(scheduleRes.get_response())
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


if __name__ == "__main__":
    app.run(debug=True)
