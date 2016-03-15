/**
 * `AnimatedPath` let's you pass in an SVG path and it will animate the drawing
 * of the path. This is done by animated the css property stroke-dasharray to
 * simulate the drawing.
 *
 * Example:
 * <AnimatedPath path="M0 0L100 100" />
 *
 * Example with all the props:
 * <AnimatedPath
 *  path="M0 0L100 100"
 *  strokeWidth={2}
 *  color="#f0f"
 *  fill="#ff0"
 *  springSettings={[100, 20]}
 *  width={300}
 *  height={400}
 * />
 */
import React, { Component, PropTypes } from "react";
import Radium from "radium";
import ReactDOM from "react-dom";
import { Motion, spring } from "react-motion";
import MetricsPath from "art/metrics/path";

import { lightGray } from "../colors";

@Radium
export default class AnimatedPath extends Component {
    static propTypes = {
        strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

        // color of the stroke
        color: PropTypes.string,

        // color of the fill (transparent by default)
        fill: PropTypes.string,
        path: PropTypes.string.isRequired,

        // react-motion spring settings
        springSettings: PropTypes.arrayOf(PropTypes.number),

        // width and height will be automatically calculated from the path if
        // not specified
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }; 

    static defaultProps = {
        color: lightGray,
        strokeWidth: 2,
        fill: "transparent",
        springSettings: [10, 10]
    };

    render () {
        const {
            path,
            color,
            fill,
            width: propWidth,
            height: propHeight,
            strokeWidth,
            springSettings,
            ...props
        } = this.props;

        // Calculate the length of the path, the width and the height based on
        // the provided path data.
        const { length, width: pathWidth, height: pathHeight} = MetricsPath(path);

        const width = propWidth || pathWidth;
        const height = propHeight || pathHeight;

        return (
            <Motion ref="motion" defaultStyle={{progress: 0}} style={{progress: spring(length, springSettings)}}>
            {
                value => (
                    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
                        <path
                            d={path}
                            stroke={color}
                            fill={fill}
                            strokeWidth={strokeWidth}
                            style={{
                                strokeDasharray: `${value.progress} ${length}`
                            }}
                        />
                    </svg>
                )
            }
            </Motion>
        );
    }
}

