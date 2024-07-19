# FlowerPicker
This project is for getting information from a rhythm game website.

> [!NOTE]
> This package was made in mind for the non US version of the server/dashboard. If you try to use this package for the US server, you may run into issues!

## Getting Started
Currently only Jubeat is supported as far as games go.

Below is some example code with their explanations to get started:
```js
import FlowerPicker from "../FlowerPicker/index.js";

// The constructor has 2 parameters: The url to the server dashboard, and your cookie to said dashboard
const SESSION_COOKIE = "abc123";
const picker = new FlowerPicker('https://server.link', SESSION_COOKIE);

// This verifies the validity of your session cookie and populates the info necessary for the package to function
// (Besides game IDs, it also gets the info mentioned under the supported data)
await picker.setup();

// This is an example of how to populate a score log for a game. Currently only Jubeat is supported
await picker.setupJubeatScoreLog();

// This is an example of how to export the score log from the package to a text file
// Temporarily incredibly scuffed as I get the basic functionality up and running
fs.writeFileSync(`./data/data-${Date.now()}-${picker._gameScoreLogs.jubeat.length}.json`, JSON.stringify(picker._gameScoreLogs.jubeat, null, 2) , 'utf-8');
```

## Supported data (Accessible via the package)
The following account information is accessible via this package:
* Account ID
* Profile ID
* Account Petal Wallet IDs ( [arcadeName, walletID, walletBalance] )
* Profile Info
  * Name
  * Email
  * Home arcade
  * Date of your first play

The following games may not be updated by me, PRs may be reviewed and accepted

| Game                            | Profile Information[^1] | Score Log | Game Specific Data |
| :------------------------------ | :---------------------: | :-------: | :----------------: |
| beatmania IIDX                  |            ❌            |     ❌     |         ❌          |
| DanceDanceRevolution            |            ❌            |     ❌     |         ❌          |
| GITADORA                        |            ❌            |     ❌     |         ❌          |
| Jubeat                          |          ⚠️[^2]          |     ✅     |       ❌[^3]        |
| NOSTALGIA                       |            ❌            |     ❌     |         ❌          |
| pop'n music                     |            ❌            |     ❌     |         ❌          |
| REFLEC BEAT                     |            ❌            |     ❌     |         ❌          |
| Sound Voltex                    |            ❌            |     ❌     |         ❌          |
| PASELI Charging Machine (Soon™️) |            ❌            |     ❌     |         ❌          |

[^1]: Profile information includes profile id(s) on the site, game display name, and unlock statuses

[^2]: Reading the status of hte unlock  are not currently implemented

[^3]: The Jubility table may or may not be done at a later time


The following games will most likely never be supported by me
* Beatstream
* DanceEvolution ARCADE
* DANCERUSH
* Future TomTom
* GuitarFreaks & DrumMania
* HELLO! POP'N MUSIC
* MÚSECA