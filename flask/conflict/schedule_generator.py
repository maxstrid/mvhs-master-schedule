from conflict.conflict_calc import ConflictCalculator

Schedule = dict[int, set[str]]
Classlist = dict[str, dict[str, int]]


class Graph:

    def __init__(self) -> None:
        self.graph: dict[str, set[tuple[str, int]]] = {}

    def add(self, node: str) -> None:
        self.graph[node] = set()

    def add_edge(self, node_a: str, node_b: str, weight: int) -> None:
        if (node_a not in self.graph or node_b not in self.graph):
            pass

        self.graph[node_a].add((node_b, int(weight)))
        self.graph[node_b].add((node_a, int(weight)))

    def get(self, node: str) -> set[tuple[str, int]]:
        return self.graph[node]

    def contains(self, node: str):
        return node in self.graph

    def __iter__(self):
        return self.graph.__iter__()

    def __repr__(self) -> str:
        buffer: str = ""

        for node in self.graph:
            buffer += node + " -> "

            for i, (name, weight) in enumerate(self.graph[node]):
                buffer += name + ": " + str(weight)

                if i != len(self.graph[node]) - 1:
                    buffer += ", "

            buffer += '\n'

        return buffer


def create_graph(classes: dict[str, dict[str, int]]) -> Graph:
    class_graph = Graph()

    for node, conflicts in classes.items():
        if not class_graph.contains(node):
            class_graph.add(node.strip())

        for edge, conflict_num in conflicts.items():
            if not class_graph.contains(edge):
                class_graph.add(edge.strip())

            if edge == '':
                continue

            class_graph.add_edge(node.strip(), edge.strip(), conflict_num)

    return class_graph


class ScheduleGenerator:

    def __init__(self, calculator: ConflictCalculator, course_list: Classlist):
        self.calculator = calculator
        self.course_list = course_list

    def gen_schedule(self) -> Schedule:
        schedule_graph: Graph = self.__build_graph(self.course_list)

        # We define this here so we can call it more than once.
        def build_schedule() -> Schedule:
            schedule: Schedule = {}

            seen_classes: set[str] = set()

            for node in schedule_graph:
                sorted_classes = list(schedule_graph.get(node))
                # Orders the classses by ones with the most conflicts
                sorted_classes.sort(key=lambda x: x[1], reverse=True)

                # We iterate through each class and assign it to a class if it hasn't been assigned
                # This tries to make sure classes with the highest conflicts are assigned to different periods
                # TODO: Check this actually works as expected with a real schedule
                for i, item in enumerate(sorted_classes[0:5]):
                    if i not in schedule:
                        schedule[i] = set()

                    if item[0] in seen_classes:
                        continue

                    lowest_conflict_period = 0
                    lowest_conflict_num = 1e6

                    for i in range(0, 7):
                        if i not in schedule:
                            lowest_conflict_period = i
                            lowest_conflict_num = 0
                            break

                        schedule[i].add(item[0])

                        conflicts = self.calculator.calculate_period_conflicts(
                            list(schedule[i]))

                        if conflicts < lowest_conflict_num:
                            lowest_conflict_period = i
                            lowest_conflict_num = conflicts

                        schedule[i].remove(item[0])

                    seen_classes.add(item[0])

                    if lowest_conflict_period not in schedule:
                        schedule[lowest_conflict_period] = set()

                    schedule[lowest_conflict_period].add(item[0])

            return schedule

        best_schedule: Schedule = build_schedule()
        best_total_conflicts = self.__calc_total_conflicts(best_schedule)

        # We're going to try 10 schedules and see which one is the best.
        # TOOD(max): This could be done way better, this method is pretty much guess and check.
        for _ in range(0, 10):
            schedule: Schedule = build_schedule()

            total_conflicts = self.__calc_total_conflicts(schedule)

            if (total_conflicts < best_total_conflicts):
                best_total_conflicts = total_conflicts
                best_schedule = schedule

        return best_schedule

    def __calc_total_conflicts(self, schedule: Schedule) -> int:
        total_conflicts = 0

        for period in schedule.values():
            total_conflicts += self.calculator.calculate_period_conflicts(
                list(period))

        return total_conflicts

    def __build_graph(self, classes: Classlist) -> Graph:
        class_graph = Graph()

        for node, conflicts in classes.items():
            if not class_graph.contains(node):
                class_graph.add(node.strip())

            for edge, conflict_num in conflicts.items():
                if not class_graph.contains(edge):
                    class_graph.add(edge.strip())

                if edge == '':
                    continue

                class_graph.add_edge(node.strip(), edge.strip(), conflict_num)

        return class_graph


def assign_classes(graph: Graph, calculator: ConflictCalculator):
    schedule: Schedule = {}

    seen_classes: set[str] = set()

    for node in graph:
        sorted_classes = list(graph.get(node))
        # Orders the classses by ones with the most conflicts
        sorted_classes.sort(key=lambda x: x[1], reverse=True)

        # We iterate through each class and assign it to a class if it hasn't been assigned
        # This tries to make sure classes with the highest conflicts are assigned to different periods
        # TODO: Check this actually works as expected with a real schedule
        for i, item in enumerate(sorted_classes[0:5]):
            if i not in schedule:
                schedule[i] = set()

            if item[0] in seen_classes:
                continue

            lowest_conflict_period = 0
            lowest_conflict_num = 1e6

            for i in range(0, 6):
                if i not in schedule:
                    lowest_conflict_period = i
                    lowest_conflict_num = 0
                    break

                schedule[i].add(item[0])

                conflicts = calculator.calculate_period_conflicts(
                    list(schedule[i]))

                if conflicts < lowest_conflict_num:
                    lowest_conflict_period = i
                    lowest_conflict_num = conflicts

                schedule[i].remove(item[0])

            seen_classes.add(item[0])

            if lowest_conflict_period not in schedule:
                schedule[lowest_conflict_period] = set()

            schedule[lowest_conflict_period].add(item[0])

    return schedule
