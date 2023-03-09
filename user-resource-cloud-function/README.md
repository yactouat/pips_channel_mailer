# pips_channel_mailer_cloud-function

<!-- TOC -->

- [pips_channel_mailer_cloud-function](#pips_channel_mailer_cloud-function)
  - [what is this ?](#what-is-this-)
  - [pre requisites](#pre-requisites)
  - [using the SDK locally](#using-the-sdk-locally)
  - [how to use](#how-to-use)
  - [Contributors](#contributors)

<!-- /TOC -->

## what is this ?

this repo holds the code for my Google Cloud Function that is meant to be triggered when changes to the users resource occur throughout my PIPS (Portable Integrated Personal System). This is done in via a push Pub/Sub subscription using EventArc. Its job is to parse the received the message and to call the relevant APIs (for instance, a mailer) in order to notify other components in the system of data changes that happened to a user

the function does not allow unauthorized access, it's only triggered by a Pub/Sub topic updates happening in the GCP project

## pre requisites

- a Google Cloud project
- the relevant APIs enabled (Cloud Functions, Pub/Sub, etc.)

## using the SDK locally

If you're running this in full local mode, you'll need to install the GCP SDK; I plan to do this in a not too distant future, but if you do it before me, I'd be happy to accept a PR !

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
