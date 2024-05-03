import unittest

# imports conflict calculator
# may need to remove leading . to test
from .conflict_calc import ConflictCalculator

class TestConflictCalculator(unittest.TestCase):
    # tests conflicts of three classes using ids
    def test_three_classes(self):
        calculator = ConflictCalculator()
        calculator.parseFile()

        self.assertEqual(calculator.calcPeriodConflicts(['AA5011', 'HO0070', 'AA6010']), 51)

    # tests two full periods of classes using names to check
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
