/* @flow */
import React, { Component, PropTypes } from "react";
import Radium from "radium";

@Radium
export default class TestLabel extends Component {
  render () {
    return (
      <div style={[styles.background, styles.color]} key="label">
        TestLabel
      </div>
    );
  }
}

const styles = {
	background: {
		backgroundColor: "#4fc",
		":hover": {
			backgroundColor: "#333"
		}
	},
	color: {
		color: "#000"
	}
};
