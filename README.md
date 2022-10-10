# MMM-BCFerries

This MagicMirror<sup>2</sup> module displays the current info for scheduled sailings of a specified BC Ferries route, including the departure time, vehicle deck space fill, vessel name and status.<br>

![MMM-BCFerries--preview](https://user-images.githubusercontent.com/54690747/194432750-0292c87d-e77f-4411-8317-54c117a1fc04.jpg)



## Installation
Navigate into your MagicMirror's modules folder:

```shell
cd ~/MagicMirror/modules
```
Clone this repository:
```shell
git clone https://github.com/stonecrown/MMM-BCFerries
```
Change to newly created folder and install dependencies:
```
cd MMM-BCFerries
npm install
```

## Using the module
To use this module, add the configuration block shown below into your MagicMirror config.js file and adjust the module options (noted in [Configuration](https://github.com/stonecrown/MMM-BCFerries#Configuration) section) to suit your requirements.  


```js
{
  module: 'MMM-BCFerries',
  position: 'top_right',
  header: 'BC Ferries Sailings',
  config: {
    debug: false,
    maxWidth: "360px",
    customHeader: "BC Ferries Sailings",  // default custom header is "" (none)
    termCodeDep: "LNG",  // *required* ferry departure terminal code
    termCodeDst: "HSB",  // *required* ferry destination terminal code
    maxResults: 8,       // optional - limit the number of results to display.
    showFillSplit: true, // display current filled space (percentage) for standard vehicle vs. oversize vehicle decks
    showVesselName: true
  }
},
```

## Configuration
The following options for this module can be included in config.js
|Option|Description|
|---|---|
|`termCodeDep`| **Required** Ferry departure terminal: specified as 3-letter code for use with BC Ferries API.<br><br>**Type:** `string` <br>**Possible values:** see [ferry terminal codes](https://github.com/stonecrown/MMM-BCFerries#ferry-terminal-codes) below.|
|`termCodeDst`| **Required** Ferry destination terminal: specified as 3-letter code for use with BC Ferries API.<br><br>**Type:** `string` <br>**Possible values:** see [ferry terminal codes](https://github.com/stonecrown/MMM-BCFerries#ferry-terminal-codes) below.|
|`maxResults`|Maximum number of sailings to display.<br><br>**Type:** `integer`<br> **Default value:** `10`|
|`updateInterval`|Period of time (in minutes) between refresh of ferry sailings data.<br><br>**Type:** `integer`<br> **Default value:** `5`|
|`animationSpeed`|Speed of the update animation (in milliseconds).<br><br>**Type:** `integer` <br>**Possible values:**`0` - `5000`<br> **Default value:** `2000` (2 seconds)|
|`customHeader`|Additional text to prefix route info in display of module header.<br>NOTE: The route (Departure -> Destination) info is always shown in header. <br><br>**Type:** `string` <br> **Default value:** ``|
|`maxWidth`|Maximum width of the displayed module in pixels. Unlimited when set to `0`.<br>This option can be used to make the module narrower, if required. <br><br>**Type:** `integer` <br> **Default value** `400`|
|`fade`|Enable fade-to-black in display of listed results. <br><br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `true` |
|`fadePoint`|Fractional start position at which to start fade of listed results.<br><br>**Type:** `float` <br>**Possible values:** between `0` (top of list) and `1` (bottom of list) <br> **Default value:** `0.25`|
|`colour`|Enable colour text in display of filled space percentages when nearing deck vehicle capacity.<br><br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `true`|
|`showFillSplit`|Enable display of percentage of filled space for standard vehicle [car/van/suv] vs. oversize vehicle [truck/bus/rv] parking decks. <br><br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `false`|
|`debug`|Enable debug messages to be sent to console log. <br><br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `false`|

### ferry terminal codes ###
This module requires that 3-letter codes be specified for *both* the departure and destination terminals
as these are used with the BC Ferries API to fetch the sailings info for a given route. 

Valid 3-letter codes for BC Ferries departure and destination terminals are as follows:
```
"TSA" -> Tsawwassen
"SWB" -> Swartz Bay
"SGI" -> Southern Gulf Islands *
"DUK" -> Duke Point (Nanaimo)
"FUL" -> Fulford Harbour (Salt Spring Island) *
"HSB" -> Horseshoe Bay
"NAN" -> Departure Bay (Nanaimo)
"LNG" -> Langdale
"BOW" -> Bowen Island *

  * asterisked items indicate codes that can be used only to specify the destination terminal (not departure).
  Note also that the destination terminal must correspond with its actual departure terminal, 
  otherwise the API will return an error result.
```

## Dependencies
- [request](https://www.npmjs.com/package/request) (installed via `npm install`)
- [BC Ferries API](https://www.bcferriesapi.ca/) &nbsp;  public access API - a key is not currently required.


## Thanks To...

- [Ricardo Gonzalez](https://github.com/ryck) for the [MMM-TFL-Arrivals](https://github.com/ryck/MMM-TFL-Arrivals) module, as a base for development of MMM-BCFerries.
- [Sam Pratt](https://github.com/samuel-pratt) for the [bc-ferries-api](https://github.com/samuel-pratt/bc-ferries-api) code and BC Ferries API service that this module depends on.
- [Michael Teeuw](https://github.com/MichMich) for the excellent [MagicMirror2](https://github.com/MichMich/MagicMirror/) framework.

