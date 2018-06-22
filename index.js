const getOpt = require('node-getopt')
    .create([
        ['s', 'sp-url=<string>', 'sharepoint document library url'],
        ['u', 'sp-user=<string>', 'sharepoint login user name'],
        ['d', 'sp-domain=<string>', 'sharepoint login user domain.'],
        ['p', 'sp-password=<string>', 'sharepoint login password'],
        ['b', 's3-bucket=<string>', 's3 bucket'],
        ['r', 's3-path-prefix=<string>', 's3 path prefix'],
        ['a', 'aws-access-key-id=<string>', 'aws access key id'],
        ['k', 'aws-secret-access-key=<string>', 'aws secret access key'],
        ['c', 'cron-time-spec=<string>', 'cron time spec'],
        ['h', 'help', 'display this help']
    ])
    .bindHelp(
        'Usage: node ' + process.argv[1] + ' [Options]\n[Options]:\n[[OPTIONS]]'
    )
const args = getOpt.parseSystem()
const moveFile = require('./move-file')(args)
const cronTimeSpec = args.options['cron-time-spec'] || process.env.CRON_TIME_SPEC
if (!cronTimeSpec) {
    moveFile()
    return
}
const CronJob = require('cron').CronJob
new CronJob({
    cronTime: cronTimeSpec,
    onTick: moveFile,
    runOnInit: true,
    start: true
})