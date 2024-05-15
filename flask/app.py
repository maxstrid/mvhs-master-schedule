from flask import Flask, jsonify, request
import flask_cors as cors

from server.response import ConflictResponse, ScheduleResponse
from server.parsing import GradeLevelClassParser
from conflict.conflict_calc import ConflictCalculator
from conflict.schedule_generator import ScheduleGenerator, Classlist

import os

app = Flask(__name__)
cors.CORS(app)


@app.before_request
def before_request():
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    if request.method.lower() == 'options':
        return jsonify(headers), 200


"""
    This class handles data for one client at a time, this is done to prevent two people from overriding eachother on the backend.
    It uses a unique id per client on the frontend and each request is sent with that id.
    These do not need to be stored in a databse because they're really only per session pieces of data.
"""


class ClientData:

    def __init__(self):
        self.conflict_calculator = ConflictCalculator()

        grade_class_parser = GradeLevelClassParser(self.conflict_calculator)

        self.grade_level_classes = grade_class_parser.parse_from_file(
            'conflict/grade_level_classes.csv')


clients: dict[str, ClientData] = {}


# generates schedule based on grade number
@app.route("/api/generate_schedule", methods=["GET"])
def generate_schedule():
    args = request.args.to_dict()

    if args["id"] not in clients:
        clients[args["id"]] = ClientData()

    client_data = clients[args["id"]]

    grade = int(args["grade"])

    scheduleRes = ScheduleResponse(grade)

    generator = ScheduleGenerator(client_data.conflict_calculator,
                                  client_data.grade_level_classes[grade])

    schedule = generator.gen_schedule()

    for period, classes in schedule.items():
        scheduleRes.add_classes(period + 1, list(classes),
                                client_data.conflict_calculator)

    response = jsonify(scheduleRes.get_response())
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# does not actually updating anything
# just calculates conflicts
@app.route("/api/calculate_conflicts", methods=["POST"])
def calc_period_conflicts():
    args = request.args.to_dict()

    if args["id"] not in clients:
        clients[args["id"]] = ClientData()

    client_data = clients[args["id"]]

    classes = request.get_json()
    conflictRes = ConflictResponse(list(map(lambda x: x['id'], classes)),
                                   client_data.conflict_calculator)

    conflictRes.calc_conflicts()

    response = jsonify(conflictRes.body)
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# parses csv file from user
@app.route("/api/import/grade_level_classes", methods=["POST"])
def import_grade_level_classes():
    args = request.args.to_dict()

    if args["id"] not in clients:
        clients[args["id"]] = ClientData()

    client_data = clients[args["id"]]

    class_lists = request.get_json()

    classes = {
        9: class_lists["grade9Classes"],
        10: class_lists["grade10Classes"],
        11: class_lists["grade11Classes"],
        12: class_lists["grade12Classes"],
    }

    parser = GradeLevelClassParser(client_data.conflict_calculator)

    client_data.grade_level_classes = parser.parse(classes)

    return ""


@app.route("/api/import/conlict_matrix", methods=["POST"])
def import_conflict_matrix():
    return ""


@app.route("/api/import/schedule", methods=["POST"])
def import_schedule():
    return ""


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)
