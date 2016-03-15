import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Motion, spring } from "react-motion";

import { lightBlue, black, lightGray } from "../../colors";

const SPRING_SETTINGS = [60, 15];

@Radium
export default class BottomLine extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number,
        color: PropTypes.string,
        theme: PropTypes.string
    };

    static defaultProps = {
        height: 2,
        color: lightBlue
    }

    render () {
        const {
            width,
            height,
            color,
            style,
            ...props
        } = this.props;

        const animationStartStyles = {
            height: 0,
            width: 0
        };

        const animatedStyles = {
            height: spring(height),
            width: spring(width, SPRING_SETTINGS)
        };
        const pathColor = this.getPathColor();

        return (
            <div style={[{width: width}, style]} {...props}>
                <Motion defaultStyle={animationStartStyles} style={animatedStyles}>
                    {
                        (value) => {
                            const dynamicStyle = {
                                backgroundColor: pathColor,
                                width: value.width,
                                height: value.height
                            };
                            return (
                                <div style={[styles.line, dynamicStyle]} />
                            );
                        }
                    }
                </Motion>
            </div>
        );
    }

    getPathColor() {
        const { theme, color, ...props } = this.props;

        if(theme === "dark"){
            return black;
        }
        else if (theme === "light"){
            return lightGray;
        }
        return color;
    }
}

const styles = {
    line: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1
    }
};

