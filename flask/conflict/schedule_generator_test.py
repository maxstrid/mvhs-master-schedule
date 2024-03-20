import unittest

from .schedule_generator import Graph, assign_classes

class TestScheduleGenerator(unittest.TestCase):
    def test_basic_schedule(self):
        graph = Graph()

        graph.add("a")
        graph.add("b")
        graph.add("c")

        graph.add_edge("a", "b", 1)
        graph.add_edge("a", "c", 100)
        graph.add_edge("b", "c", 100)

        self.assertEqual(assign_classes(graph), {
            0: {"c"},
            1: {"b", "a"}
        })

    def test_bigger_schedule(self):
        graph = Graph()

        graph.add("AP Calc BC")
        graph.add("Advanced CS")
        graph.add("AP Physics I")
        graph.add("Statistics")
        graph.add("Chemistry H")
        graph.add("American Lit H")

        graph.add_edge("AP Calc BC", "Advanced CS", 2)
        graph.add_edge("AP Calc BC", "AP Physics I", 18)
        graph.add_edge("AP Calc BC", "Statistics", 3)
        graph.add_edge("AP Calc BC", "Chemistry H", 2)
        graph.add_edge("AP Calc BC", "American Lit H", 15)

        graph.add_edge("Advanced CS", "AP Physics I", 37)
        graph.add_edge("Advanced CS", "Statistics", 1)
        graph.add_edge("Advanced CS", "Chemistry H", 5)
        graph.add_edge("Advanced CS", "American Lit H", 22)

        graph.add_edge("AP Physics I", "Statistics", 3)
        graph.add_edge("AP Physics I", "Chemistry H", 2)
        graph.add_edge("AP Physics I", "American Lit H", 64)

        graph.add_edge("Statistics", "Chemistry H", 1)
        graph.add_edge("Statistics", "American Lit H", 2)

        graph.add_edge("Chemistry H", "American Lit H", 1)

        print(assign_classes(graph))

if __name__ == '__main__':
    unittest.main()
