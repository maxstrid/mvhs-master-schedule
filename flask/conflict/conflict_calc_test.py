import unittest

from .conflict_calc import ConflictCalculator

class TestConflictCalculator(unittest.TestCase):
    def test_three_classes(self):
        calculator = ConflictCalculator()
        calculator.parseFile()

        self.assertEqual(calculator.calcPeriodConflicts(['AA5011', 'HO0070', 'AA6010']), 51)

    def test_period(self):
        calculator = ConflictCalculator()
        calculator.parseFile()
        self.assertEqual(calculator.calcPeriodConflicts(
            [
                calculator.course_id("AP Calc BC"),
                calculator.course_id("Adv Comp Sci"),
                calculator.course_id("AP Physics I"),
                calculator.course_id("AP Chem"),
                calculator.course_id("AP Calc BC"),
                calculator.course_id("American Lit H")]
            ), 755)
        self.assertEqual(calculator.calcPeriodConflicts(
            [
                calculator.course_id("Geometry"),
                calculator.course_id("AP Comp Sci A"),
                calculator.course_id("Digital Art Img"),
                calculator.course_id("Adv Comp Sci"),
                calculator.course_id("AP Calc BC"),
                calculator.course_id("American Lit H")]
            ), 165)

if __name__ == '__main__':
    unittest.main()
