import * as types from "./mutation-types";

export default {
  [types.SET_USERNAME](state, data) {
    state.username = data;
  },
  [types.SET_USERLEVEL](state, data) {
    state.userlevel = data;
  }
};