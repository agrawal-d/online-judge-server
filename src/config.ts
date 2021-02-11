const isDebug = function () {
  return process.env.NODE_ENV !== "production";
};

export default {
  GOOGLE_CLIENT_ID: "497952189297-045pmtaft7c5jee0artp34pv2285mrul.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "7NomMvWeataU5rK1LqbpG7pN",
  hostname: isDebug ? "http://localhost:3000" : "https://bits-judge.herokuapp.com",
};
