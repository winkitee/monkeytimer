import moment from "moment";

export const zeroCreator = (v) => (v < 10 ? `0${v}` : v);

export const getDiffTimeString = (diffTime = 0, is_ms, is_string) => {
    let ms;
    if (is_ms) {
        ms = parseInt(
            diffTime < 10 ? diffTime : diffTime.toString().slice(-3, -1)
        );
        ms = zeroCreator(ms);
    }
    let s = parseInt(diffTime / 1000);
    let m = parseInt(s / 60);
    s = parseInt(s % 60);
    if (!is_string) s = zeroCreator(s);
    let h = parseInt(m / 60);
    if (!is_string) h = zeroCreator(h);
    m = parseInt(m % 60);
    if (!is_string) m = zeroCreator(m);

    if (is_string) {
        return `${h}h ${m}m ${s}s`;
    }

    if (is_ms) {
        return `${h}:${m}:${s}:${ms}`;
    }
    return `${h}:${m}:${s}`;
};

export const getTimelogString = (st, et) => {
    const date = moment(st).format("YYYY-MM-DD");
    const startAt = moment(st).format("HH:mm:ss");
    const endAt = moment(et).format("HH:mm:ss");
    const time = getDiffTimeString(et - st);
    return `${date} ${startAt} - ${endAt} | ${time}`;
};
