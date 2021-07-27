import React from "react"
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider"
import { Handle, SliderRail, Track, Tick } from "./hslidercomponents.js"

const sliderStyle = {
  position: "relative",
  width: 120,
  height: 50,
  top: 10,
  border: 0,
}

class HFader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: [this.props.defval],
    }
    this.domain = [this.props.min, this.props.max]
  }

  onChange = values => {
    this.setState({ values })
    this.props.onChange && this.props.onChange(values[0])
  }

  render() {
    const {
      state: { values },
    } = this
    return (
      <Slider
        rootStyle={sliderStyle}
        domain={this.domain} // [min, max]
        step={this.props.step}
        onChange={this.onChange}
        values={values}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <div className="slider-handles">
              {handles.map(handle => (
                <Handle
                  domain={this.domain}
                  key={handle.id}
                  handle={handle}
                  getHandleProps={getHandleProps}
                />
              ))}
            </div>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <div className="slider-tracks">
              {tracks.map(({ id, source, target }) => (
                <Track
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </div>
          )}
        </Tracks>
        <Ticks values={this.props.vals}>
          {({ ticks }) => (
            <div className="slider-ticks">
              {ticks.map(tick => (
                <Tick
                  key={tick.id}
                  //                format={formatTicks}
                  tick={tick}
                  count={ticks.length}
                />
              ))}
            </div>
          )
          }
        </Ticks>
      </Slider>
    )
  }
}

export default HFader
