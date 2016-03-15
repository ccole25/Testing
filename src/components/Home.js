/* @flow */
import React, { Component } from "react";
import { NavBar } from "battery-pack";
import Radium from "radium";

export class Home extends Component {
  render () {
    return (
      <div>
        <div style={[styles.title, styles.title2]}>Responsive Curve</div>
            <NavBar
                theme="dark"
                left="Left"
                middle="Middle"
                right="Right"
                fixed={false}
                fadeOnScroll={false}/>
                <br/>
      </div>
    );
  }
}
export default Radium(Home);

const styles = {
  title: {
    color: "#f0f",
    ":hover": {
      color: "#4fc"
    }
  },
  title2: {
    background: "#88f"
  }
};

