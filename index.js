import 'dotenv/config';
import app from './src/app.js';

process.on('unhandledRejection', (reason) => {
  console.error('[process] unhandledRejection', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[process] uncaughtException', err);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Rachits Auth Server is running on port ${PORT}`);
});
