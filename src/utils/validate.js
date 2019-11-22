// 过过滤特殊字符
export function stripscript(s) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{ }【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}
// 验证邮箱的规则
var checkEmail = (rule, value, cb) => {
    // 验证邮箱的正则表达式
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    if (regEmail.test(value)) {
      // 合法的邮箱
      return cb()
    }
    cb(new Error('请输入合法的邮箱'))
}

// 验证邮箱的规则
export function validateEmail(s) {
    // 验证邮箱的正则表达式
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    if (regEmail.test(value)) {
        // 合法的邮箱
        return true
    }
    return false
}


// 验证手机号的规则
var checkMobile = (rule, value, cb) => {
    // 验证手机号的正则表达式
    const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (regMobile.test(value)) {
        return cb()
    }
    cb(new Error('请输入合法的手机号'))
}

// 验证手机号的规则
export function validateMobile(s) {
    // 验证手机号的正则表达式
    const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (regMobile.test(value)) {
        // 合法的手机号
        return true
    }
    return false
}