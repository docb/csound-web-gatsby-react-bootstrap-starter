# csound-web-gatsby-react-bootstrap-starter
This starter can be used to quickly setup a csound-web (v 6.16.1) project developed with react-bootstrap. 
This starter ships with a small csound instrument which generates sound with random spline waves.

## Quick start
1.  **What you need**
    Node.js 12+

1.  **Install gatsby cli**
    Gatsby is a static site generator for react with server side rendering.
    ```shell
    npm install -g gatsby-cli
    ```

1.  **Create a site.**

    ```shell
    # create a new Gatsby site using the csound-web-gatsby-react-bootstrap-starter starter
    gatsby new my_new_csound_web_project https://github.com/docb/csound-web-gatsby-react-bootstrap-starter
    ```
1.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my_new_csound_web_project
    gatsby develop
    ```
The csound webapp is now running at `http://localhost:8000`!
If all worked well you should see "Csound running". 

## What now?

### Highlevel
You can use this starter without any deeper js/react knowhow. The GUI of a csound instrument can be made by filling out a JS object
as shown in `src/pages/index.js`.
    
```jsx
import React from 'react'
import Layout from '../components/layout'
import CsoundInstr from '../components/lib/csoundinstr'
import Components from '../components/lib/components'
import { Row, Col } from "react-bootstrap";
import { withPrefix } from 'gatsby';
const IndexPage = () => {
      const inst = {
         components:[
                { type: 'panel', label: 'morph', id: 'morph', widgets: [
                  { id: 'weight', type: 'fader', label: 'WGT', min: 0, max: 1, step: 0.01, defval: 0.5 , height: 200},
                  { id: 'xy', idx:'num1',idy:'num2',type: 'xy', label: 'mix', minX: 0, maxX: 3.99, minY: 0, maxY: 3.99,step: 0.01, defval : { num1 :0.5 , num2 : 0.5 }, height: 200},
                  ]
                },
                { type: 'panel', label: 'waves', id: 'waves', widgets: [
                  { type: 'panel', label: 'wave 0', id: 'wave0', vertical: true, widgets: [
                     { id: 'wavesteps_0', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_0', type: 'spinner', label: 'seed', size:4,  min: 1, max: 100000, step: 1, defval: 11}
                  ]},
                  { type: 'panel', label: 'wave 1', id: 'wave1', vertical: true, widgets: [
                     { id: 'wavesteps_1', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_1', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 12}
                  ]},
                  { type: 'panel', label: 'wave 2', id: 'wave2', vertical: true, widgets: [
                     { id: 'wavesteps_2', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_2', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 13}
                  ]},
                  { type: 'panel', label: 'wave 3', id: 'wave3', vertical: true, widgets: [
                     { id: 'wavesteps_3', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_3', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 14}
                  ]},
                  ]
                },
                Components.adsr('adsr1'),
                { type: 'panel', label: 'master', id: 'master', widgets: [
                  { id : 'amp', type : 'fader', label : 'amp', min: 0, max: 1, step: 0.01, defval: 0.6, height: 200 },
                  { id : 'rev', type : 'fader', label : 'reverb', min: 0, max: 1, step: 0.01, defval: 0.6, height: 200 },
                  ]
                }
          ]
      }
    const tunings = [
       { name: 'blue', basekey: 0, basefreq: 8.25, scale: [ 1,21/20,10/9,7/6,5/4,21/16,7/5,3/2,25/16,5/3,7/4,15/8]},
       { name: 'overtone', basekey: 0, basefreq: 8.25, scale: [ 1,17/16,9/8,19/16,5/4,21/16,11/8,3/2,13/8,27/16,7/4,15/8]},
       { name: 'monte', basekey: 10, basefreq: 4.58333, scale: [ 1,64/63,9/8,8/7,7/6,4/3,21/16,3/2,32/21,14/9,16/9,7/4]},
    ]

    return (
      <Layout>
        <Col>
          <Row><Col><h2>Random Spline Waves</h2></Col></Row>
          <Row><Col> <CsoundInstr csoundwasm={withPrefix('csound.esm.js')} inst={inst} csd={ withPrefix('rspline.csd')} plugins={[]} tunings={tunings}/></Col></Row>
        </Col>
      </Layout>
    )
}

export default IndexPage
```
Thereby the follwing rules apply:
   - The id attribute of the components must match the channel name in the csound instrument located in the 'static' folder
       (exceptions: idx and idy in the xy component and &lt;id>_a,&lt;id>_d,&lt;id>_s,&lt;id>_r in the predefined component adsr )
   - In order to play the instrument with midi (chrome) or the computer keyboard, the instrument must provide two trigger instruments
       `trig` and `freqtrig` as in the static/rspline.csd shown.

```csound-orc
opcode freqtrigger,0,iiii
  insno,ion,ifreq,ivel xin
  print insno,ion,ifreq,ivel
  if ion == 1 then
    event "i",insno+(ifreq*0.00001),0,-1,ifreq,ivel
  else
    turnoff2 insno+(ifreq*0.00001),4,1
  endif
endop

opcode notetrigger,0,iiii
  insno,ion,ikey,ivel xin
  ifreq = cpsmidinn(ikey)
  freqtrigger insno,ion,ifreq,ivel
endop

instr trig
  insno = nstrnum("rspline") 
  notetrigger insno,p4,p5,p6
  turnoff
endin

/* for other tunings */
instr freqtrig
  insno = nstrnum("rspline") 
  freqtrigger insno,p4,p5,p6
  turnoff
endin

``` 

The freqtrig instrument is used for other tunings which can be passed to the CsoundInstr (see above).

### Components
The following components are currently available:
#### panel
| parameter | type | description | mandatory |
|------|------|-----------------------------|-------------|
| type | string | must be 'panel' | yes | 
| id | string | the id of the panel | yes | 
| label | string | the label displayed above the panel | no |
| on | boolean |  if true the label will be rendered as button which triggers a one or zero on the channel &lt;id> -- can be used to turn on and off a complete unit | no | 
| onVal | 0 or 1 | the default value for on/off  | no | 
| widgets | list | the list of components in the panel | yes |
| vertical | boolean | the orientaiton of the components inside the panel (default false - horizontal) | no | 

#### fader, hfader, knob
The faders and knobs support editing values and stepping via the keyboard up and down arrows.
| parameter | type | description | mandatory |
|------|------|-----------------------------|-------------|
| type | string | must be 'fader'/'hfader'/'knob' | yes | 
| id | string | the id of the fader corresponding to the csound channel name | yes | 
| label | string | the label displayed above the fader | no |
| min | number | the minimum value of the fader/knob | yes |
| max | number | the maximum value of the fader/knob | yes |
| step | number | the precision of the fader/knob - use 1 for integer and e.g. 0.01 for floats | yes |
| defval | number | the default value | yes |
| height | number | the height of the fader/knob | yes |
| width | number | the witdh of the knob/hfader | yes |

#### spinner
a number input with up and down arrows.
| parameter | type | description | mandatory |
|------|------|-----------------------------|-------------|
| type | string | must be 'spinner' | yes | 
| id | string | the id of the number input corresponding to the csound channel name | yes | 
| label | string | the label displayed above the fader | no |
| min | number | the minimum value of the number input | yes |
| max | number | the maximum value of the number input | yes |
| step | number | the precision of the fader/knob - use 1 for integer and e.g. 0.01 for floats | yes |
| defval | number | the default value | yes |
| size | number | the number of characters | yes |
 
#### xy
| parameter | type | description | mandatory |
|------|------|-----------------------------|-------------|
| type | string | must be 'xy' | yes | 
| idx | string | the id of the x value corresponding to the csound channel name | yes | 
| idy | string | the id of the y value corresponding to the csound channel name | yes | 
| label | string | the label displayed above the fader | no |
| minX | number | the minimum value of x | yes |
| maxX | number | the maximum value of x | yes |
| minY | number | the minimum value of y | yes |
| maxY | number | the maximum value of y | yes |
| step | number | the precision of the xy values - use 1 for integer and e.g. 0.01 for floats | yes |
| defval | object | the default value of the form {[idx]:defaultx,[idy]:defaulty }| yes |

#### select
a radio button selection
| parameter | type | description | mandatory |
|------|------|-----------------------------|-------------|
| type | string | must be 'select' | yes | 
| id | string | the id of the number input corresponding to the csound channel name | yes | 
| label | string | the label displayed above the fader | no |
| start | number | the index of the first button mostly eithier 0 or 1, defualt 0 | no |
| vertical | boolean | arrangement of the toggle buttons default false | no |
| items | string array | the items of the selection | yes|

#### more to come
combobox, string input, meter, ....

### Deploying
Run
```shell
gatsby clean && gatsby build
```
If all worked fine then you can test the app via `gatsby serve`.
The static web site is located in the `public` folder and can be deployed where ever you want to.
If the webapp is hosted under a subpath do the following:

- in gatsby-config.js edit the entry `pathPrefix` to point to the target path on the web server.
- Run
```shell
gatsby clean && gatsby build --prefix-paths
```
### Lowlevel
To be done. 
The components a reusable. So for making apps e.g. without midi or with sequencers just take the `src/components/lib/csoundinstr.js`
modify it acordingly.

It is possible to plug in custom components in this system by providing a generation funtion (see `src/components/lib/panel.js`)
Examples will be provided soonish.



