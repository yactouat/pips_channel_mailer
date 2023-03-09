# pips_channel_mailer_service

<!-- TOC -->

- [pips_channel_mailer_service](#pips_channel_mailer_service)
  - [what is this ?](#what-is-this-)
  - [pre requisites](#pre-requisites)
  - [how to run](#how-to-run)
  - [GCP project](#gcp-project)
    - [the actual stuff](#the-actual-stuff)
    - [the SDK](#the-sdk)
  - [CI/CD](#cicd)
  - [Contributors](#contributors)

<!-- /TOC -->

## what is this ?

this repo holds the code for my PIPS (Portable Integrated Personal System) mailer service, it simply uses `msmtp` and a config file to send emails

## pre requisites to use this app' as a template

- a GitHub repository
- a Gmail account
- a Google Cloud project
- a Google App' password for the Google Account that is used to send emails
- a standard Docker installation

## how to run

- create a `msmtprc` at the root of the folder after the example in `msmtprc.example`, this file is versioned by default, so do not commit it or its contents if you dont want the whole Internet to send emails on your behalf
- `docker compose up`
- if you want to try the wiring of `msmtp`, you can run `npm run send-email-dev` from within the container
- you will also need various env vars and secrets to use the app' (check out the Github Actions workflows for more details, and also the `.env.example` file)
- there is one controller, which listens to a POST call to `/`

  - input payload must look like =>

    ```json
    {
      "pipsToken": "some-token", // acts as a validation token, so that no unallowed API calls can be made to this service
      "userEmail": "myemail@domain.com", // the email address of the user, where the email will be sent
      "userModId": 1, // optional, contains the ID of the user profile modification that needs email confirmation
      "userTokenType": "User_Modification" // contains the type of user token that is to be used; tokens are used to select which kind of email to send to the user, can also be "User_Verification"
    }
    ```

  - the tokens system relies on the fact that this mailer API is called via Pub/Sub within the PIPS project; when this API receives a call, it creates a token for the user in the database and links that token to whatever operation is being performed (user verification, user profile modification, etc.); it then sends an email to the user with a link that contains the token; when the user clicks on the link, the token is validated and the operation is performed

  - success response looks like =>

    ```json
    {
      "msg": "mailer has processed input",
      "data": null
    }
    ```

- you can also run `sh test.sh` to run the dockerized integration tests

## GCP project

### the actual stuff

- you must have the `gcloud` CLI installed and configured to your GCP project (`gcloud auth application-default login` and `gcloud init` if it's not the case)

### the SDK

If you're running this in full local mode, you'll need to install the GCP SDK; I plan to do this in a not too distant future, but if you do it before me, I'd be happy to accept a PR !

## CI/CD

everything is done through Github Actions, there are 2 workflows:

- one for ci
- one for cd

tests are run on each pull request to main branch, app' is deployed to GCP Cloud Run on each new release

## Contributors

a big thanks goes to the contributors of this project:

<table>
<tbody>
    <tr>
        <td align="center"><a href="https://github.com/yactouat"><img src="https://avatars.githubusercontent.com/u/37403808?v=4" width="100px;" alt="yactouat"/><br /><sub><b>Yactouat</b></sub></a><br /><a href="https://github.com/yactouat"></td>
    </tr>
</tbody>
</table>
