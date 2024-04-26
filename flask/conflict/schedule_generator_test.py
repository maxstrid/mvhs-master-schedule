import unittest
import pprint

from .schedule_generator import ScheduleGenerator
from .conflict_calc import ConflictCalculator

class TestScheduleGenerator(unittest.TestCase):
    def test_full(self):
        calculator = ConflictCalculator()
        calculator.parseFile()

        generator = ScheduleGenerator(calculator)

        schedule = generator.gen_schedule()

        for period in schedule.values():
            print(period, calculator.calcPeriodConflicts(list(period)))

if __name__ == '__main__':
    unittest.main()
