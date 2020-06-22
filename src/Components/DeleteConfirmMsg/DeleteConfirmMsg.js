import React, { Component } from 'react';
import "./DeleteConfirmMsg.scss";



export default class DeleteConfirmMsg extends Component {
    render() {
        return (
            <div className="DeleteConfirmMsg">
                <div>
                    <h2>DELETE</h2>

                    <p>Would you like to delete gradient?</p>

                    <p>
                        Name: [&nbsp;
                        <span>
                            {this.props.gradientToDelete.gradient.name || `Untitled ${this.props.gradientToDelete.index + 1}`}
                        </span>
                        &nbsp;]
                    </p>

                    <p>
                        Index: [&nbsp;
                        <span>
                            {this.props.gradientToDelete.index + 1}
                        </span>
                        &nbsp;]
                    </p>

                    <div>
                        <button onClick={() => this.props.deleteConfirmResponse(true)}>Yes</button>

                        <button onClick={() => this.props.deleteConfirmResponse(false)}>No</button>
                    </div>
                </div>
            </div>
        );
    }
}