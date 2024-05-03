import unittest
import pprint

from .schedule_generator import ScheduleGenerator
from .conflict_calc import ConflictCalculator


class TestScheduleGenerator(unittest.TestCase):

    def test_full(self):
        calculator = ConflictCalculator()

        generator = ScheduleGenerator(calculator, calculator.course_list)

        schedule = generator.gen_schedule()

        #TODO(max): make this actually verify total conflicts are reasonable
        for period in schedule.values():
            print(calculator.named_list(list(period)),
                  calculator.calculate_period_conflicts(list(period)))


if __name__ == '__main__':
    unittest.main()
