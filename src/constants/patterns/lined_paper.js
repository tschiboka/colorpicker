export default {
    "patternName": "lined paper",
    "backgroundSize": [
        {
            "value": "100",
            "unit": "%"
        },
        {
            "value": "1.2",
            "unit": "em"
        }
    ],
    "backgroundColor": "rgb(255, 255, 255)",
    "gradients": [
        {
            "name": "horizontal lines",
            "visible": true,
            "type": "linear",
            "angle": 180,
            "repeating": false,
            "repeatingUnit": "em",
            "max": "2",
            "colorHints": [
                1.1
            ],
            "colors": [
                {
                    "color": "rgba(238, 238, 238, 0)",
                    "stop": 0
                },
                {
                    "color": "#eeeeee",
                    "stop": 1.2
                }
            ],
            "background": {
                "position": [
                    {},
                    {}
                ],
                "size": {
                    "x": {},
                    "y": {}
                }
            }
        },
        {
            "name": "margin",
            "visible": true,
            "type": "linear",
            "angle": "90",
            "repeating": false,
            "repeatingUnit": "px",
            "max": "100",
            "colorHints": [
                79
            ],
            "colors": [
                {
                    "color": "rgba(0, 0, 0, 0)",
                    "stop": 0
                },
                {
                    "color": "#abced4",
                    "stop": 79
                },
                {
                    "color": "rgba(255, 255, 255, 0)",
                    "stop": 81
                }
            ],
            "background": {
                "position": [
                    {},
                    {}
                ],
                "size": {
                    "x": {},
                    "y": {}
                }
            }
        }
    ]
}