import app from './app';
import { logger } from './util/Logger';

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  logger.info(`app started on port ${app.get('port')}`);
});

export default server;