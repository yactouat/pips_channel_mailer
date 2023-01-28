# pips_channel_mailer_service

<!-- TOC -->

- [pips_channel_mailer_service](#pips_channel_mailer_service)
  - [what is this ?](#what-is-this-)
  - [pre requisites](#pre-requisites)
  - [how to run](#how-to-run)
  - [GCP project](#gcp-project)
    - [the actual stuff](#the-actual-stuff)
    - [the SDK](#the-sdk)
  - [Contributors](#contributors)

<!-- /TOC -->

## what is this ?

this repo holds the code for my PIPS mailer service, instead of using the Gmail API, it simply uses `msmtp` and a config file to send emails

## pre requisites

- a Gmail account
- a Google Cloud project
- a Google App' password for the Google Account that is used to send emails
- a standard Docker installation

## how to run

- create a `msmtprc` at the root of the folder after the example in `msmtprc.example`, this file is versioned by default, so do not commit it or its contents if you dont want the whole Internet to send emails on your behalf
- `docker compose up`

## GCP project

### the actual stuff

- you must have the `gcloud` CLI installed and configured to your GCP project (`gcloud auth application-default login` and `gcloud init` if it's not the case)

### the SDK

If you're running this in full local mode, you'll need to install the GCP SDK; I plan to do this in a not too distant future, but if you do it before me, I'd be happy to accept a PR !

## Contributors

a big thanks goes to the contributors of this project:

<table>
<tbody>
    <tr>
        <td align="center"><a href="https://github.com/yactouat"><img src="https://avatars.githubusercontent.com/u/37403808?v=4" width="100px;" alt="yactouat"/><br /><sub><b>Yactouat</b></sub></a><br /><a href="https://github.com/yactouat"></td>
    </tr>
</tbody>
</table>
