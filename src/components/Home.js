/* @flow */
import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import Radium from "radium";
import { MainTabNav, MainTab } from "battery-pack";
import "assets/css/home.scss";

export class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: ["hello", "world", "click", "me"]
    };
  }
  render () {
    const items = this.state.items.map((item, i) => {
      return (
        <div key={item} onClick={this.handleRemove.bind(this, i)}>
          {item}
        </div>
      );
    });

    return (
      <div>
      <MainTabNav defaultActiveKey={1} rightContent={<div> Right Content </div>}>
          <MainTab eventKey={1} title={<div>MainTab <span>(1)</span></div>}>
            Your awesome content here <br />
            Your awesome content here <br />
            Your awesome content here <br />
            Your awesome content here <br />
            Your awesome content here <br />
          </MainTab>
          <MainTab eventKey={2} title="MainTab 2">
            More awesome content here <br />
            More awesome content here <br />
            More awesome content here <br />
          </MainTab>
          <MainTab eventKey={3} title="MainTab 3">
            Sort of awesome content
          </MainTab>
        </MainTabNav>
        <button onClick={this.handleAdd.bind(this)}>Add Item</button>
        <ReactCSSTransitionGroup transitionName="example">
          {items}
        </ReactCSSTransitionGroup>
      </div>
    );
  }

  handleAdd () {
    const newItems = this.state.items.concat([prompt("Enter some text")]);
    this.setState({items: newItems});
  }
  handleRemove (i) {
    const newItems = this.state.items.slice();
    newItems.splice(i, 1);
    this.setState({items: newItems});
  }
}
export default Radium(Home);
