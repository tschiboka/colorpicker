export default {
    "patternName": "simple dotted",
    "backgroundSize": [
        {
            "value": "3",
            "unit": "px"
        },
        {
            "value": "3",
            "unit": "px"
        }
    ],
    "gradients": [
        {
            "name": "dots",
            "visible": true,
            "type": "radial",
            "angle": "90",
            "repeating": true,
            "repeatingUnit": "px",
            "max": "3",
            "colorHints": [
                1
            ],
            "colors": [
                {
                    "color": "rgba(0, 0, 0, 0.2)",
                    "stop": 0
                },
                {
                    "color": "rgba(255, 255, 255, 0)",
                    "stop": 1
                },
                {
                    "color": "rgba(255, 255, 255, 0)",
                    "stop": 3
                }
            ],
            "radial": {
                "position": {
                    "keyword": {
                        "x": "center",
                        "y": "center"
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
        }
    ]
}