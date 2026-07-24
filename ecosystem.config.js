module.exports = {
  apps: [
    {
      name: "rasodhara",
      script: "server.js",
      cwd: __dirname,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        UPLOADS_DIR: "/home/rasodhara/rasodhara-uploads",
      },
    },
  ],
};
