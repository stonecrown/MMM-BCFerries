# MMM-BCFerries

This module displays the current info for scheduled sailings of a specified BC Ferries route,<br>including departure time, vehicle deck space fill, vessel name and status.<br>

![MMM-BCFerries--preview](https://user-images.githubusercontent.com/54690747/194432750-0292c87d-e77f-4411-8317-54c117a1fc04.jpg)


## Usage 

You need to install the module for your MagicMirror.

### Installation

Navigate into your MagicMirror's modules folder:

```shell
cd ~/MagicMirror/modules
```
Clone this repository:
```shell
git clone https://github.com/stonecrown/MMM-BCFerries
```
Configure the module in your config.js file.

### Configuration

Add module configuration to config.js.

example `config.js`:

```js
{
  module: 'MMM-BCFerries',
  position: 'top_right',
  header: 'BC Ferries Sailings',
  config: {
    debug: false,
    maxWidth: "360px",
    customHeader: "BC Ferries Sailings",  // default header is "FERRY SAILINGS"
    termCodeDep: "LNG",  // *required* ferry departure terminal code
    termCodeDst: "HSB",  // *required* ferry destination terminal code
    maxResults: 8,            // optional - limit the number of results to display.
    showFillSplit: true, // display current filled space (percentage) for standard vehicle vs. oversize vehicle decks
    showVesselName: true
  }
},
```

|Option|Description|
|---|---|
|`termCodeDep`| **Required** Ferry departure terminal: specify with 3-letter code for use in BC Ferries API).<br><br>**Type:** `string` <br>**Possible values:** see ferry terminal codes below.|
|`termCodeDst`| **Required** Ferry departure terminal: specify with 3-letter code for use in BC Ferries API).<br><br>**Type:** `string` <br>**Possible values:** see ferry terminal codes below.|
|`maxResults`|Maximum number of sailings to display.<br><br>**Type:** `integer`<br> **Default value:** `10`|
|`updateInterval`|Frequency of refresh (in minutes) of ferry sailings info<br><br>**Type:** `integer`<br> **Default value:** `5`|
|`animationSpeed`|Speed of the update animation (in milliseconds)<br><br>**Type:** `integer` <br>**Possible values:**`0` - `5000`<br> **Default value:** `2000` (2 seconds)|
|`customHeader`|Additional text to prefix route info in module header.<br>NOTE: Route (Departure -> Destination) is ALWAYS shown in header<br><br>**Type:** `string` <br> **Default value:** ``|
|`maxWidth`|Maximum width of the displayed module in pixels. Unlimited when set to `0`.<br>This option can be used to make the module narrower, if required. <br><br>**Type:** `integer` <br> **Default value** `400`|
|`fade`|Enable fade of displayed rows in listed result(s) <br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `true` |
|`fadePoint`|Position (percentage) in listed results at which to start fade.<br><br>**Type:** `float` <br>**Possible values:** `0` (top of list) - `1` (bottom of list) <br> **Default value:** `0.25`|
|`colour`|Enable colour text in displayifor filled space perecntages when nearing deck vehicle capacity.<br><br>**Type:** `boolean` <br> **Default value:** `true`|
|`showFillSplit`|Enable display of percentage filled space for standard vehicle (car/can/suv) vs. oversize vehicle (car/van/suv/truck/bus/rv) parking decks.<br><br>**Type:** `boolean` <br><br>**Possible values:** `true` or `false` <br> **Default value:** `false`|
|`debug`|Enable debug messages to be sent to console log. <br><br>**Type:** `boolean` <br>**Possible values:** `true` or `false` <br> **Default value:** `false`|

#### ferry terminal codes ####
Valid 3-letter terminal codes for use with the BC Ferries API call are as follows:
```
"TSA" -> Tsawwassen<
"SWB" -> Swartz Bay
"SGI" -> Southern Gulf Islands*
"DUK" -> Duke Point (Nanaimo)
"FUL" -> Fulford Harbour (Salt Spring Island)*
"HSB" -> Horseshoe Bay
"NAN" -> Departure Bay (Nanaimo)
"LNG" -> Langdale
"BOW" -> Bowen Island*

  * asterisked items indicate codes that can be used only to specify the destination terminal (not departure).
  Note also that a destination terminal must correspond with its departure terminal, <br>otherwise API will return an error result.
```



