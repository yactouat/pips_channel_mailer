# pips_channel_mailer_cloud-function

<!-- TOC -->

- [pips_channel_mailer_cloud-function](#pips_channel_mailer_cloud-function)
  - [what is this ?](#what-is-this-)
  - [pre requisites](#pre-requisites)
  - [GCP project](#gcp-project)
    - [the actual stuff](#the-actual-stuff)
    - [the SDK](#the-sdk)
  - [nice to have](#nice-to-have)
  - [how to use](#how-to-use)
  - [Contributors](#contributors)

<!-- /TOC -->

## what is this ?

this repo holds the code for my Google Cloud Function that is triggered when changes to the users resource occur. This is done in my PIPS via a push Pub/Sub subscription using EventArc. Its job is to parse the received the message and to call the PIPS mailer API (for now) in order to notify the given user that a change in his data happened.

the function does not allow unauthorized access, it's only triggered by a Pub/Sub topic updates happening in the GCP project

## pre requisites

- a Google Cloud project
- the relevant APIs enabled (Cloud Functions, Pub/Sub, etc.)

## GCP project

### the actual stuff

- a Google Cloud Platform (GCP) project
- you must have the `gcloud` CLI installed and configured to your GCP project (`gcloud auth application-default login` and `gcloud init` if it's not the case)

### the SDK

If you're running this in full local mode, you'll need to install the GCP SDK; I plan to do this in a not too distant future, but if you do it before me, I'd be happy to accept a PR !

## nice to have

- the Google Cloud official VSCode extension

## how to use

- just code and deploy, it's that simple
- required env vars are:
  - `MAILER_SERVICE_URL`, the URL of the mailer service which will actually send the email
  - `PIPS_TOKEN`, a token of your choice used to authenticate to the PIPS call to the mailer service

## Contributors

a big thanks goes to the contributors of this project:

<table>
<tbody>
    <tr>
        <td align="center"><a href="https://github.com/yactouat"><img src="https://avatars.githubusercontent.com/u/37403808?v=4" width="100px;" alt="yactouat"/><br /><sub><b>Yactouat</b></sub></a><br /><a href="https://github.com/yactouat"></td>
    </tr>
</tbody>
</table>
