import React, { Fragment } from "react"
import PropTypes from "prop-types"

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
  position: "absolute",
  height: "100%",
  width: 24,
  left: 8,
  transform: "translate(-50%, 0%)",
  borderRadius: 7,
  cursor: "pointer",
  // border: '1px solid white',
}

const railInnerStyle = {
  position: "absolute",
  height: "100%",
  width: 10,
  left: 8,
  transform: "translate(-50%, 0%)",
  borderRadius: 4,
  pointerEvents: "none",
  //backgroundColor: 'rgb(155,155,155)',
  backgroundColor: "#FDF6E3",
}

export function SliderRail({ getRailProps }) {
  return (
    <Fragment>
      <div style={railOuterStyle} {...getRailProps()} />
      <div style={railInnerStyle} />
    </Fragment>
  )
}

SliderRail.propTypes = {
  getRailProps: PropTypes.func.isRequired,
}

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({
                         domain: [min, max],
                         handle: { id, value, percent },
                         getHandleProps,
                       }) {
  return (
    <Fragment>
      <div
        style={{
          top: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          WebkitTapHighlightColor: "rgba(0,0,0,0)",
          zIndex: 5,
          width: 10,
          height: 22,
          cursor: "pointer",
          // border: '1px solid white',
          backgroundColor: "none",
        }}
        {...getHandleProps(id)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label="slider"
        style={{
          top: `${percent}%`,
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          width: 12,
          height: 22,
          borderRadius: "10%",
          boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
          backgroundColor: "#0044BB",
        }}
      />
    </Fragment>
  )
}

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses button to allow keyboard events
// *******************************************************
export function KeyboardHandle({
                                 domain: [min, max],
                                 handle: { id, value, percent },
                                 getHandleProps,
                               }) {
  return (
    <button
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      className="keyboardhandle"
      style={{
        top: `${percent}%`,
        left: 8,
        position: "absolute",
        transform: "translate(-50%, -50%)",
        width: 24,
        height: 10,
        zIndex: 5,
        cursor: "pointer",
        border: 4,
        borderRadius: "10%",
        boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
        backgroundColor: "#0044EE",
      }}
      {...getHandleProps(id)}
    />
  )
}

KeyboardHandle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        backgroundColor: "#b28900",
        borderRadius: 7,
        cursor: "pointer",
        width: 14,
        transform: "translate(-50%, 0%)",
        top: `${source.percent}%`,
        left: 8,
        height: `${target.percent - source.percent}%`,
      }}
      {...getTrackProps()}
    />
  )
}

Track.propTypes = {
  source: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getTrackProps: PropTypes.func.isRequired,
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
export function Tick({ tick, format }) {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          marginTop: -0.5,
          marginLeft: 10,
          height: 1,
          width: 6,
          backgroundColor: "rgb(200,200,200)",
          top: `${tick.percent}%`,
        }}
      />
      <div
        style={{
          position: "absolute",
          marginTop: -5,
          marginLeft: 20,
          fontSize: 10,
          top: `${tick.percent}%`,
        }}
      >
        {format(tick.value)}
      </div>
    </div>
  )
}

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  format: PropTypes.func.isRequired,
}

Tick.defaultProps = {
  format: d => d,
}
