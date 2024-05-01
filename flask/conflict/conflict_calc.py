import pandas as pd
import os

CourseList = dict[str, dict[str, int]]
CourseMap = dict[str, str]

# fixes issues with relative paths and running file from different locations
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'conflict_matrix.txt')

class ConflictCalculator:
  def __init__(self):
    # dataframe that contains the data from the conflict matrix
    self.df = pd.DataFrame()
    self.df["courseNumber1"] = ""
    self.df["courseName1"] = ""
    self.df["courseRequests1"] = 0
    self.df["courseNumber2"] = ""
    self.df["courseName2"] = ""
    self.df["courseRequests2"] = 0
    self.df["courseNumber3"] = ""
    self.df["courseName3"] = ""
    self.df["courseRequests3"] = ""
    self.df["conflictingCourseName"] = ""

    # creates map containing class and its corresponding conflicts with each class
    self.course_list: CourseList = {}

    self.course_map: CourseMap = {}
  
  def parseFile(self):
    with open(filename, 'r') as file:
      counter = 0
      current_course_id = ""
      for line in file:
        # skips first two uneeded rows
        if counter <= 1:
          counter += 1
          continue

        # splits each row of the file by commas
        # sorts the values into the data frame
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

        chunks = [row[x:x+3] for x in range(0, len(row), 3)]

        for chunk in chunks:
          if current_course_id not in self.course_list:
            self.course_list[current_course_id] = {}

          conflicting_course = chunk[0].strip()

          self.course_list[current_course_id][conflicting_course] = int(chunk[2])

    print("File Parsed")
  
  def get_number(self, Tclass: str, Cclass:str):
    if (Tclass == Cclass):
      return 0
    elif (self.course_list[Tclass][Cclass] != None):
      return self.course_list[Tclass][Cclass]
  
  # WARNING: this can fail
  def course_id(self, name: str) -> str:
    inv_map = dict(zip(self.course_map.values(), self.course_map.keys()))
    return inv_map[name]

  def named_list(self, period: list[str]) -> list[tuple[str, str]]:
    return list(map(lambda x: (x, self.course_map[x]), period))

  def calcPeriodConflicts(self, period: list):
    conflict_number = 0
    for i in range(len(period)):
        for j in range(i + 1, len(period)):
            if period[j] not in self.course_list[period[i]]:
                continue
            conflict_number += int(self.course_list[period[i]][period[j]])
    return conflict_number
