import React, { Component, PropTypes } from "react";
import Radium from "radium";

import Bar from "./Bar";
import Curve from "./Curve";
import BottomLine from "./BottomLine";
import LegendWithDots from "./LegendWithDots";

const CURVE_ANIMATION_DELAY = 1000;

const DEFAULT_WIDTH = 635;
const DEFAULT_HEIGHT= 224;
const DEFAULT_BAR_WIDTH = 27.5;

@Radium
export default class PriceCurve extends Component {
    static propTypes = {
        barHeights: PropTypes.arrayOf(PropTypes.number),
        width: PropTypes.number,
        height: PropTypes.number,
        theme: PropTypes.string
    };

    static defaultProps = {
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    };

    constructor (props) {
        super(props);
        this.state = {
            showCurve: false
        };
    }

    componentDidMount () {
        // Currently `react-motion` does not have a completion hook so we are
        // manually waiting 1 second to let the bar animation complete before
        // we start the curve. (https://github.com/chenglou/react-motion/issues/139)
        this._showCurveTimeout = window.setTimeout(() => {
            this.setState({
                showCurve: true
            });
        }, CURVE_ANIMATION_DELAY);
    }

    componentWillUnmount () {
        // If the component is unmounted before the curve animation timeout is
        // triggered then we make sure to clear it so it doesn't try to set
        // state on an unmounted component
        window.clearTimeout(this._showCurveTimeout);
    }

    render () {
        const {
            barHeights,
            width,
            height,
            style,
            ...props
        } = this.props;
        const { showCurve } = this.state;

        const barContainerMargin = 20 * (width / DEFAULT_WIDTH);
        const barContainerWidth = width - (barContainerMargin*2);

        const priceCurveBars = barHeights.map((value, i) => {
            return (
                <Bar
                    theme={this.props.theme}
                    key={i}
                    style={{margin: 5 * (barContainerWidth / DEFAULT_WIDTH)}}
                    fill={value}
                    width={DEFAULT_BAR_WIDTH * (barContainerWidth / DEFAULT_WIDTH)}
                    height={height}
                />
            );
        });

        const bottomBarStroke = Math.max(1, 3 * (height / DEFAULT_HEIGHT));

        const dots = this._renderDots(bottomBarStroke);

        return (
            <div style={[styles.container, style, {paddingBottom: 90 * (height / DEFAULT_HEIGHT)}]} {...props}>
                <div style={[{width: width, height: height}, styles.graphContainer]}>
                    <div style={[styles.bars, {paddingLeft: barContainerMargin}]}>
                        {priceCurveBars}
                    </div>
                    <div style={[styles.curve, {top: 5 * (height / DEFAULT_HEIGHT)}]}>
                        { showCurve && <Curve width={width} height={height} theme={this.props.theme} /> }
                    </div>
                </div>
                <BottomLine
                    theme={this.props.theme}
                    style={[styles.bottomLine, {top: height}]}
                    width={width}
                    height={bottomBarStroke} />
                {dots}
            </div>
        );
    }

    _renderDots (bottomBarStroke) {
        const {
            width,
            height,
            msrp,
            average,
            invoice
        } = this.props;

        const legend = [
            {
                name: "MSRP",
                value: msrp
            },
            {
                name: "Average Paid",
                value: average
            },
            {
                name: "Factory Invoice",
                value: invoice
            }
        ];

        const top = height + (bottomBarStroke / 2);

        return (
            <LegendWithDots
                theme={this.props.theme}
                style={[styles.dots, {top: top}]}
                legend={legend}
                width={width}
            />
        );
    }
}

const styles = {
    container: {
        position: "relative"
    },
    graphContainer: {
        position: "relative",
        overflow: "hidden"
    },
    curve: {
        position: "absolute",
        left: 0
    },
    bars: {
        position: "absolute",
        top: 0
    },
    bottomLine: {
        position: "absolute"
    },
    dots: {
        position: "absolute"
    }
};

