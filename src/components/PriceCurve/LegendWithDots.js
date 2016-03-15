import React, { Component, PropTypes } from "react";
import Radium from "radium";

import PriceCurveDot from "./Dot";
import PriceCurveLegendLine from "./LegendLine";
import PriceCurveLegendText from "./LegendText";

const SHOW_DOTS_DELAY = 700;
const TRICKLE_DOTS_DELAY = 500;
const ORIGINAL_WIDTH = 635;

@Radium
export default class LegendWithDots extends Component {
    static propTypes = {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        legend: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.number
            }).isRequired
        ),
        theme: PropTypes.string
    };

    constructor (props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    componentDidMount () {
        this._timeout = window.setTimeout(() => {
            this._trickleDots();
            this._trickleDotsInterval = window.setInterval(this._trickleDots, TRICKLE_DOTS_DELAY);
        }, SHOW_DOTS_DELAY);
    }

    componentWillUnmount () {
        clearTimeout(this._timeout);
        clearInterval(this._trickleDotsInterval);
    }

    render () {
        const {
            style,
            width,
            ...props
        } = this.props;

        const dots = this._renderDots();
        const legendValues = this._renderLegendValues();

        return (
            <div style={[styles.container, {width: width}, style]} {...props}>
                {dots}
                {legendValues}
            </div>
        );
    }

    _renderDots () {
        const startPositions = this._getDotPositions();
        const endPositions = this._getLegendPositions();
        const output = [];
        let position, legendValue;
        for(let i = 0; i < this.state.count; i++) {
            position = startPositions[i];
            output.push(
                <div key={i}>
                    <PriceCurveDot 
                        theme={this.props.theme} 
                        key={i} width={this._ratioNumber(12)} 
                        style={[styles.dot, {left: position}]} 
                    />
                    <PriceCurveLegendLine
                        theme={this.props.theme}
                        style={styles.legendLine}
                        startX={position || 0}
                        strokeWidth={this._ratioNumber(2)}
                        startY="0"
                        endX={endPositions[i] || 0}
                        endY={this._ratioNumber(30)}
                        pivotPoint={0.8}
                    />
                </div>
            );
        }

        return output;
    }

    _ratioNumber (input) {
        const {
            width
        } = this.props;
        return input * (width / ORIGINAL_WIDTH);
    }

    _renderLegendValues () {
        const legendItems = this._getSortedLegendItems();

        return legendItems.map((legendItem, i) => {
            const dynamicStyle = {
                fontSize: Math.max(11, this._ratioNumber(16)),
                top: this._ratioNumber(30),
                left: `${25*(i+1)}%`
            };
            return (
                <PriceCurveLegendText
                    theme={this.props.theme}
                    key={i}
                    style={dynamicStyle}
                    name={legendItem.name}
                    price={legendItem.value}
                    nameDelay={SHOW_DOTS_DELAY+(i*TRICKLE_DOTS_DELAY)+600}
                />
            );
        });
    }

    _getLegendPositions () {
        const {
            width
        } = this.props; 

        const quarter = width / 4;

        return [
            quarter,
            quarter*2,
            quarter*3
        ];
    }

    _getDotPositions () {
        const { width } = this.props;
        const legendItems = this._getSortedLegendItems();
        const margin = 20 * (width / ORIGINAL_WIDTH);
        const middlePosition = legendItems[1].value/(legendItems[0].value+legendItems[2].value)*(width-margin);

        return [
            margin,
            middlePosition,
            width - margin
        ];
    }

    _getSortedLegendItems () {
        const { legend } = this.props;
        return Object.values(legend).sort((a, b) => a.value-b.value);
    }

    _trickleDots = () => {
        const { count } = this.state;
        const newCount = count + 1;
        this.setState({
            count: newCount
        });
        if (newCount === 3) clearTimeout(this._trickleDotsInterval);
    }
}

const styles = {
    container: {
        position: "relative"
    },
    dot: {
        position: "absolute"
    },
    legendLine: {
        position: "absolute",
        top: 0,
        left: 0
    }
};

