import React, { Component, PropTypes } from "react";
import { Button, Collapse, Well } from "react-bootstrap";

export default class ShowCodeBtn extends Component {

    constructor(...args) {
        super(...args);
        this.state = {};
    }

    render () {
        const { style, children, ...props } = this.props;
        return (
            <div>
                <Button style={styles.codeBtn} onClick={ ()=> this.setState({ open: !this.state.open })}>
                  Show Code
                </Button>
                <Collapse in={this.state.open}>
                  <div>
                    <Well>
                        <code>
                            {children}
                        </code>
                    </Well>
                  </div>
                </Collapse>
            </div>
        );
    }
}

const styles = {
    codeBtn: {
        margin: "20px 0 5px",
        outline: 0
    },
    code: {
        border: 0
    }
};
