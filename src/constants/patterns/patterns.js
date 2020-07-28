/* 
    PATTERN OBJECT STRUCTURE
    {
        patternName: str,
        backgroundSize: {
            value: number,
            unit: str
        },
        backgroundColor: str,
        gradients: []
    }
*/

export default [
    // STRIPES
    {
        patternName: "textile striped",
        backgroundSize: [
            { value: 100, unit: "%" },
            { value: 100, unit: "%" }
        ],
        backgroundColor: "#66A3FF",
        gradients: [
            {
                "name": "horizontal stripes",
                "visible": true,
                "type": "linear",
                "angle": "90",
                "repeating": true,
                "repeatingUnit": "px",
                "max": 232,
                "colorHints": [50, 53, 63, 66, 116, 166, 169, 179, 182, 232],
                "colors": [
                    { "color": "rgba(0, 0, 0, 0)", "stop": 0 },
                    { "color": "rgb(128, 0, 128)", "stop": 50 },
                    { "color": "rgba(255, 255, 255, 0)", "stop": 53 },
                    { "color": "rgb(128, 0, 128)", "stop": 63 },
                    { "color": "rgba(255, 255, 255, 0)", "stop": 66 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 116 },
                    { "color": "rgba(255, 255, 255, 0.2)", "stop": 166 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 169 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 179 },
                    { "color": "rgba(255, 255, 255, 0.2)", "stop": 182 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 232 }
                ],
                "radial":
                {
                    "shape": "ellipse",
                    "size": "50% 50%",
                    "position": ["50%", "50%"]
                },
                "background": { "position": [{}, {}], "size": { "x": {}, "y": {} } }
            },
            {
                "name": "vertical stripes",
                "visible": true,
                "type": "linear",
                "angle": 180,
                "repeating": true,
                "repeatingUnit": "px",
                "max": 232,
                "colorHints": [50, 53, 63, 66, 116, 166, 169, 179, 182, 232],
                "colors": [
                    { "color": "rgba(0, 0, 0, 0)", "stop": 0 },
                    { "color": "rgb(128, 0, 128)", "stop": 50 },
                    { "color": "rgba(255, 255, 255, 0)", "stop": 53 },
                    { "color": "rgb(128, 0, 128)", "stop": 63 },
                    { "color": "rgba(255, 255, 255, 0)", "stop": 66 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 116 },
                    { "color": "rgba(255, 255, 255, 0.2)", "stop": 166 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 169 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 179 },
                    { "color": "rgba(255, 255, 255, 0.2)", "stop": 182 },
                    { "color": "rgba(0, 0, 0, 0.5)", "stop": 232 }
                ],
                "radial":
                {
                    "shape": "ellipse",
                    "size": "50% 50%", "position": ["50%", "50%"]
                }, "background": { "position": [{}, {}], "size": { "x": {}, "y": {} } }
            }
        ]
    },







];