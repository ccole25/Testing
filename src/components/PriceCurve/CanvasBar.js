import React, { Component, PropTypes } from "react";
import Radium from "radium";

import { superLightBlue, lightGray, superLightGray } from "../../colors";

@Radium
export default class CanvasBar extends Component {
    static propTypes = {
        color: PropTypes.string,
        interpolatedStyles: PropTypes.array.isRequired,
        theme: PropTypes.string
    };

    static defaultProps = {
        color: superLightBlue
    }

    constructor (props) {
        super(props);

        // We do not render the canvas element unless the component has
        // mounted. This helps us prevent a server side error
        this.state = {
            onPage: false,
            ratio: typeof window !== "undefined" ? window.devicePixelRatio : 1
        };
    }

    // We update the canvas context once things are mounted. This prevents us
    // from having issues on the server side attempting to update the canvas
    componentDidMount () {
        this.setState({
            onPage: true
        });
    }

    /**
     * Retina devices have a higher device pixel ratio, so we render
     * at the device pixel ratio for all measurements. This is then
     * forced back into the actual dimensions with css.
     */
    render () {
        const {
            width,
            height,
            style,
            ...props
        } = this.props;

        const {
            ratio
        } = this.state;

        const dynamicStyle = {
            width: width,
            height: height
        };

        const canvasWidth = width * ratio;
        const canvasHeight = height * ratio;

        return (
            <canvas ref="canvas" dataRatio={ratio} width={canvasWidth} height={canvasHeight} style={[dynamicStyle, style]} {...props} />
        );
    }

    /**
     * Since the rendered canvas doesn't fit into the virtual dom world we need
     * to determine when to re-render on our own. In this case we want to
     * re-render every time our interpolatedStyles property changes.
     *
     * @param {Object} newProps the new props passed to the component
     */
    shouldComponentUpdate (newProps) {
        return this.state.onPage
            && newProps.interpolatedStyles !== this.props.interpolatedStyles;
    }

    /**
     * When we determined that component has updated, we need to
     * refresh the canvas context. This is where we clear the canvas
     * and redraw it. Canvas redraws are much much faster than the
     * DOM.
     *
     * Retina devices have a higher device pixel ratio, so we render
     * at the device pixel ratio for all measurements. This is then
     * forced back into the actual dimensions with css.
     */
    componentDidUpdate () {
        const {
            width,
            height,
            pieceHeight,
            interpolatedStyles
        } = this.props;

        const { ratio } = this.state;

        const ctx = this.refs.canvas.getContext("2d");

        ctx.clearRect(0, 0, width * ratio, height * ratio);
        ctx.fillStyle = this.getFillStyle();

        interpolatedStyles.forEach((style, i) => {
            ctx.fillRect(0, (style.top + style.marginTop) * ratio, width * ratio, pieceHeight * ratio);
        });
    }

    getFillStyle() {
        const { theme, ...props } = this.props;

        if (theme === "dark"){
            return lightGray;
        }
        else if ( theme === "light"){
            return superLightGray;
        }
        return props.color;
    }
}

