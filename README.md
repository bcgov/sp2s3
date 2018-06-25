# sp2s3
Utility to move all files from a Sharepoint document library to s3, once or cron. Because Sharepoint supports extracting attachements of an incoming email to document library, the utility can automate extracting email attachments to s3 via Sharepoint.

Works for SharePoint 2010 and newer.

## Install
Choose one of the following verified methods

### From Source
Need latest git and nodejs
```bash
> git clone https://github.com/f-w/sp2s3.git
> cd sp2s3
> npm i
> node . <opts>
```

### Docker

```bash
> docker build -t sp2s3 https://github.com/f-w/sp2s3.git
> docker run sp2s3 npm start -- <opts>
```

### Openshift

```bash
> oc new-app https://github.com/f-w/sp2s3.git <-e ENV=VALUE> ...
```

## Usage
*sp2s3* takes following input parameters in the form of either command line option or environment variable, with command line option taking precedence

| Command Line Opt           | Environment Variable  | Mandatory | Description                                                                                                    |
|----------------------------|-----------------------|-----------|----------------------------------------------------------------------------------------------------------------|
| -s, --sp-url                | SP_URL                | Yes       | sharepoint document library url, for example  https://my-site/_vti_bin/ListData.svc/mydoclib                   |
| -u, --sp-user               | SP_USER               | Yes       | sharepoint login user name                                                                                     |
| -d, --sp-domain             | SP_DOMAIN             | Yes       | sharepoint login user domain                                                                                   |
| -p, --sp-password           | SP_PASSWORD           | Yes       | sharepoint login password                                                                                      |
| -b, --s3-bucket             | S3_BUCKET             | Yes       | s3 bucket                                                                                                      |
| -r, --s3-path-prefix        | S3_PATH_PREFIX        | Yes       | s3 path prefix                                                                                                 |
| -a, --aws-access-key-id     | AWS_ACCESS_KEY_ID     | Yes       | aws access key id                                                                                              |
| -k, --aws-secret-access-key | AWS_SECRET_ACCESS_KEY | Yes       | aws secret access key                                                                                          |
| -c, --cron-time-spec        | CRON_TIME_SPEC        | No        | [node cron patterns](https://github.com/kelektiv/node-cron#available-cron-patterns). If not set then run once |

## Limitations

* only NTLM authentication to sp is supported
* doesn't support sp recycle bin - files are permanently deleted from sp doc lib after successful uploading to s3, rather than moving to recycle bin
* folders are not deleted from sp doc lib after moving files
