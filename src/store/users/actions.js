import * as types from "./mutation-types";
export default {
  usersAction({ commit }, params) {
    commit(types.SET_USERNAME, params.username);
    commit(types.SET_USERLEVEL, params.userlevel);
  }
};