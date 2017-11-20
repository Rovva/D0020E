# Road Condition Monitoring RCM
##### Also known as SWIMDS Project
###### FYI I didn't write the frontend #dontjudge
![swimds](swimds.png)

## Requirements

Debian/Ubuntu
```
apt-get update
apt-get install git docker
```

Fedora/CentOS/Redhat
```
yum/dnf clean all
yum/dnf install git docker
```

## Installation
The installation of the web app is done by using docker. Currently all the containers are created seperately, this should probably be changed into a single docker-compose file, but that's how it is. For now.

### Default
```
git clone https://github.com/kitzin/Road-Condition-Monitoring
cd Road-Condition-Monitoring && ./deploy
```

### Development
```
git clone https://github.com/kitzin/Road-Condition-Monitoring
cd Road-Condition-Monitoring && ./deploy-dev
```
In development deployment the Git directory will be linked into the container so any changes in this directory will be changed automagically in the container.
Anything changed in the frontend will not require a restart of the app. 
If you change anything in the backend, you will have to restart the app via docker.
To restart the container run `docker restart rcm-web` in your terminal.

### For all
The database import is done under `scripts/` the `scripts/connection.js` connects to the remote SQL database. The host, user, password, and database needs to be entered there for the import to work.


## Error
Here are some errors that might happen.
### Database pull
If the database extration to elasticsearch fails, then run `docker start -a rcm-pull`.

## Restart Application
```
docker restart rcm-web
```

## Development
Here are some information about continuing the development of this project.

### [test/](test/)
Tests for checking backend response data for specific filters.

### [app/client](app/client)
Source code for the web frontend.

### [app/server](app/server)
Source code for the `nodejs` backend.


###### Build by Emil Kitti, Rasmus Hartman, Tobias Axelsson, Oscar Saándström, Anton Lundqvist and Johan Kannel.
