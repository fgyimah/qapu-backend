import { Server } from 'http';
import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
import bootstrapApp from './app';

(async () => {
  const app = bootstrapApp();

  await mongoose.connect(process.env.MONGO_URI!, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to databse');

  const server = new Server(app);
  const port = process.env.PORT || 4000;

  server.listen(port);

  server.on('listening', () => {
    console.log(`Server running on port ${port}`);
  });
})().catch((err) => {
  console.error(err);
});
