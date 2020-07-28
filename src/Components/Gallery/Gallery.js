import React, { Component } from 'react';
import predefinedPatterns from "../../constants/patterns/patterns";
import { gradientObjsToStr } from "../../functions/gradient";
import "./Gallery.scss";



function Image(props) {
    return (
        <div
            className="Image"
            title={props.pattern.patternName}
        >
            <span>
                <span>{props.index + 1}.</span>

                <span>{props.pattern.patternName}</span>
            </span>

            <div style={{ backgroundColor: "white" }}>
                <div id={`image_${props.index}`}>
                    <div onClick={() => props.callBackOnClick(props.pattern)}></div>
                </div>
            </div>
        </div>
    );
}



export default class Gallery extends Component {
    componentDidUpdate() {
        // NOTE: Style needs to be set here!
        // React can not handle overlapping style properties like background shorthand / background color.
        // Its behaviour is unpredictable and unsupported. This part of the app needs to behave as closely
        // to native css as possible therefore style-sheet will be set on every update in vanilla JS style

        const patterns = this.getPatterns(this.props.show);

        patterns.forEach((pattern, i) => {
            const imageDiv = document.getElementById("image_" + i);

            let backgroundSizeSet;

            try {
                const hasValue0 = pattern.backgroundSize[0] && pattern.backgroundSize[0].value;
                const hasValue1 = pattern.backgroundSize[1] && pattern.backgroundSize[1].value;
                const hasUnit0 = pattern.backgroundSize[0] && pattern.backgroundSize[0].unit;
                const hasUnit1 = pattern.backgroundSize[1] && pattern.backgroundSize[1].unit;
                backgroundSizeSet = hasValue0 && hasValue1 && hasUnit0 && hasUnit1;
            } catch (e) { }

            imageDiv.style.background = gradientObjsToStr([...pattern.gradients].reverse());
            imageDiv.style.backgroundColor = pattern.backgroundColor || "";
            if (backgroundSizeSet) {
                imageDiv.style.backgroundSize = pattern.backgroundSize[0].value + pattern.backgroundSize[0].unit + " " +
                    pattern.backgroundSize[1].value + pattern.backgroundSize[1].unit;
            }

        });
    }



    getPatterns(show) {
        if (show === "storage") return JSON.parse(localStorage.patterns).reverse();
        else return predefinedPatterns;
    }



    renderImages(patterns) {
        return (
            patterns.map((pattern, index) => (
                <Image
                    key={`GalleryImage_${index}`}
                    index={index}
                    pattern={pattern}
                    show={this.props.show}
                    callBackOnClick={this.props.callBackOnClick}
                />
            ))
        );
    }



    render() {
        const patterns = this.getPatterns(this.props.show);

        return (
            <div
                id="gallery"
                className="Gallery"
            >
                {patterns.length ? this.renderImages(patterns) : (
                    <span>No items found in the browsers Local Storage!</span>
                )}
            </div>
        );
    }
}