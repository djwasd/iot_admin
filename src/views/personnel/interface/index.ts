/**
 * PersonDTO
 */
export interface person_interface{
    /**
     * 地址
     */
    address?: string;
    /**
     * 银行卡
     */
    bankCard?: string;
    /**
     * 物理银行卡
     */
    bankPhysicsCard?: string;
    /**
     * 出生日期
     */
    birthday?: number;
    /**
     * 职业
     */
    craft?: string;
    /**
     * 有效结束时间戳
     */
    endTimestamp: number;
    /**
     * 人脸照片Id
     */
    facePicture?: '';
    /**
     * 身份证号
     */
    idNo?: string;
    /**
     * 身份证有效结束时间戳
     */
    idNoEndDateTimestamp?: number;
    /**
     * 身份证图片
     */
    idNoPicture?: number;
    /**
     * 身份证有效开始时间戳
     */
    idNoStartDateTimestamp?: number;
    /**
     * 签发机关
     */
    issuingAuthority?: string;
    /**
     * 姓名
     */
    name: string;
    /**
     * 民族
     */
    nation?: string;
    /**
     * 组织Id
     */
    organizationId: string;
    /**
     * 密码
     */
    password?: string;
    /**
     * IC卡集合
     */
    personCardList?: idCard[];
    /**
     * 联系电话
     */
    phone?: string;
    /**
     * 项目组织Id
     */
    plotId: any;
    /**
     * 职务
     */
    post?: string;
    /**
     * 性别
     */
    sex: number;
    /**
     * 有效开始时间戳
     */
    startTimestamp: number;
    [property: string]: any;
}

/**
 * 当前用户修改基础信息DTO
 */
export interface idCard {
    /**
     * 卡号
     */
    cardNo: string;
    /**
     * 卡密码
     */
    password?: string;
    [property: string]: any;
}
