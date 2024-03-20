import unittest

from schedule_generator import Graph, assign_classes

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

if __name__ == '__main__':
    unittest.main()
