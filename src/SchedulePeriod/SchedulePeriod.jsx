import styles from './SchedulePeriod.module.css'

function schedule_period({ period, classes }) {
    return (
        <div id={styles.schedulePeriod}>
            <div id={styles.periodIdentifier}>
                Period {period}
            </div>
            {classes.map((schedule_class, i) => {
                return (
                    <div key={i} className={styles.scheduleClass}>
                        {schedule_class}
                    </div>
                );
            })}
        </div>
    )
}

export default schedule_period
