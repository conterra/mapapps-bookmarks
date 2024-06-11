[![devnet-bundle-snapshot](https://github.com/conterra/mapapps-bookmarks/actions/workflows/devnet-bundle-snapshot.yml/badge.svg)](https://github.com/conterra/mapapps-bookmarks/actions/workflows/devnet-bundle-snapshot.yml)
![Static Badge](https://img.shields.io/badge/tested_for_map.apps-4.17.0-%20?labelColor=%233E464F&color=%232FC050)
# Bookmarks Bundle
The bookmarks bundle allows to store the extent of the map as several bookmarks.

![Screenshot App](https://github.com/conterra/mapapps-bookmarks/blob/main/screenshot.JPG)

## Sample App
https://demos.conterra.de/mapapps/resources/apps/downloads_bookmarks/index.html

## Installation Guide
**Requirement: map.apps 4.7.0**

[dn_bookmarks Documentation](https://github.com/conterra/mapapps-bookmarks/tree/main/src/main/js/bundles/dn_bookmarks)

## Quick start

Clone this project and ensure that you have all required dependencies installed correctly (see [Documentation](https://docs.conterra.de/en/mapapps/latest/developersguide/getting-started/set-up-development-environment.html)).

Then run the following commands from the project root directory to start a local development server:

```bash
# install all required node modules
$ mvn initialize

# start dev server
$ mvn compile -Denv=dev -Pinclude-mapapps-deps

# run unit tests
$ mvn test -P run-js-tests,include-mapapps-deps
```
