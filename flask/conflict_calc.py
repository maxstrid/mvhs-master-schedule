courseList = {}
classesList = []

with open("conflict_matrix.txt") as file:
  for line in list(file):
    courseInfo = line.split(",", 2)
    titleClass = courseInfo[1]
    courseConflicts = {}
    courseConflicts = courseList[titleClass]
    if courseConflicts is {}:
      classesList.append(titleClass)
    
    threeCourses: list[str] = line
    while (threeCourses != "") and not (threeCourses[0:8] == "Mountain"):
      info = threeCourses.split(",")
      for i in range(len(info)):
        if courseConflicts != {}:
          courseConflicts[info[i + 1]] = int(info[i + 2])
    
    courseList[titleClass] = courseConflicts

print(courseList)
print(classesList)