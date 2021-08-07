import React from 'react';
import { Col, OverlayTrigger, Tooltip } from "react-bootstrap"

const renderTooltip = (tooltip) => (
  <Tooltip id="label-tooltip">
    {tooltip}
  </Tooltip>
);
const Label = (props) => {
  const withTooltip = props.tooltip !== undefined && props.tooltip !== ''
  return (
    <>
    { withTooltip ? (
        <OverlayTrigger placement="top"
                        delay={{show: 250, hide: 200}}
                        overlay={renderTooltip(props.tooltip)}>
          <Col className="dbyellow" md="auto">
            {props.label}
          </Col>
        </OverlayTrigger>
      ) : (
        <Col className="dbyellow" md="auto">
          {props.label}
        </Col>
      )
    }
    </>
  );
}
export default Label