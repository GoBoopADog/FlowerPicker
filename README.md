# FlowerPicker
This project is for getting information from a rhythm game website.

> [!WARNING]
> PLEASE be sure to respect ratelimits when using this package!! I am not responsible for any accidental misuse nor anything that may result from the use of FlowerPicker.

## Getting Started
Below is some example code with their explanations to get started:
```js
import FlowerPicker, { convert, convertTypes, errorTypes, scorelogJsonTypes } from "flowerpicker";
import fs from 'fs';

// The constructor has 2 parameters: The url to the server dashboard, and your cookie to said dashboard
const SESSION_COOKIE = "service_session=abc123";
const picker = new FlowerPicker('https://server.link', SESSION_COOKIE);

try {
    // This verifies the validity of your session cookie and throws an error if it's invalid
    await picker.setup();
} catch (e) {
    if (e instanceof errorTypes.InvalidSessionCookieError) {
        console.error("Invalid session cookie provided, please check it and try again.");
    }
};

// Get all jubeat scores for profile ID 12345678 between when this is run and January 1st 2026
const scores: scorelogJsonTypes.JubeatDataRawJSON[] = await picker.getScoreLog("jubeat", "12345678", {
    fetchDownTo: new Date("2026-01-01T00:00:00Z").getTime(), // This field is not required! Not putting it will simply fetch all the scores for that user
});
console.log(`Fetched ${scores.length} scores.`);

// To convert an export to a tachi-compatible JSON, you can use the convert module
const convertedJubeat: convertTypes.BatchManualJSONJubeat = await convert.jubeatToTachiCompat(scores, {
    service: "FlowerPicker",
});

// Then feel free to do whatever you want with it!
fs.writeFileSync(`./jubeat-scorelog-tachi.json`, JSON.stringify(convertedJubeat, null, 4), 'utf-8');
```

## Game Support
The following games may not be updated by me, PRs may be reviewed and accepted

| Game                            | Score Log | Tachi Export |
| :------------------------------ | :-------: | :----------: |
| Jubeat                          |     ✅     |      ✅       |
| pop'n music                     |     ✅     |      ✅       |
| MÚSECA                          |   ✅[^1]   |      ✅       |
| GITADORA                        |     ✅     |      ✅       |
| DanceDanceRevolution            |     ✅     |      ✅       |
| Sound Voltex                    |     ❌     |      ❌       |
| beatmania IIDX                  |     ❌     |      ❌       |
| NOSTALGIA                       |     ✅     |      -       |
| REFLEC BEAT                     |     ❌     |      -       |
| DANCERUSH STARDOM               |     ❌     |      -       |
| PASELI Charging Machine (Soon™️) |     ❌     |      ❌       |

[^1]: Does not get the graficas from a mission, otherwise gets everything else

The following games will most likely never be supported by me (If they even can be)
* BeatStream

> [!NOTE]
> This package was made in mind for the non US version of the server/dashboard. If you try to use this package for the US server, you may run into issues!