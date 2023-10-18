export class Schedule {
    periods: number;
    columns: number;
    table: Class[][];

    constructor(periods: number, columns: number) {
        this.periods = periods;
        this.columns = columns;
        this.table = [];
        for (let i = 0; i < periods; i++) {
            let appendingRow: Class[] = [];
            for (let j = 0; j < columns; j++) {
                appendingRow.push(new Class("none", "none", 0, 0));
            }
            this.table.push(appendingRow);
        }
    }

    public getRow(index: number): Class[] {
        return this.table[index];
    }

    public getClass(period: number, column: number): Class {
        return this.table[period][column];
    }

    public getPeriods(): number {
        return this.periods;
    }

    public getColumns(): number {
        return this.columns;
    }
}

class Class {
    name: string;
    teacher: string;
    period: number;
    conflicts: number;

    constructor(name: string, teacher: string, period: number, conflicts: number) {
        this.name = name;
        this.teacher = teacher;
        this.period = period;
        this.conflicts = conflicts;
    }

    public getName(): string {
        return this.name;
    }

    public getTeacher(): string {
        return this.teacher;
    }

    public getPeriod(): number {
        return this.period;
    }

    public getConflicts(): number {
        return this.conflicts;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setTeacher(teacher: string) {
        this.teacher = teacher;
    }

    public setPeriod(period: number) {
        this.period = period;
    }

    public setConflicts(conflicts: number) {
        this.conflicts = conflicts;
    }
}

enum GradeNineClassType {
    SurveyComp = 'Survey Comp',
    EthnicStudies = 'Ethnic Studies',
    AlgebraOne = 'Algebra 1',
    Geometry = 'Geometry',
    Biology = 'Biology',
    BiologyH = 'Biology Honors',
    GeometryH = 'Geometry Honors',
    PE = 'Grade 9 PE',
    SpanishOne = 'Spanish I',
    SpanishTwo = 'Spanish II',
    SpanishTwoH = 'Spanish II Honors',
    FrenchOne = 'French I',
    FrenchTwo = 'French II',
    JapaneseOne = 'Japanese I',
    JapaneseTwo = 'Japanese II',
    MandarinOne = 'Mandarin I',
    MandarinTwo = 'Mandarin II'
}

enum GradeTenClassType {
    CompWorldLit = 'Comp World Lit',
    WorldStudies = 'World Studies',
    Geometry = 'Geometry',
    AlgebraTwo = 'Algebra II',
    Chemistry = 'Chemistry',
    ChemistryH = 'Chemistry Honors',
    AlgebraTwoH = 'Algebra II Honors',
    TotalFitness = 'Total Fitness',
    TeamSports = 'Team Sports',
    WeightTraining = 'Weight Training'
}