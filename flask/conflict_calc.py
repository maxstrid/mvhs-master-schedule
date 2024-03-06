import pandas as pd
import os


def main():
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

  with open(filename, 'r') as file:
    counter = 0
    for line in file:
      if counter <= 1:
        counter += 1
        continue
      row = line.strip().split(",")
      if (len(row) == 9):
        df.loc[len(df.index)] = row
      elif len(row) == 6:
        row.append("")
        row.append("")
        row.append(0)
  print(df)

if __name__ == "__main__":
  main()