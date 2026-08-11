export default () => ({
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  kafkaBrokerUrl: process.env.KAFKA_BARK_URL ?? 'localhost:9092',
  mongodbUrl: process.env.MONGODB_URL ?? 'mongodb://localhost',
});
