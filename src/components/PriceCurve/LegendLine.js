import React, { Component, PropTypes } from "react";

import AnimatedPath from "../AnimatedPath";
import { lightGray, gray } from "../../colors";

const SPRING_SETTINGS = [200, 30];

export default class LegendLine extends Component {
    static propTypes = {
        startX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        startY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        endX: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        endY: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        pivotPoint: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        strokeWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        theme: PropTypes.string
    };

    static defaultProps = {
        pivotPoint: 0.5,
        strokeWidth: 2
    };

    render () {
        const {
            startX,
            startY,
            endX,
            endY,
            strokeWidth,
            pivotPoint,
            ...props
        } = this.props;
        console.log(lightGray, gray);
        const dynamicStyles = this.getDynamicStyles();

        const halfY = parseFloat(endY)*parseFloat(pivotPoint);

        const strokeWidthFloat = parseFloat(strokeWidth);

        return (
            <AnimatedPath
                color={dynamicStyles}
                strokeWidth={strokeWidthFloat}
                height={Math.max(startY, endY) + strokeWidthFloat}
                width={Math.max(startX, endX) + strokeWidthFloat}
                path={`M${startX} ${startY}L${startX} ${halfY}L${endX} ${halfY}L${endX} ${endY}`}
                springSettings={SPRING_SETTINGS}
                {...props}
            />
        );
    }

    getDynamicStyles() {
        const { theme } = this.props;

        if(theme === "dark"){
            return gray;
        }
        else{
            return lightGray;
        }
    }
}

