interface AttendanceRuleScheduling { //考勤时间数组[固定班次和自由班制拥有
    endTimestamp: number;
    startTimestamp: number;
    week: string;
}
interface orgList { //考勤时间数组[固定班次和自由班制拥有
    isNewPersonAdd?:boolean
    orgId?:number[]
}
// 考勤规则加班规则新增Dto
export interface overtime {
    /**
     * 最小计时单位[1-半小时;2-一小时;3-半天;4-一天]
     */
    minTimeUnit?: number;
    /**
     * 下班后多久开始统计加班时长[单位: 分钟]
     */
    offDutyPassTime?: number;
    /**
     * 最短上班时长[单位: 分钟]
     */
    shortestTime?: number;
    /**
     * 类型[1-工作日;2-休息日;3-节假日]
     */
    type?: number;
    [property: string]: any;
}
export interface equipment  {
    /*** 设备Id*/
    deviceId?: number;
    /*** 设备Path*/
    devicePath?: string;
    [property: string]: any;
}
export interface RuleForm {
    name: string; //规则名称
    type: number;//考勤类型
    attendanceRuleSchedulingList?: AttendanceRuleScheduling[];  //考勤时间的
    isHolidayOff:boolean,
    specialWorkDateList?:number[],//考勤规则打卡日期数组
    specialNotWorkDateList?:number[],//考勤规则不用打卡日期数组
    personList?: number[];//人员集合
    orgList?: orgList[];
    attendanceRuleDeviceList?:equipment[]
    isOvertimeStat:boolean
    overtimeRuleList?: overtime[];
    shift_date:any,
    isAutomaticShiftAlignment:boolean,
    minWorkTime:number,
    isWorkingHoursLimit:boolean
}
