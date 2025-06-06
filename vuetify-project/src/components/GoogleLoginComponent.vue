<template>
  <div>
    <h1>{{ message }}</h1>
    <GoogleLogin
      :params="params"
      :renderParams="renderParams"
      :onSuccess="onSuccess"
      :onFailure="onFailure"
    ></GoogleLogin>
    <GoogleLogin :params="params" :logoutButton="true">Logout</GoogleLogin>
  </div>
</template>

<script>
import GoogleLogin from "vue-google-login";

export default {
  data() {
    return {
      message: "Google Login",
      params: {
        client_id:
          "7131457454-nlv7rol3b7tdlk1qd6ri9agndmqv0h6h.apps.googleusercontent.com",
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true,
      },
    };
  },
  methods: {
    onSuccess: function (params) {
      console.log(params.mc.id_token, "<<<< on success");
    },
    onFailure: function (params) {
      console.log(params, "<<<< on onFailure");
    },
  },
  components: {
    GoogleLogin,
  },
};
</script>

<style scoped></style>
