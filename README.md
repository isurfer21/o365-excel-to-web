# o365-excel-to-web

A web based tool to serve excelsheet as HTML grid like spreadsheet or as JSON response via API.

## Prerequisite

Get the composer installed on the sytem from [https://getcomposer.org/download/](https://getcomposer.org/download/) for ease of use.

## Setup

To install dependencies, execute this in your project root.

	php composer.phar install

## Starting a server

It will treat current directory as the document root directory and if a request does not specify a file, then either index.php or index.html in the given directory are served. You will be able to visit the site via URL localhost:8000 as the URL from any browser.

	php -S localhost:8888

or, using composer

	php composer.phar run start

Alternatively, you can host this app on Apache server with PHP support.

### Test

To test whether the app is running properly, run this command via composer

	php composer.phar run test

It should first launch the default browser and open the URL where the excel data should get rendered in grid. After that an API gets called via CLI using cURL tool that should print the JSON response on terminal.

## Usage 

It can be used as web based application to serve the excel content as spreadsheet grid over HTML. Alternatively it can serve excel content as JSON in response to API request.

### Webapp

To view the content of the excel as HTML grid based spreadsheet, visit this link [http://localhost:8888/?ws=jira](http://localhost:8888/?ws=jira)

Here, `jira` could be replaced with any short name that you can give to the serving content of your excelsheet.

### Web API

To get the content of the excel as JSON response, visit this link [http://localhost:8888/ws/jira](http://localhost:8888/ws/jira)

Here, `jira` could be replaced with any short name that you can give to the serving content of your excelsheet.

## Add new excelsheet

To add new excelsheet, follow these steps:

1. Add the relative path to access that new excelsheet in the `\ws\config.php`.
2. Create a new route in `/ws/index.php` along with copy of `jira` method in `Tracker` class & customize accordingly.

