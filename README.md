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

this repo holds the code for my Google Cloud Function that is triggered when a new user is created in my PIPS, its job is to parse the received the message and to call whatever code is responsible for sending the email to the user

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

## Contributors

a big thanks goes to the contributors of this project:

<table>
<tbody>
    <tr>
        <td align="center"><a href="https://github.com/yactouat"><img src="https://avatars.githubusercontent.com/u/37403808?v=4" width="100px;" alt="yactouat"/><br /><sub><b>Yactouat</b></sub></a><br /><a href="https://github.com/yactouat"></td>
    </tr>
</tbody>
</table>
