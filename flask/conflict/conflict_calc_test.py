import unittest

from .conflict_calc import ConflictCalculator


class TestConflictCalculator(unittest.TestCase):

    def test_three_classes(self):
        calculator = ConflictCalculator()

        self.assertEqual(
            calculator.calculate_period_conflicts(
                ['AA5011', 'HO0070', 'AA6010']), 51)

    def test_period(self):
        calculator = ConflictCalculator()
        self.assertEqual(
            calculator.calculate_period_conflicts([
                str(calculator.course_id("AP Calc BC")),
                str(calculator.course_id("Adv Comp Sci")),
                str(calculator.course_id("AP Physics I")),
                str(calculator.course_id("AP Chem")),
                str(calculator.course_id("American Lit H"))
            ]), 372)
        self.assertEqual(
            calculator.calculate_period_conflicts([
                str(calculator.course_id("Geometry")),
                str(calculator.course_id("AP Comp Sci A")),
                str(calculator.course_id("Digital Art Img")),
                str(calculator.course_id("Adv Comp Sci")),
                str(calculator.course_id("AP Calc BC")),
                str(calculator.course_id("American Lit H"))
            ]), 165)


if __name__ == '__main__':
    unittest.main()
