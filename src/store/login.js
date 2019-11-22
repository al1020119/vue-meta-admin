/**
 *  存放 登录 数据
 */
const login = {
    state: {
        auth_key: '',
        username: '',
        user_level: '',
        email: '',
        status: '',
        remarks: ''
    },
    getters: {
        auth_key() {
            return login.auth_key
        },
        username() {
            return login.username
        },
        user_level() {
            return login.user_level
        },
        email() {
            return login.email
        },
        status() {
            return login.status
        },
        remarks() {
            return login.remarks
        },
    },
    mutations: {  // 必须的  同步 没有回调处理事情
        saveAuthKey(state,auth_key) {
            state.auth_key = state.auth_key
        },
        saveUsername(state,username) {
            state.username = state.username
        },
        saveUserLevel(state,user_level) {
            state.user_level = state.user_level
        },
        saveEmail(state,email) {
            state.email = state.email
        },
        saveStatus(state,status) {
            state.status = state.status
        },
        saveRemarks(state,remarks) {
            state.remarks = state.remarks
        }
    }
}

export default login;
