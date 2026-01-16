# FlowerPicker
This project is for getting information from a rhythm game website.

> [!WARNING]
> PLEASE be sure to respect ratelimits when using this package!! I am not responsible for any accidental misuse nor anything that may result from the use of FlowerPicker.

## Getting Started
Currently only Jubeat is supported as far as games go.

Below is some example code with their explanations to get started:
```js
import fs from 'fs';
import FlowerPicker, { convert, error } from "flowerpicker";

// The constructor has 2 parameters: The url to the server dashboard, and your cookie to said dashboard
const SESSION_COOKIE = "service_session=abc123";
const picker = new FlowerPicker('https://server.link', SESSION_COOKIE);

try {
    // This verifies the validity of your session cookie and throws an error if it's invalid
    await picker.setup();

    // Get all jubeat scores for profile ID 12345678 between now and January 1st 2026 (Omitting the timestamp will simply get all of the scores)
    const scores = await picker.getScoreLog("jubeat", "12345678", 1767225600000);
    console.log(`Fetched ${scores.length} scores.`);

    // To convert an export to a tachi-compatible JSON, you can use the convert module
    const convertedJubeat = await convert.jubeatToTachiCompat(scores);

    // Then feel free to do whatever you want with it!
    fs.writeFileSync(`./jubeat-scorelog-tachi.json`, JSON.stringify(convertedJubeat, null, 4), 'utf-8');
} catch (e) {
    if (e instanceof error.InvalidSessionCookieError) {
        console.error("Invalid session cookie provided, please check it and try again.");
    }
};
```

The following games may not be updated by me, PRs may be reviewed and accepted

| Game                            | Profile Information[^1] | Score Log | Game Specific Data | Tachi Export |
| :------------------------------ | :---------------------: | :-------: | :----------------: | :----------: |
| Jubeat                          |            ❌            |     ✅     |         ❌          |      ✅       |
| pop'n music                     |            ❌            |     ✅     |         ❌          |      ✅       |
| NOSTALGIA                       |            ❌            |     ❌     |         ❌          |      ❌       |
| MÚSECA                          |            ❌            |     ❌     |         ❌          |      ❌       |
| beatmania IIDX                  |            ❌            |     ❌     |         ❌          |      ❌       |
| DanceDanceRevolution            |            ❌            |     ❌     |         ❌          |      ❌       |
| GITADORA                        |            ❌            |     ❌     |         ❌          |      ❌       |
| REFLEC BEAT                     |            ❌            |     ❌     |         ❌          |      ❌       |
| Sound Voltex                    |            ❌            |     ❌     |         ❌          |      ❌       |
| PASELI Charging Machine (Soon™️) |            ❌            |     ❌     |         ❌          |      ❌       |

[^1]: Profile information includes profile id(s) on the site, game display name, and unlock statuses

The following games will most likely never be supported by me
* Beatstream
* DANCERUSH

> [!NOTE]
> This package was made in mind for the non US version of the server/dashboard. If you try to use this package for the US server, you may run into issues!