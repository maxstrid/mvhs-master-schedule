import unittest

from .conflict_calc import ConflictCalculator

class TestConflictCalculator(unittest.TestCase):
    def test_three_classes(self):
        calculator = ConflictCalculator()
        calculator.parseFile()
        self.assertEqual(calculator.calcPeriodConflicts(['AP Calc BC', 'AVID Tutor', 'AP Stat']), 51)

    def test_period(self):
        calculator = ConflictCalculator()
        calculator.parseFile()
        self.assertEqual(calculator.calcPeriodConflicts(["AP Calc BC", "Adv Comp Sci", "AP Physics I", "AP Chem", "AP Calc BC", "American Lit H"]), 755)
        self.assertEqual(calculator.calcPeriodConflicts(["Geometry", "AP Comp Sci A", "Digital Art Img", "Adv Comp Sci", "AP Calc BC", "American Lit H"]), 165)

if __name__ == '__main__':
    unittest.main()
