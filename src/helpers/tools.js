
const groupByDay = (records)=>{
    return records.reduce((groups, rec) => {
        const date = rec.date.toISOString().split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(rec);
        return groups;
    }, {});
}

const fillRange = (start, end, value)=>{

    let startDate = new Date(start);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    let endDate = new Date(end);
    endDate.setDate(endDate.getDate()-1);
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate.setSeconds(59);
    endDate.setMilliseconds(999);
    while(startDate < endDate){
        const date = startDate.toISOString().split('T')[0];
        if (!value[date]) {
            value[date] = [];
        } 
        startDate.setDate(startDate.getDate() + 1);
    }

    return value;
}

const groupByDayArr = (startDate, endDate, records)=>{
    const grouped = groupByDay(records);
    return Object.keys(fillRange(startDate, endDate, grouped)).map((date) => {
        const total = grouped[date].reduce((sum, exp)=> sum + exp.cost, 0);
        return {
          date,
          data: grouped[date],
          total,
        };
    });   
}

module.exports.groupByDay = groupByDay;
module.exports.fillRange = fillRange;
module.exports.groupByDayArr = groupByDayArr;