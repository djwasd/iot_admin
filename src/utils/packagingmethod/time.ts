// 时间戳转时间  1715907600000 转 09:00:00
export function formatTimestartTimestamp(timestamp:any) {
    if (timestamp.startTime === 0) {
        return '休息';
    }
    const date = new Date(timestamp.startTime);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}
export function formatTimestamp(timestamp:any) {
    if (timestamp.endTime === 0) {
        return '休息';
    }
    const date = new Date(timestamp.endTime);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}

// 时间戳转时间  1715907600000 转 09:00:00
export function shiftTimestamp(timestamp:any) {
    if (timestamp.startTimestamp === 0) {
        return '休息';
    }
    const date = new Date(timestamp.start_time);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}
export function shiftTimestamp_end(timestamp:any) {
    if (timestamp.startTimestamp === 0) {
        return '休息';
    }
    const date = new Date(timestamp.end_time);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}


// 时间戳转时间  1715907600000 转 09:00:00
export function formatstartTime(timestamp:any) {
    if (timestamp.startTime === 0) {
        return '无';
    }
    const date = new Date(timestamp.startTime);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}
export function formatendTime(timestamp:any) {
    if (timestamp.endTime === 0) {
        return '无';
    }
    const date = new Date(timestamp.endTime);
    const formatter = new Intl.DateTimeFormat('default', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    return formatter.format(date);
}

export function formatTimes(timestamp:any) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export  function transformTimeStamps(array:any) {
    return array.map(item => {
        const transformedItem = { ...item }; // 创建一个副本以避免修改原始对象

        // 转换 endTime
        transformedItem.endTime = formatTimeStamp(item.endTime);

        // 转换 startTime
        transformedItem.startTime = formatTimeStamp(item.startTime);

        return transformedItem;
    });
}

 export  function formatTimeStamp(timestamp:any) {
    const time = new Date(timestamp);
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
// const a = [
//     {
//         "endTime": 1704038400000,
//         "startTime": 2082643199999,
//         "week": "周一"
//     },
//     {
//         "endTime": 1704038400000,
//         "startTime": 2082643199999,
//         "week": "周一"
//     }
// ]; 变成[
//   { endTime: '00:00:00', startTime: '23:59:59', week: '周一' },
//   { endTime: '00:00:00', startTime: '23:59:59', week: '周一' }
// ]

export function timeToTimestamp(timeString) { // 23:58:59变时间戳
    const date = new Date();
    date.setHours(parseInt(timeString.substr(0, 2), 10));
    date.setMinutes(parseInt(timeString.substr(3, 2), 10));
    date.setSeconds(parseInt(timeString.substr(6, 2), 10));
    return date.getTime();
}
//数组里面时间换时间戳
export  function convertTimeToTimestamp(timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    return date.getTime();
}

export function convertArrayToTimestamps(array) {
    return array.map(item => ({
        ...item,
        startTime: convertTimeToTimestamp(item.startTime),
        endTime: convertTimeToTimestamp(item.endTime)
    }));
}
//筛选相同一项做排除
export function replaceItem(data, newData) {
    const updatedData = [...data]; // 创建原始数据的副本，避免修改原始数据
    newData.forEach(newItem => {
        const matchingItemIndex = updatedData.findIndex(item => item.week === newItem.week);
        if (matchingItemIndex !== -1) {
            updatedData[matchingItemIndex] = newItem;
        }
    });
    return updatedData;
}
//找到两个数组中不同的一个做筛选
export function findDifferentItems(data1, data2) {
    const differentItems = [];

    data1.forEach(item1 => {
        const matchingItemIndex = data2.findIndex(item2 => item2.week === item1.week);

        if (matchingItemIndex === -1) {
            differentItems.push(item1);
        }
    });

    data2.forEach(item2 => {
        const matchingItemIndex = data1.findIndex(item1 => item1.week === item2.week);

        if (matchingItemIndex === -1) {
            differentItems.push(item2);
        }
    });

    return differentItems;
}
//时间戳转时间 1712160000000 2024-04-04 00:00.000

export function timestamp_to_time(timestamp:any) {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

    return formattedDate;
}

export function format_time(timestamp:any) {  ////时间戳转时间 1712160000000  00:00.000

    const date = new Date(timestamp);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    const formattedDateTime = `${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

//1717749465612   2024-05-07 15:44:25 单纯的时间戳转时间
export function format_data(timestamp:any) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
// 1718863248137 变成 { year: 2024, month: 6, day: 20 }
export function convertTimestampToYearMonth(timestamp:any) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 注意：月份从 0 开始，因此要加 1
    const day = date.getDate();

    return { year, month, day };
}
