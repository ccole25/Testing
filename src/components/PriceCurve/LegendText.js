import React, { Component, PropTypes } from "react";
import Radium from "radium";
import Numeral from "numeral";
import { Motion, spring } from "react-motion";

import { gray, black, lightGray } from "../../colors";

const SPRING_SETTINGS = [80, 20];
const PRICE_FADE_DELAY = 1650;

@Radium
export default class LegendText extends Component {
    static propTypes = {
        price: PropTypes.number,
        name: PropTypes.string,
        nameDelay: PropTypes.number,
        theme: PropTypes.string
    };

    static defaultProps = {
        nameDelay: PRICE_FADE_DELAY,
        color: gray
    };

    constructor (props) {
        super(props);
        this.state = {
            progress: 0
        };
    }

    componentDidMount () {
        this._progressTimeout = window.setTimeout(() => {
            this.setState({
                progress: 1
            });
        }, this.props.nameDelay);
    }

    componentWillUnmount () {
        clearTimeout(this._progressTimeout);
    }

    render () {
        const {
            price,
            name,
            style,
            ...props
        } = this.props;
        const dynamicStyle = this.getDynamicStyles();
        return (
            <Motion defaultStyle={{progress: 0}} style={{progress: spring(this.state.progress, SPRING_SETTINGS)}}>
            {
                value => (
                    <div style={[styles.container, style, dynamicStyle.container]} {...props}>
                        <div className="legend-name" style={{transform: `translateY(${2 * value.progress}px)`}}>{name}</div>
                        <div style={[styles.legendPrice, {opacity: value.progress}]}>{Numeral(price).format("$0,0")}</div>
                    </div>
                )
            }
            </Motion>
        );
    }

    getDynamicStyles() {
        const { theme, ...props } = this.props;

        let styles = {
            container: {
                color: props.color
            }
        };
        if (theme === "dark") {
            styles.container.color = black;
        }
        else if (theme === "light") {
            styles.container.color = lightGray;
        }
        return styles;
    }
}

const styles = {
    container: {
        position: "absolute",
        width: "30%",
        marginLeft: "-15%",
        textAlign: "center"
    },
    legendPrice: {
        fontSize: "large",
        fontWeight: 400,
        marginTop: 2
    }
};

