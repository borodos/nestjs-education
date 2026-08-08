export default () => ({
  saltOrRounds: Number(process.env.SALT_OR_ROUNDS) || 10,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  dbUrl: process.env.DATABASE_URL,
  minioUser: process.env.MINIO_ROOT_USER || '',
  minioPassword: process.env.MINIO_ROOT_PASSWORD || '',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT || ''),
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  defaultJobAttempts: 3,
  minioStorageUrl: process.env.MINIO_STORAGE_URL || '',
  defaultTTL: process.env.DEFAULT_TLL || '1m',
});
