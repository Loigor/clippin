# Clippin
Audio sample and recordings management tool for producers and bands. 


## Features
* Upload samples to cloud :heavy_check_mark:
* * Analyze sample for tempo, genre, type, band etc. (tempo :heavy_check_mark:)
* * Generate waveforms :heavy_check_mark:
* * Suggestive tags (synth, bass, drum, 303 etc.)
* * Merge / Version control (file checksum)
* Play samples :heavy_check_mark:
* * Play / Stop :heavy_check_mark:
* * Cue play :heavy_check_mark:
* * Assign sample play to keyboard key (current sample with enter)
* Sample pack :heavy_check_mark:
* * Create / Edit pack :heavy_check_mark:
* * Upload to sample pack :heavy_check_mark:
* * Play sample pack recordings as multitrack (all recordings at the same time :heavy_check_mark:
* * Mute track :heavy_check_mark:
* * Solo track
* User management 
* * Sharing samples & packs
* Pick samples for test pattern (+ pattern generation)

## Services
* gateway (nginx gw for frontend & backend and cloud storage files)
* frontend (crapp)
* backend (api)
* analyzer (internal python analyzer with flask api)
* postgres 
* flyway (psql migrations)

## Database
![Alt text](db_diagram.png?raw=true "Database diagram")

## Getting Started

### Start
```docker-compose up``` in project root, or ```docker-compose up --build``` for build/rebuild (needed if container / copied content changes). ```-d``` for detatch.
```docker-compose up --build analyzer backend``` for example to rebuild analyzer and backend only.
### Stop
ctrl+c or ```docker-compose down``` 
### Logs
```docker-compose logs``` for logs all and ```docker-compose logs backend``` for only backend logs etc...