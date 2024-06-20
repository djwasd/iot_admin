import { useSettingStore } from '@/store';

interface ErrorMessages {
    [key: string]: string;
}

const settingStore = useSettingStore();

const getErrorMessage = (errorMessages: ErrorMessages) => {
    return errorMessages[settingStore.locale] ;
};

export const validatePassword = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
    const errorMessages: ErrorMessages = {
        'zh-cn': '密码必须为8-20位，包含字母、数字和符号中的至少两种!',
        'en': 'The password must be 8-20 digits, containing at least two types of letters, numbers, and symbols!',
    };
    const errorMessage = getErrorMessage(errorMessages);
    if (value === 'admin') {
        callback();
    } else  if (!/^.*(?=.{8,20})(?=.*[A-Za-z])(?=.*\d|.*[\W_]).*$/.test(value)) {
        callback(new Error(errorMessage));
    } else {
        callback();
    }
};

export const validate_serial = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
    const errorMessages: ErrorMessages = {
        'zh-cn': '只能输入字母和数字!',
        'en': 'Only letters and numbers can be entered',
    };
    const errorMessage = getErrorMessage(errorMessages);

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error(errorMessage));
    } else {
        callback();
    }
};

export const validateMobile = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
    const errorMessages: ErrorMessages = {
        'zh-cn': '请输入正确的账号，必须是手机号!',
        'en': 'Please enter the correct account, it must be a phone number!',
    };
    const errorMessage = getErrorMessage(errorMessages);

    if (value === 'admin') {
        callback();
    } else if (!/^1([3456789])[0-9]\d{8}$/.test(value)) {
        callback(new Error(errorMessage));
    } else {
        callback();
    }
};
export const validateIDCard = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
    // 允许输入为空
    if (!value) {
        callback();
        return;
    }

    const errorMessages: ErrorMessages = {
        'zh-cn': '请输入正确的身份证号码!',
        'en': 'Please enter a valid ID card number!',
    };
    const errorMessage = getErrorMessage(errorMessages);

    if (!/^\d{17}[\dXx]$/.test(value)) {
        callback(new Error(errorMessage));
    } else {
        callback();
    }
};
export const validatePhoneNumber = (
    rule: any,
    value: string,
    callback: (error?: Error) => void
) => {
    // 允许输入为空
    if (!value) {
        callback();
        return;
    }

    const errorMessages: ErrorMessages = {
        'zh-cn': '请输入正确的电话号码!',
        'en': 'Please enter a valid phone number!',
    };
    const errorMessage = getErrorMessage(errorMessages);

    if (!/^1([3456789])[0-9]\d{8}$/.test(value)) {
        callback(new Error(errorMessage));
    } else {
        callback();
    }
};
