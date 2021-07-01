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
                  { id: 'num1', type: 'fader', label: 'num1', min: 0, max: 3.99, step: 0.01, defval: 0 , height: 200},
                  { id: 'num2', type: 'fader', label: 'num2', min: 0, max: 3.99, step: 0.01, defval: 0 , height: 200},
                  ]
                },
                { type: 'panel', label: 'waves', id: 'waves', widgets: [ 
                  { type: 'panel', label: 'wave 0', id: 'wave0', vertical: true, widgets: [
                     { id: 'wavesteps_0', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_0', type: 'spinner', label: 'seed', size:4,  min: 1, max: 100000, step: 1, defval: 1000, vertical: false}
                  ]},
                  { type: 'panel', label: 'wave 1', id: 'wave1', vertical: true, widgets: [
                     { id: 'wavesteps_1', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_1', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 1001, vertical: false}
                  ]},
                  { type: 'panel', label: 'wave 2', id: 'wave2', vertical: true, widgets: [
                     { id: 'wavesteps_2', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_2', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 1002, vertical: false}
                  ]},
                  { type: 'panel', label: 'wave 3', id: 'wave3', vertical: true, widgets: [
                     { id: 'wavesteps_3', type: 'knob', label: 'steps', min: 4, max: 16, step: 1, defval:10 },
                     { id: 'waveseed_3', type: 'spinner', label: 'seed',  size:4, min: 1, max: 100000, step: 1, defval: 1003, vertical: false}
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
          <Row><Col> <CsoundInstr csoundwasm={withPrefix('csound.dev.esm.js')} inst={inst} csd={ withPrefix('rspline.csd')} plugins={[]} tunings={tunings}/></Col></Row>
        </Col>
      </Layout>
    )
}

export default IndexPage
