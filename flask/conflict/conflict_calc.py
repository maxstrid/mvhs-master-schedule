import pandas as pd
import os

CourseList = dict[str, dict[str, int]]
CourseMap = dict[str, str]

# fixes issues with relative paths and running file from different locations


class ConflictCalculator:
    def __init__(self, filename: None | str = None):
        # Creates map containing class and its corresponding conflicts with each class
        self.course_list: CourseList = {}

        # Maps the ids of each class to their names
        self.course_map: CourseMap = {}

        self.filename = filename

        if self.filename is None:
            dirname = os.path.dirname(__file__)
            self.filename = os.path.join(dirname, 'conflict_matrix.txt')

            self.parse_file()

    def parse_file(self):
        with open(str(self.filename), 'r') as file:
            current_course_id = ""

            for line in file:
                # splits each row of the file by commas
                # if row only contains two comparing classes, blank placeholder values
                # adds comparing class to the last column

                # This is a title line, skip
                if "Crs#" in line or "Course Conflict Matrix" in line:
                    continue

                row = line.strip().split(",")
                if (len(row) == 2):
                    current_course_id = row[0].strip()
                    if row[1].strip() not in self.course_map:
                        self.course_map[current_course_id] = row[1].strip()
                    continue

                chunks = [row[x:x + 3] for x in range(0, len(row), 3)]

                for chunk in chunks:
                    if current_course_id not in self.course_list:
                        self.course_list[current_course_id] = {}

                    conflicting_course = chunk[0].strip()

                    self.course_list[current_course_id][
                        conflicting_course] = int(chunk[2])

        print("File Parsed")

    def calculate_conflict(self, first_class: str, second_class: str) -> int:
        if (first_class == second_class):
            return 0

        if second_class in self.course_list[first_class]:
            return self.course_list[first_class][second_class]

        return 0

    # WARNING: this can fail
    def course_id(self, name: str) -> None | str:
        inv_map = dict(zip(self.course_map.values(), self.course_map.keys()))
        return inv_map[name]

    def named_list(self, period: list[str]) -> list[tuple[str, str]]:
        return list(map(lambda x: (x, self.course_map[x]), period))

    def calculate_period_conflicts(self, classes: list[str]) -> int:
        conflict_number = 0

        calculated_conflicts: set[tuple[str, str]] = set()

        for i in range(len(classes)):
            for j in range(i + 1, len(classes)):
                if (classes[i], classes[j]) in calculated_conflicts:
                    continue

                conflict_number += self.calculate_conflict(
                    classes[i], classes[j])

                calculated_conflicts.add((classes[i], classes[j]))

        return conflict_number