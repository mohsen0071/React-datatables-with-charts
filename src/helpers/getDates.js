import moment from "moment";
export function getISOWeekDates(
    isoWeekNum = 1,
    year = new Date().getFullYear()
) {
    let d = moment(
        String(year).padStart(4, "0") +
            "W" +
            String(isoWeekNum).padStart(2, "0")
    );
    for (var dates = [], i = 0; i < 7; i++) {
        dates.push(d.format("YYYY-MM-DD"));
        d.add(1, "day");
    }
    return dates;
}

export function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
export function getDayNameByDate(date) {
    let dateObj = new Date(date);
    let weekday = dateObj.toLocaleString("default", { weekday: "short" });
    return weekday;
}
