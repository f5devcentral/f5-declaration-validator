import { validateDec, decType } from './utils';
import Logger from 'f5-conx-core/dist/logger';

// export the main validator function
export { validateDec as validate };
export { decType as f5DecType };

// export the run function for the cli commands
export {run} from '@oclif/core';

// instantiate and export logger for the rest of the app
export const conxLog = new Logger('F5_DECLARATION_VALIDATOR_LOG');
conxLog.console = true;