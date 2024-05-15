from conflict.conflict_calc import ConflictCalculator

ConflictResponseBody = dict[str, int]

ScheduleResponseBody = dict[str,
                            int | list[dict[str, int | list[tuple[str, str]]]]]
"""
    Generates a response when the server requests the number of conflicts in a period.

    Format:
    "body": {
        "conflicts": number
    }
"""


class ConflictResponse:

    def __init__(self, period: list,
                 conflict_calculator: ConflictCalculator) -> None:
        self.body: ConflictResponseBody = {"conflicts": 0}
        self.currentPeriod = period
        self.conflict_calculator = conflict_calculator

    def calc_conflicts(self) -> None:
        self.body[
            "conflicts"] = self.conflict_calculator.calculate_period_conflicts(
                self.currentPeriod)

    def get_response(self) -> dict[str, ConflictResponseBody]:
        return {"body": self.body}


"""
    Generates a response when the server requests a fully generated schedule.

    Format:
    "body": {
        "grade": number,
        "schedule": [{
            "period": number,
            "classes": string
        }]
    }
"""


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
