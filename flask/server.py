from flask import Flask, jsonify, request
from numpy import NaN
import pandas as pd
from conflict.conflict_calc import ConflictCalculator
from conflict.schedule_generator import ScheduleGenerator, Classlist

app = Flask(__name__)

ScheduleResponseBody = dict[str,
                            int | list[dict[str, int | list[tuple[str, str]]]]]
ConflictResponseBody = dict[str, int]

conflict_calculator = ConflictCalculator()

grade_classes: dict[int, Classlist] = {}


def parse_grade_classes():
    class_lists = pd.read_csv('flask/conflict/grade_level_classes.csv')

    print(class_lists)

    classes = {
        9: class_lists["Grade 9"],
        10: class_lists["Grade 10"],
        11: class_lists["Grade 11"],
        12: class_lists["Grade 12"],
    }

    for period, schedule in classes.items():
        period_classlist: Classlist = {}

        for schedule_class in schedule:
            if schedule_class is NaN:
                continue

            period_classlist[schedule_class.strip(
            )] = conflict_calculator.course_list[schedule_class.strip()]

        grade_classes.update({period: period_classlist})

    return ""


parse_grade_classes()


class ConflictResponse:

    def __init__(self, period: list) -> None:
        self.body: ConflictResponseBody = {"conflicts": 0}
        self.currentPeriod = period

    def calc_conflicts(self) -> None:
        self.body[
            "conflicts"] = conflict_calculator.calculate_period_conflicts(
                self.currentPeriod)

    def get_response(self) -> dict[str, ConflictResponseBody]:
        return {"body": self.body}


class ScheduleResponse:

    def __init__(self, grade_level: int) -> None:
        self.body: ScheduleResponseBody = {
            "grade": grade_level,
            "schedule": []
        }

    def add_classes(self, period: int, classes: list[str],
                    calculator: ConflictCalculator) -> None:
        # This is needed so mypy is happy with us assuming there is a .append function on this type.
        if type(self.body['schedule']) is list:
            self.body["schedule"].append({
                "period":
                period,
                "classes":
                calculator.named_list(classes)
            })

    def get_response(self) -> dict[str, ScheduleResponseBody]:
        return {"body": self.body}


@app.route("/api/generate_schedule/grade=<grade>", methods=["GET"])
def generate_schedule(grade: int):
    grade = int(grade)

    scheduleRes = ScheduleResponse(grade)

    generator = ScheduleGenerator(conflict_calculator, grade_classes[grade])

    schedule = generator.gen_schedule()

    for period, classes in schedule.items():
        scheduleRes.add_classes(period + 1, list(classes), conflict_calculator)

    response = jsonify(scheduleRes.get_response())
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# does not actually updating anything
# just calculates conflicts
@app.route("/api/calculate_conflicts", methods=["POST", "OPTIONS"])
def calc_period_conflicts():
    if request.method == "OPTIONS":  # CORS preflight
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


@app.route("/api/import_csv_data", methods=["POST", "OPTIONS"])
def import_csv_data():
    global grade_classes

    if request.method == "OPTIONS":  # CORS preflight
        response = jsonify("")
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "*")
        response.headers.add("Access-Control-Allow-Methods", "*")
        return response
    class_lists = request.get_json()

    classes = {
        9: class_lists["grade9Classes"],
        10: class_lists["grade10Classes"],
        11: class_lists["grade11Classes"],
        12: class_lists["grade12Classes"],
    }

    for period, schedule in classes.items():
        period_classlist: Classlist = {}

        for schedule_class in schedule:
            period_classlist[schedule_class.strip(
            )] = conflict_calculator.course_list[schedule_class.strip()]

        grade_classes.update({period: period_classlist})

    return ""


if __name__ == "__main__":
    app.run(debug=True)
