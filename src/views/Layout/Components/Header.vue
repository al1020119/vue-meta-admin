<template>
  <div id="header-wrap">
    <div class="pull-left header-icon" @click="navMenuState">
      <svg-icon iconClass="menu" class="menu" />
    </div>
    <div class="pull-right">
      <div class="user-info pull-left">
        <!-- <el-button type="danger" class="biScreen">可视化大屏</el-button> -->
        <img src="../../../assets/images/face.jpg" alt />
        {{username}}
      </div>
      <div class="header-icon pull-left" @click="navExitAxtion">
        <svg-icon iconClass="exit" class="exit" />
      </div>
    </div>
  </div>
</template>

<script>

import { removeToken } from "@/api/services/cookie.js";
import { computed } from '@vue/composition-api';

import { mapGetters } from "vuex";

export default {
  name: "layoutHeader",
  setup(props, { root }) {
    const navMenuState = () => {
      root.$store.commit("SET_COLLAPSE");
    };
    const navExitAxtion = () => {
      removeToken();
      // 登录成功提示
      root.$router.push({ name: "Login" });
      // this.$message.success("恭喜你，登录成功");
    };
    return {
      navMenuState,
      navExitAxtion
    };
  },
  computed: {
      ...mapGetters("users",{username: "username",userlevel: "userlevel"})
  }
};
</script>

<style lang="scss" scoped>
@import "../../../styles/config.scss";
#header-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: $navMenu;
  height: 75px;
  background-color: #fff;
  line-height: 75px;
  @include webkit(box-shadow, 0 3px 16px 0 rgba(0, 0, 0, 0.1));
  @include webkit(transition, all 0.3s ease 0s);
}
.open {
  #header-wrap {
    left: $navMenu;
  }
}
.close {
  #header-wrap {
    left: $navMenuMin;
  }
}

.header-icon {
  padding: 0 32px;
  svg {
    margin-bottom: -8px;
    font-size: 25px;
    cursor: pointer;
  }
}
.user-info {
  height: 100%;
  padding: 0 32px;
  border-right: 1px solid #ededed;
  + .header-icon {
    padding: 0 28px;
  }
  img {
    display: inline-block;
    margin-bottom: -12px;
    margin-right: 18px;
    border-radius: 50px;
  }
}
.biScreen {
  margin-right: 30px;
}

</style>