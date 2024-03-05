<p align="center">
  <div align="center">
    <img src="./images/icons/icon.svg" alt="Logo" style="width:200px">
  </div>
</p>

# Installation

To install the application, follow the steps below:

### 1. Copy Files
First copy the files contained in the `src/` directory to your web server.

### 2. Create Database

On your web server, create a database called "authentication".  Then, run [database/authentication.sql](database/authentication.sql) to create the required table structure.

## Configuration

Configuration for this application is handled primarily through the file [src/services/.env](src/services/.env)".  

### 1. Configure Paths

Configure the url to the client. This is the url of your web server plus any dereferences that are required to get to the index.html of the authentication app.  This url is used when sending emails for account activation.

```
APP_CLIENT_URL=
```

### 2. Configure Database

In order to connect with your database, make sure that the following fields are set properly:

```
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=authentication
DB_USERNAME=root
DB_PASSWORD=root
```

### 3. Configure Email

In order for this application to be able to send account verification or account recovery emails, an email server must be specified.  Make sure that the following fields are set properly:

```
MAIL_ENABLED=true
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=
MAIL_FROM_NAME=
```
