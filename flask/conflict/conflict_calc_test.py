import unittest

from .conflict_calc import ConflictCalculator

class TestConflictCalculator(unittest.TestCase):
    def test_three_classes(self):
        calculator = ConflictCalculator()
        calculator.parseFile()
        self.assertEqual(calculator.calcPeriodConflicts(['AP Calc BC', 'AVID Tutor', 'AP Stat']), 51)

if __name__ == '__main__':
    unittest.main()
