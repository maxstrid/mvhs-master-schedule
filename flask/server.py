from flask import Flask, jsonify, request
from conflict.conflict_calc import ConflictCalculator
app = Flask(__name__)

ScheduleResponseBody = dict[str, int | list[dict[str, int | list[str]]]]
ConflictResponseBody = dict[str, int]


conflict_calculator = ConflictCalculator()
conflict_calculator.parseFile()

class ConflictResponse:

    def __init__(self, period: list) -> None:
        self.body: ConflictResponseBody = {
            "conflicts": 0
        }
        self.currentPeriod = period

    def calc_conflicts(self) -> None:
        self.body["conflicts"] = conflict_calculator.calcPeriodConflicts(self.currentPeriod)

    def get_response(self) -> dict[str, ConflictResponseBody]:
        return {"body": self.body}

class ScheduleResponse:

    def __init__(self, grade_level: int) -> None:
        self.body: ScheduleResponseBody = {
            "grade": grade_level,
            "schedule": []
        }

    def add_classes(self, period: int, classes: list[str]) -> None:
        # This is needed so mypy is happy with us assuming there is a .append function on this type.
        if type(self.body['schedule']) is list:
            self.body["schedule"].append({"period": period, "classes": classes})

    def get_response(self) -> dict[str, ScheduleResponseBody]:
        return {"body": self.body}

@app.route("/api/generate_schedule/grade=<grade>", methods=["GET"])
def generate_schedule(grade: int):
    scheduleRes = ScheduleResponse(grade)

    scheduleRes.add_classes(1, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(2, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(3, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(4, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(5, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(6, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])
    scheduleRes.add_classes(7, ["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"])

    response = jsonify(scheduleRes.get_response())
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

# does not actually updating anything
# just calculates conflicts
@app.route("/api/calc_period_conflicts/period=<period>", methods=["POST", "OPTIONS"])
def calc_period_conflicts(period: int):
    if request.method == "OPTIONS": # CORS preflight
        response = jsonify("")
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response

    classes = request.get_json()
    conflictRes = ConflictResponse(list(map(lambda x: x['id'], classes)))

    conflictRes.calc_conflicts()

    response = jsonify(conflictRes.body)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

if __name__ == "__main__":
    app.run(debug=True)
