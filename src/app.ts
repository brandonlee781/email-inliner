import express from 'express';
import * as bodyParser from 'body-parser';
import { logger } from './util/Logger';
import { RegistrableController } from './controllers/RegisterableController';
import { InlinerController } from './controllers/InlinerController';

const app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.info(`received ${req.method} ${req.originalUrl}`);
  next();
});

// setup express middleware logging and error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack);
  next(err);
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).send('Internal Server Error');
});

const inliner = new InlinerController();
inliner.register(app);

export default app;