import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { Motion, spring } from "react-motion";
import Color from "color";
import AnimatedPath from "../AnimatedPath";

import { lightGray, superLightBlue, black } from "../../colors";

const SPRING_SETTINGS = [60, 50];
const DEFAULT_WIDTH = 620;

@Radium
export default class Curve extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        theme: PropTypes.string
    };

    static defaultProps = {
        fillColor: superLightBlue,
        pathColor: lightGray
    }

    render () {
        const { height, width, ...props } = this.props;
        const curvePoints = this._getPoints();
        const dynamicStyles = this.getDynamicStyles();

        return (
            <div>
                <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(0.275, SPRING_SETTINGS)}}>
                    {
                        (value => {
                            const offsetTop = -4*(width/DEFAULT_WIDTH);
                            const fillColor = Color(dynamicStyles).alpha(value.opacity).rgbaString();
                            return (
                                <AnimatedPath
                                    theme={this.props.theme}
                                    color={dynamicStyles}
                                    style={[styles.container, { top: offsetTop } ]}
                                    strokeWidth={Math.max(1, 2 * (width/DEFAULT_WIDTH))}
                                    path={curvePoints}
                                    fill={fillColor}
                                    springSettings={SPRING_SETTINGS}
                                    width={width}
                                    height={height}
                                />
                            );
                        })
                    }
                </Motion>
            </div>
        );
    }

    /**
     * This will build a Bezier curve for the give width/height provided to
     * this component. It does this by translating a curve that was drawn to
     * render at 635x225 and translates it to the provided dimensions.
     *
     * The original curve was drawn in a vector graphics program to make this
     * really simple. From there we just translate the original values into the
     * width and height we would like to render at.
     *
     * Original Curve points 635 x 225
     * M 0,   225
     * C 35,  225 155, 228 199, 140 // first
     * C 243, 51  271, 2   311, 2 // second
     * C 351, 2   379, 51  423, 140 // third
     * C 467, 229 586, 225 621, 225 // fourth
     */
    _getPoints () {
        const ORIGINAL_CURVE_WIDTH = 620;
        const ORIGINAL_CURVE_HEIGHT = 230;
        const { height, width } = this.props;
        const start = [0, height];
        const first = [
            width * (35 / ORIGINAL_CURVE_WIDTH),
            height,
            width * (155 / ORIGINAL_CURVE_WIDTH),
            height,
            width * (199 / ORIGINAL_CURVE_WIDTH),
            height * (140 / ORIGINAL_CURVE_HEIGHT)
        ];

        const second = [
            width * (243 / ORIGINAL_CURVE_WIDTH),
            height * (51 / ORIGINAL_CURVE_HEIGHT),
            width * (271 / ORIGINAL_CURVE_WIDTH),
            height * (2 / ORIGINAL_CURVE_HEIGHT),
            width * (311 / ORIGINAL_CURVE_WIDTH),
            height * (2 / ORIGINAL_CURVE_HEIGHT)
        ];

        const third = [
            width * (351 / ORIGINAL_CURVE_WIDTH),
            height * (2 / ORIGINAL_CURVE_HEIGHT),
            width * (379 / ORIGINAL_CURVE_WIDTH),
            height * (51 / ORIGINAL_CURVE_HEIGHT),
            width * (423 / ORIGINAL_CURVE_WIDTH),
            height * (140 / ORIGINAL_CURVE_HEIGHT)
        ];

        const fourth = [
            width * (467 / ORIGINAL_CURVE_WIDTH),
            height * (229 / ORIGINAL_CURVE_HEIGHT),
            width * (586 / ORIGINAL_CURVE_WIDTH),
            height,
            width * (621 / ORIGINAL_CURVE_WIDTH),
            height
        ];


        let output =  `M${start[0]}, ${start[1]} `;
        output     += `${this._makeCurveFromArray(first)} `;
        output     += `${this._makeCurveFromArray(second)} `;
        output     += `${this._makeCurveFromArray(third)} `;
        output     += `${this._makeCurveFromArray(fourth)} `;

        return output;
    }

    /**
     * This is a helper function for get Points. It simply takes an array of numbers
     * and outputs them in the expected svg curve syntax.
     */
    _makeCurveFromArray (pointArray) {
        return `C${pointArray[0]}, ${pointArray[1]} ${pointArray[2]}, ${pointArray[3]} ${pointArray[4]}, ${pointArray[5]}`;
    }

    getDynamicStyles() {
        const  { theme, ...props } = this.props;

        if (theme === "dark"){
            return black;
        }
        else if (theme === "light"){
            return lightGray;
        }
        return props.pathColor && props.fillColor;
    }
}

const styles = {
    container: {
        position: "absolute",
        overflow: "hidden"
    }
};

