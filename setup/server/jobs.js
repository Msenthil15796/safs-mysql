// Imports
import schedule from 'node-schedule'

// App Imports
import { backup } from './database'

// Jobs
export default async function () {
  console.info('SETUP - Scheduling jobs..')

  // Job - Mongo Backup
  /*
  schedule.scheduleJob('0 0 * * *', async () => {
    backup()
  })
  */
}
