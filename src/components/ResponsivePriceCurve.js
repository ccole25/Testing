import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import Radium from "radium";

import PriceCurve from "./PriceCurve";


@Radium
export default class ResponsivePriceCurve extends Component {
    constructor (props) {
        super(props);
        this.state = {
            containerWidth: 0
        };
    }

    static propTypes = {
        theme: PropTypes.string
    }

    componentDidMount () {
        this.resize();
        this._windowResizeListener = window.addEventListener("resize", () => {
            this.resize();
        });
    }

    componentWillUnmount () {
        window.removeEventListener(this._windowResizeListener);
    }

    resize () {
        const { offsetWidth: containerWidth } = findDOMNode(this).parentNode;

        this.setState({
            containerWidth
        });
    }

    render () {
        const {
            width,
            height,
            style,
            ...props
        } = this.props;

        const {
            containerWidth
        } = this.state;


        const correctHeight = containerWidth * (225/635);

        return (
            <div style={[styles.container, style]}>
                <PriceCurve
                    ref="curve"
                    theme={this.props.theme}
                    width={containerWidth}
                    height={correctHeight}
                    {...props}
                />
            </div>
        );
    }
}

const styles = {
    container: {
        paddingTop: 30,
        paddingBottom: 20
    }
};
