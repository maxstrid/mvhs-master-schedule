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
df["conflictingCourseName"] = ""

def main():
  global course_list
  # this parses through the file conflict matrix file
  # and puts the data into a pandas data frame for easier analysis
  with open(filename, 'r') as file:
    counter = 0
    currentCourseName = ""
    for line in file:
      # skips first two uneeded rows
      if counter <= 1:
        counter += 1
        continue

      # splits each row of the file by commas
      # sorts the values into the data frame
      # if row only contains two comparing classes, blank placeholder values
      # adds comparing class to the last column
      row = line.strip().split(",")
      if (len(row) == 2):
        if (row[1] != currentCourseName):
          currentCourseName = row[1]
      if (len(row) == 9):
        row.append(currentCourseName)
        df.loc[len(df.index)] = row
      elif len(row) == 6:
        row.append("")
        row.append("")
        row.append(0)
        row.append(currentCourseName)
        df.loc[len(df.index)] = row

  # creates map containing class and its corresponding conflicts with each class
  course_list = {}

  # adds number of conflicts for each class to the comparing class
  # creates a new filling row if conflicting class changes
  currentCourseName = df["conflictingCourseName"][0]
  fillingRow = {}
  for row in df.index:
    if (df["conflictingCourseName"][row] != currentCourseName):
      fillingRow = {}
      currentCourseName = df["conflictingCourseName"][row]
    fillingRow[df["courseName1"][row]] = df["courseRequests1"][row]
    fillingRow[df["courseName2"][row]] = df["courseRequests2"][row]
    fillingRow[df["courseName3"][row]] = df["courseRequests3"][row]
    course_list[df["conflictingCourseName"][row]] = fillingRow

  # print(course_list['AP Calc BC'])

def get_number(Tclass: str, Cclass:str):
  if (Tclass == Cclass):
    return 0
  elif (course_list[Tclass][Cclass] != None):
    return course_list[Tclass][Cclass]



def calcPeriodConflicts(period: list):
  conflict_number = 0
  for i in range(len(period)):
    for j in range(i + 1, len(period)):
      # print(course_list[period[i]][period[j]])
      conflict_number += int(course_list[period[i]][period[j]])
  return conflict_number


if __name__ == "__main__":
  main()

  # mock data
  print(calcPeriodConflicts(['AP Calc BC', 'AVID Tutor', 'AP Stat']))