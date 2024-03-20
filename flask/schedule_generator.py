from typing import Iterator

class Graph:
    def __init__(self) -> None:
        self.graph: dict[str, set[tuple[str, int]]] = {}

    def add(self, node: str) -> None:
        self.graph[node] = set();

    def add_edge(self, node_a: str, node_b: str, weight: int) -> None:
        if (node_a not in self.graph or node_b not in self.graph):
            pass
        
        self.graph[node_a].add((node_b, weight))
        self.graph[node_b].add((node_a, weight))
    
    def get(self, node: str) -> set[tuple[str, int]]:
        return self.graph[node]

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


def assign_classes(graph: Graph):
    schedule: dict[int, set[str]] = {}

    seen_classes: set[str] = set()

    for node in graph:
        sorted_classes = list(graph.get(node))
        sorted_classes.sort(key = lambda x: x[1], reverse = True)

        for i, item in enumerate(sorted_classes[0:5]):
            if i not in schedule:
                schedule[i] = set()

            if item[0] in seen_classes:
                continue

            seen_classes.add(item[0])

            schedule[i].add(item[0])

    return schedule
