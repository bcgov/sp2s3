const fs = require('fs')
const httpntlm = require('httpntlm')
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
        ['h', 'help', 'display this help']
    ])
    .bindHelp(
        'Usage: node ' + process.argv[1] + ' [Options]\n[Options]:\n[[OPTIONS]]'
    )
const args = getOpt.parseSystem()
const spUrl = args.options['sp-url'] || process.env.SP_URL
const spUser = args.options['sp-user'] || process.env.SP_USER
const spDomain = args.options['sp-domain'] || process.env.SP_DOMAIN
const spPassword = args.options['sp-password'] || process.env.SP_PASSWORD
const s3Bucket = args.options['s3-bucket'] || process.env.S3_BUCKET
const s3PathPrefix = args.options['s3-path-prefix'] || process.env.S3_PATH_PREFIX
const awsAccessKeyId = args.options['aws-access-key-id'] || process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = args.options['aws-secret-access-key'] || process.env.AWS_SECRET_ACCESS_KEY

const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
})
const s3 = new AWS.S3({ apiVersion: '2018-06-21' })

httpntlm.get({
    url: spUrl,
    username: spUser,
    password: spPassword,
    domain: spDomain
}, function (err, res) {
    if (err) {
        return err
    }
    let parseString = require('xml2js').parseString
    parseString(res.body, (err, result) => {
        result.feed.entry.forEach(e => {
            try {
                if (e["m:properties"][0]["d:ContentType"][0] !== "Document") {
                    // skip non-document items such as folders
                    return
                }
                httpntlm.get({
                    url: e.content[0].$.src,
                    username: spUser,
                    password: spPassword,
                    domain: spDomain,
                    binary: true
                }, function (err, response) {
                    if (err) {
                        return err
                    }
                    let filePath = decodeURIComponent(e.content[0].$.src)
                    let fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
                    s3.upload({
                        Bucket: s3Bucket,
                        Key: s3PathPrefix + `/${fileName}`,
                        Body: response.body
                    }, function (err, data) {
                        if (err) return console.log("error writing file")
                        console.log(data)
                        // delete sp file
                        httpntlm.delete({
                            url: e.id[0],
                            username: spUser,
                            password: spPassword,
                            domain: spDomain,
                        }, function (err, res) {
                            if (err) return console.log("error deleting file")
                            console.info(`successfully deleted file ${fileName}.`)
                        })
                    })
                })
            }
            catch (ex) {
            }
        })
    })
})