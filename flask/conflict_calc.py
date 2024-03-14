import pandas as pd
import os

# fixes issues with relative paths and running file from different locations
dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, 'conflict_matrix.txt')

df = pd.DataFrame()
df["courseNumber1"] = ""
df["courseName1"] = ""
df["courseRequests1"] = 0
df["courseNumber2"] = ""
df["courseName2"] = ""
df["courseRequests2"] = 0
df["courseNumber3"] = ""
df["courseName3"] = ""
df["courseRequests3"] = ""
df["conflictingCourseNumber"] = ""

def main():
  global course_list
  with open(filename, 'r') as file:
    counter = 0
    currentCourseNumber = ""
    for line in file:
      if counter <= 1:
        counter += 1
        continue
      row = line.strip().split(",")
      if (len(row) == 2):
        if (row[0] != currentCourseNumber):
          currentCourseNumber = row[0]
      if (len(row) == 9):
        row.append(currentCourseNumber)
        df.loc[len(df.index)] = row
      elif len(row) == 6:
        row.append("")
        row.append("")
        row.append(0)
        row.append(currentCourseNumber)
        df.loc[len(df.index)] = row
  course_list = {}
  currentCourseNumber = df["conflictingCourseNumber"][0]
  fillingRow = {}
  for row in df.index:
    if (df["conflictingCourseNumber"][row] != currentCourseNumber):
      fillingRow = {}
      currentCourseNumber = df["conflictingCourseNumber"][row]
    fillingRow[df["courseName1"][row]] = df["courseRequests1"][row]
    fillingRow[df["courseName2"][row]] = df["courseRequests2"][row]
    fillingRow[df["courseName3"][row]] = df["courseRequests3"][row]
    course_list[df["conflictingCourseNumber"][row]] = fillingRow

  # print(course_list['AA5010'])

def get_number(Tclass: str, Cclass:str):
  if (Tclass == Cclass):
    return 0
  elif (course_list[Tclass][Cclass] != None):
    return course_list[Tclass][Cclass]



def calcPeriodConflicts(period: list):
  for course in period:
    for i in range(len(period) + 1)

if __name__ == "__main__":
  main()