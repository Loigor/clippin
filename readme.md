# Clippin (or whatever)

## Getting Started

### Start
```docker-compose up``` in project root, or ```docker-compose up --build``` for build/rebuild (needed if container / copied content changes). ```-d``` for detatch.
```docker-compose up --build analyzer backend``` for example to rebuild analyzer and backend only.
### Stop
ctrl+c or ```docker-compose down``` 
### Logs
```docker-compose logs``` for logs all and ```docker-compose logs backend``` for only backend logs etc...