/**
 * `PriceCurveBar` is used in `PriceCurve`. Each of the bars fall
 * in from the top on top of each other.
 *
 * Example:
 * <Bar color="#f0f" height={50} width={10} fill={0.5} />
 */
import React, { Component, PropTypes } from "react";
import Radium from "radium";
import { StaggeredMotion, spring } from "react-motion";

import { superLightBlue } from "../../colors";
import CanvasBar from "./CanvasBar";

const PIECES_FOR_FULL_HEIGHT = 20;
const SPRING_SETTINGS = [60, 15];

@Radium
export default class Bar extends Component {
    static propTypes = {
        height: PropTypes.number,
        width: PropTypes.number,
        fill: PropTypes.number,
        color: PropTypes.string,
        theme: PropTypes.string
    };

    // Not sure color is doing anything here. TODO: look into this.
    static defaultProps = {
        height: 80,
        width: 26,
        fill: 1,
        color: superLightBlue
    };

    render () {
        const {
            width,
            height,
            style
        } = this.props;

        const dynamicHeight = { width: width, height: height };
        const canvas = this._renderCanvas();

        return (
            <div style={[styles.container, dynamicHeight, style]}>
                {canvas}
            </div>
        );
    }

    _renderCanvas () {
        const {
            width,
            height,
            fill
        } = this.props;

        // How tall should each full size piece be?
        const pieceHeight = Math.floor(height / PIECES_FOR_FULL_HEIGHT);

        // how many full size pieces should there be?
        const count = Math.floor(PIECES_FOR_FULL_HEIGHT * fill);

        // the remainder is used to calculate the height of the top piece which
        // is usually not a full piece
        const remainder = PIECES_FOR_FULL_HEIGHT % fill;

        // defaultStyles is an array of all the starting points for each piece.
        const defaultStyles = [];
        for (let i = 1; i <= count; i++) {

            // If this is the remainder piece then it is smaller. Since we are
            // positioning items using their distance from the top, we need to
            // extra offset this piece. We don't want to use `top` here because
            // this is going to get blown away and set based on the item
            // falling in front of it. We could calculate this in the
            // `getStyles` method however, it is much easier to just adjust the
            // gap by using `marginTop` and then `getStyles` doesn't even have
            // to know about it. It's kind of like creating a top piece that is
            // the same size as the rest but the top portion of it is
            // transparent or in this case it's taken up by `margin`.
            let dynamicPieceHeight = pieceHeight;
            let marginTop = 0;

            if (i === count) {
                dynamicPieceHeight = Math.floor(pieceHeight * remainder);

                // make a piece of a piece but fill in the rest with margin
                marginTop = pieceHeight - dynamicPieceHeight;
            }

            defaultStyles.push({
                top: 0,
                marginTop: marginTop
            });
        }

        return (
            <StaggeredMotion
                defaultStyles={defaultStyles}
                styles={this._getStyles.bind(this, height, pieceHeight)}
            >
                {interpolatedStyles =>
                    <CanvasBar width={width} theme={this.props.theme} pieceHeight={pieceHeight} height={height} interpolatedStyles={interpolatedStyles} />
                }
            </StaggeredMotion>
        );
    }

    /**
     * `react-motion` has a `StaggeredAnimation` component that let's you
     * define styles for multiple items and you can base each style on the
     * previous item's style. This makes it really nice for having each item
     * fall behind the item in front of it. We also need to know the overall
     * height of the bar and the size of the piece so we bound those in the
     * render method that calls this.
     *
     * @param {Number} barHeight The overall height of the bar (used to calculate spring)
     * @param {Number} pieceHeight The size of each falling piece (used for calculating position offset)
     * @param {Hash} previousStyles The styles that the last falling piece before this one had.
     */
    _getStyles = (barHeight, pieceHeight, previousStyles) => {
        return previousStyles.map((style, i) => {
            let top;
            if (i === 0) {
                // For the first item we want to spring to the bottom, aka the
                // height of the bar.
                top = spring(barHeight, SPRING_SETTINGS);
            }
            else {
                // For items after the first item, we position it 1 pieceHeight
                // pixels from the top of the last item. Unless that pushes it
                // out of the page. If it is pushed out of the page then we
                // just set it at the top of the page. Forcing at least 0 was
                // added later after realizing that the iOS animation seemed to
                // work this way.
                top = Math.max(0, previousStyles[i-1].top - pieceHeight);
            }

            // Return a new object that merges the previous styles with our new
            // top position
            return Object.assign({}, previousStyles[i], {top: top});
        });
    }
}

const styles = {
    container: {
        position: "relative",
        display: "inline-block",
        overflow: "hidden"
    },
    piece: {
        position: "absolute",
        backgroundColor: superLightBlue
    }
};

