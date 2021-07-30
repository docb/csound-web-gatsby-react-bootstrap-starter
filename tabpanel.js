import React from "react"
import Panel from "./panel"
import { Col, Tab, Tabs } from "react-bootstrap"

class TabPanel extends React.Component {

  constructor(props) {
    super(props)
    this.state = { on: this.props.def.onVal }
  }

  onChange(id, val) {
    this.props.onChange(id, val)
  }

  render() {
    const components = []
    let defaultId
    this.props.def.widgets.forEach((component) => {
      if (component.type === "panel") {
        if (defaultId === undefined) defaultId = component.id
        components.push(
          <Tab eventKey={component.id} title={component.label}>
            <Panel def={component} key={component.id} onChange={this.onChange.bind(this)} />
          </Tab>,
        )

      }
    })
    return (
      <Col>
        <Tabs defaultActiveKey={defaultId} id={this.props.def.id} className="mb-3">
          {components}
        </Tabs>
      </Col>
    )
  }
}

export default TabPanel
