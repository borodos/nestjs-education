export default () => ({
  saltOrRounds: Number(process.env.SALT_OR_ROUNDS) || 10,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  dbUrl: process.env.DATABASE_URL,
});
