import pandas as pd
import os

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
    self.course_list = {}
  
  def parseFile(self):
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
          self.df.loc[len(self.df.index)] = row
        elif len(row) == 6:
          row.append("")
          row.append("")
          row.append(0)
          row.append(currentCourseName)
          self.df.loc[len(self.df.index)] = row
        elif len(row) == 3 and row[-1].isdigit():
          row.append("")
          row.append("")
          row.append(0)
          row.append("")
          row.append("")
          row.append(0)
          row.append(currentCourseName)
          self.df.loc[len(self.df.index)] = row


      # adds number of conflicts for each class to the comparing class
      # creates a new filling row if conflicting class changes
      currentCourseName = self.df["conflictingCourseName"][0]
      fillingRow = {}
      for row in self.df.index:
        if (self.df["conflictingCourseName"][row] != currentCourseName):
          fillingRow = {}
          currentCourseName = self.df["conflictingCourseName"][row]
        fillingRow[self.df["courseName1"][row]] = self.df["courseRequests1"][row]
        fillingRow[self.df["courseName2"][row]] = self.df["courseRequests2"][row]
        fillingRow[self.df["courseName3"][row]] = self.df["courseRequests3"][row]
        self.course_list[self.df["conflictingCourseName"][row]] = fillingRow

    print("File Parsed")
  
  def get_number(self, Tclass: str, Cclass:str):
    if (Tclass == Cclass):
      return 0
    elif (self.course_list[Tclass][Cclass] != None):
      return self.course_list[Tclass][Cclass]
  
  def calcPeriodConflicts(self, period: list):
    conflict_number = 0
    for i in range(len(period)):
        for j in range(i + 1, len(period)):
            if period[j] not in self.course_list[period[i]]:
                continue
            conflict_number += int(self.course_list[period[i]][period[j]])
    return conflict_number

if __name__ == "__main__":
  main = ConflictCalculator()
  main.parseFile()
  # mock data
  print(main.course_list)
  print(main.calcPeriodConflicts(["AP Calc BC", "Adv Comp Sci", "AP Physics I", "AP Chem", "AP Calc BC", "American Lit H"]))
  assert main.calcPeriodConflicts(['AP Calc BC', 'AVID Tutor', 'AP Stat']) == 51
  print("Testing data is calculated correctly")
