from conflict.conflict_calc import ConflictCalculator
from conflict.schedule_generator import Classlist

from numpy import NaN
import pandas as pd

import os
import io


class GradeLevelClassParser:

    def __init__(self, conflict_calculator: ConflictCalculator):
        self.conflict_calculator = conflict_calculator

    def parse_from_file(self, filename: str) -> dict[int, Classlist]:
        dirname = os.path.dirname(__file__) + "/../"
        class_lists = pd.read_csv(os.path.join(dirname, filename))

        classes = {
            9: class_lists["Grade 9"].tolist(),
            10: class_lists["Grade 10"].tolist(),
            11: class_lists["Grade 11"].tolist(),
            12: class_lists["Grade 12"].tolist(),
        }

        return self.parse(classes)

    def parse_from_string(self, data: str) -> dict[int, Classlist]:
        class_lists = pd.read_csv(io.StringIO(data))

        classes = {
            9: class_lists["Grade 9"].tolist(),
            10: class_lists["Grade 10"].tolist(),
            11: class_lists["Grade 11"].tolist(),
            12: class_lists["Grade 12"].tolist(),
        }

        return self.parse(classes)

    def parse(self, data: dict[int, list[str]]) -> dict[int, Classlist]:
        grade_classes: dict[int, Classlist] = {}

        for period, schedule in data.items():
            period_classlist: Classlist = {}

            for schedule_class in schedule:
                if schedule_class is NaN:
                    continue

                period_classlist[schedule_class.strip(
                )] = self.conflict_calculator.course_list[
                    schedule_class.strip()]

            grade_classes.update({period: period_classlist})

        return grade_classes
