import moment from 'moment'
import CalendarHeatmap from "react-calendar-heatmap";
import styled from 'styled-components'
import 'react-calendar-heatmap/dist/styles.css'
import './CalendarGraph.css'


function CalendarGraph() {
    function currentStartDateAndEndDate() {
        const year = new Date().getFullYear();
        return [new Date(`${year}-01-01`), new Date(`${year}-12-31`)]
    }

    function createCalendarValues() {
        try {
            const keys = getKeys()
            const calendarValueObj = {}

            for (const key of keys) {
                const startTimes = getStartTimesFromKey(key)
                for (const date of startTimes) {
                    if (date in calendarValueObj) {
                        calendarValueObj[date] += 1
                    } else {
                        calendarValueObj[date] = 1
                    }
                }
            }

            const calendarValues = []
            Object.keys(calendarValueObj).sort().forEach(date => {
                calendarValues.push({ date, count: calendarValueObj[date] });
            });

            return calendarValues
        } catch (e) {
            return []
        }
    }

    function getKeys() {
        try {
            const keys = JSON.parse(localStorage.getItem('key'));
            return Object.keys(keys);
        } catch (e) {
            localStorage.removeItem('key')
        }
    }

    function getStartTimesFromKey(key) {
        try {
            const timelogs = JSON.parse(localStorage.getItem(key))
            const startTimes = timelogs.map(log => moment(log.startTime).format('YYYY-MM-DD'))
            return startTimes
        } catch (e) {
            localStorage.removeItem(key)
        }
    }

    const [startDate, endDate] = currentStartDateAndEndDate();
    return (
        <Container>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={createCalendarValues()}
                classForValue={(value) => {
                    if (!value) {
                        return 'color-empty';
                    }
                    if (value.count >= 8) return `color-scale-8`;
                    if (value.count > 0) return `color-scale-${value.count}`;
                }}
            />
        </Container>
    );
}

const Container = styled.div`
    width: 80%;
    max-width: 740px;
    margin-bottom: 20px;
`

export default CalendarGraph