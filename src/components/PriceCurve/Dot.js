import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Motion, spring } from "react-motion";

import { white, lightBlue, gray, lightGray } from "../../colors";

const SPRING_SETTINGS = [80, 8];

@Radium
export default class Dot extends Component {
    static propTypes = {
        backgoundColor: PropTypes.string,
        borderColor: PropTypes.string,
        borderWidth: PropTypes.number,
        width: PropTypes.number,
        theme: PropTypes.string
    };

    static defaultProps = {
        backgroundColor: white,
        borderColor: lightBlue,
        borderWidth: 1,
        width: 12
    };

    render () {
        const {
            borderWidth,
            backgroundColor,
            width,
            ...props
        } = this.props;

        const startAnimation = {
            opacity: 0,
            scale: 0
        };

        const animatedStyles = {
            opacity: spring(1, SPRING_SETTINGS),
            scale: spring(0.5, SPRING_SETTINGS)
        };

        const margin = -width/2;

        const borderStyle = this.getBorderColor();

        const dynamicStyle = {
            width: width*2,
            height: width*2,
            marginLeft: margin*2,
            marginTop: margin*2,
            backgroundColor,
            borderColor: borderStyle,
            borderWidth: borderWidth * 2
        };

        return (
            <div {...props}>
                <Motion defaultStyle={startAnimation} style={animatedStyles}>
                    {
                        (value) => {
                            const animatedValues = {
                                opacity: value.opacity,
                                transform: `scale(${value.scale})`
                            };

                            return (
                                <div style={[styles.dot, dynamicStyle, animatedValues]} />
                            );
                        }
                    }
                </Motion>
            </div>
        );
    }

    getBorderColor() {
        const { theme, borderColor } = this.props;
        if (theme === "dark"){
            return gray;
        }
        else if (theme === "light"){
            return lightGray;
        }
        return borderColor;
    }
}

const styles = {
    dot: {
        position: "absolute",
        zIndex: 2,
        display: "block",
        borderRadius: "100%",
        borderStyle: "solid"
    }
};

