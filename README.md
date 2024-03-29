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

## Development Guide
### Define the mapapps remote base
Before you can run the project you have to define the mapapps.remote.base property in the pom.xml-file:
`<mapapps.remote.base>http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%</mapapps.remote.base>`

### Other methods to to define the mapapps.remote.base property.
1. Goal parameters
`mvn install -Dmapapps.remote.base=http://%YOURSERVER%/ct-mapapps-webapp-%VERSION%`

2. Build properties
Change the mapapps.remote.base in the build.properties file and run:
`mvn install -Denv=dev -Dlocal.configfile=%ABSOLUTEPATHTOPROJECTROOT%/build.properties`
