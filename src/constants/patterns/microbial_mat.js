export default {
    "patternName": "microbial mat",
    "backgroundSize": [
        {
            "value": "20",
            "unit": "px"
        },
        {
            "value": "20",
            "unit": "px"
        }
    ],
    "backgroundColor": "rgb(136, 170, 51)",
    "gradients": [
        {
            "name": "arc",
            "visible": true,
            "type": "radial",
            "angle": "90",
            "repeating": false,
            "repeatingUnit": "px",
            "max": "20",
            "colorHints": [],
            "colors": [
                {
                    "color": "rgba(0, 0, 0, 0)",
                    "stop": 9
                },
                {
                    "color": "rgba(102, 17, 51, 1)",
                    "stop": 10
                },
                {
                    "color": "rgba(255, 255, 255, 0)",
                    "stop": 11
                }
            ],
            "radial": {
                "position": {
                    "x": {
                        "value": "100",
                        "unit": "%"
                    },
                    "y": {
                        "value": "100",
                        "unit": "%"
                    }
                }
            },
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
            "name": "half circle",
            "visible": true,
            "type": "radial",
            "angle": "90",
            "repeating": false,
            "repeatingUnit": "px",
            "max": "20",
            "colorHints": [],
            "colors": [
                {
                    "color": "rgba(0, 0, 0, 0)",
                    "stop": 9
                },
                {
                    "color": "rgba(102, 17, 51, 1)",
                    "stop": 10
                },
                {
                    "color": "rgba(255, 255, 255, 0)",
                    "stop": 11
                }
            ],
            "radial": {
                "position": {
                    "x": {
                        "value": "0",
                        "unit": "%"
                    },
                    "y": {
                        "value": "50",
                        "unit": "%"
                    }
                },
                "shape": "circle"
            },
            "background": {
                "position": [
                    {},
                    {
                        "value": 10,
                        "unit": "px"
                    }
                ],
                "size": {
                    "x": {},
                    "y": {}
                }
            }
        }
    ]
}