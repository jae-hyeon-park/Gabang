// 영어, 한글, 숫자 2~10자리
export const validateId = (id) => {
    const regex = /^[a-zA-Z가-힣0-9]{2,10}$/;
    return regex.test(id);
};

// 영어, 숫자, 특수문자 8~20자리
export const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return regex.test(password);
};

// 숫자 11~14자리
export const validateAccount = (account) => {
    const regex = /^[0-9]{11,14}$/;
    return regex.test(account);
}

// 숫자 11자리. 010|011|016으로 시작
export const validatePhoneNumber = (phoneNumber) => {
    const regex = /^(010|011|016)-\d{4}-\d{4}$/;
    return regex.test(phoneNumber);
}

// 한글 2~20자리
export const validateName = (name) => {
    const regex = /^[가-힣]{2,10}$/;
    return regex.test(name);
}

// 숫자 8자리
export const validateBirthdate = (birthdate) => {
    const regex = /^\d{8}$/; // 여기서 오타 수정: 'd' 앞에 '^'가 빠져있었습니다.
    return regex.test(birthdate);
}