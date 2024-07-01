const a = [
    { name: '已打卡', value: 1, backgroundColor: '#3B81F4' },
    { name: '未打卡', value:2, backgroundColor: '#FF8F1F' },
    { name: '迟到', value:3, backgroundColor: '#FF8F1F' },
    { name: '早退', value: 4, backgroundColor: '#8A38F5' },
    { name: '异常考勤',value: 4, backgroundColor: '#EB2F96' },
    { name: '旷工', value:6, backgroundColor: '#FA5151' },
]
const result = a.map(item => {
    const { backgroundColor, ...rest } = item;
    return rest;
});

console.log(result);
