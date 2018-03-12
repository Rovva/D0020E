# Road Condition Monitoring RCM

## Requirements

Debian/Ubuntu

### Docker

Installation varies slightly between versions, see

```
https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce
```

for installation guide.

## Installation
The installation of the web app is done by using docker. Currently all
the containers are created seperately, this should probably be changed
into a single docker-compose file, but that's how it is. For now.

### Default
```
git clone https://github.com/Rovva/D0020E
cd Road-Condition-Monitoring && ./deploy
```

## Data
Data gathered from 2018-03-05 to 2018-03-07 can be imported from ``` sql\table_plus_data.sql ```

### For all
The database import is done under `scripts/` the
`scripts/connection.js` connects to the remote SQL database. The host,
user, password, and database needs to be entered there for the import
to work.


## Error
Here are some errors that might happen.
### Database pull
If the database extration to elasticsearch fails, then run `docker
start -a rcm-pull`.

## Restart Application
```
docker restart rcm-web
```

## Rebuild Project
Use fast_restart to rebuild after changes.
```
./fast_restart
```


## Development
Here are some information about continuing the development of this project.

### [test/](test/)
Tests for checking backend response data for specific filters.

### [app/client](app/client)
Source code for the web frontend.

### [app/server](app/server)
Source code for the `nodejs` backend.


###### Build by  Christoffer Rova, Ludvig Isaksson, Christina Källkrans, Robin Rubindal and Anton Tiberg.
###### This project is based upon
https://github.com/kitzin/Road-Condition-Monitoring