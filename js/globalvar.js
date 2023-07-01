let globalVar = {
    globalSentences : [],
    sentenceInfo : {
        dbId : "",
        sentenceId : "",
        category : "",
        wordIndexChunks : [],
        wordChunks: [],
        sentenceLen : 0,
        englishText : "The library has a number of collections of historical and social statistical publications.",
        mediaURL : "/data/wfd-media/wfd1.mp3",
        audioStopTimes : []
    }
}

export let sentenceInfo = {
    sentenceId : "",
    category : "",
    wordIndexChunks : [],
    wordChunks: [],
    sentenceLen : 0,
    englishText : "The library has a number of collections of historical and social statistical publications.",
    mediaURL : "/data/wfd-media/wfd1.mp3",
    audioStopTimes : []
}

export const sentenceList = [
    {
        sentenceId : "rs_1",
        wordIndexChunks : [[0, 1, 2, 3, 4], [5, 6]],
        wordChunks: [ "She has a small business", "about toys."],
        englishText : "She has a small business about toys.",
        mediaURL : "https://res.cloudinary.com/di8upirgz/video/upload/v1687594754/pte-listening-tool/rs1_rkuchi.mp3",
        audioStopTimes : [1.627202, 3.024]
    },

    {
        sentenceId : "rs_2", 
        wordIndexChunks : [[0, 1, 2], [3, 4, 5], [6, 7, 8, 9]],
        wordChunks: ["It is expected", "that all students", "have their own laptops."],
        englishText : "It is expected that all students have their own laptops.",
        mediaURL : "/data/rs-media/rs2.mp3",
        audioStopTimes : [1.239218, 2.056911, 3.792]

    },
    {
        "sentenceId": "rs_3",
        "wordIndexChunks": [
            [
                0,
                1,
                2,
                3,
                4,
                5
            ],
            [
                6,
                7,
                8,
                9,
                10,
                11
            ]
        ],
        "englishText": "You have to submit the project by the end of the week.",
        "mediaURL": "/data/rs-media/rs3.mp3",
        "audioStopTimes": [
            2.042646,
            3.418572
        ],
        "wordChunks": [
            "You have to submit the project",
            "by the end of the week."
        ]
    },
    {
        "sentenceId": "rs_4",
        "wordIndexChunks": [
            [
                0,
                1,
                2,
                3
            ],
            [
                4,
                5,
                6
            ],
            [
                7,
                8,
                9,
                10
            ]
        ],
        "englishText": "None of the students found it difficult to get a job.",
        "mediaURL": "/data/rs-media/rs4.mp3",
        "audioStopTimes": [
            1.31169,
            2.273677,
            3.221407
        ],
        "wordChunks": [
            "None of the students",
            "found it difficult",
            "to get a job."
        ]
    },
    {
        "sentenceId": "rs_5",
        "wordIndexChunks": [
            [
                0,
                1,
                2
            ],
            [
                3,
                4,
                5,
                6,
                7
            ],
            [
                8,
                9
            ]
        ],
        "englishText": "His particular interest is in the eighteenth century French society.",
        "mediaURL": "/data/rs-media/rs5.mp3",
        "audioStopTimes": [
            1.63134,
            2.889079,
            4.32
        ],
        "wordChunks": [
            "His particular interest",
            "is in the eighteenth century",
            "French society."
        ]
    },
    {
        "sentenceId": "rs_6",
        "wordIndexChunks": [
            [
                0,
                1
            ],
            [
                2,
                3
            ],
            [
                4,
                5,
                6
            ],
            [
                7,
                8,
                9
            ]
        ],
        "englishText": "Such behaviors are regarded as a deviation of the norm.",
        "mediaURL": "/data/rs-media/rs6.mp3",
        "audioStopTimes": [
            1.279576,
            2.023752,
            2.85465,
            3.638861
        ],
        "wordChunks": [
            "Such behaviors",
            "are regarded",
            "as a deviation",
            "of the norm."
        ]
    },
    {
        "sentenceId": "wfd_1",
        "wordIndexChunks": [
            [
                0,
                1
            ],
            [
                2,
                3,
                4,
                5,
                6
            ],
            [
                7,
                8
            ],
            [
                9,
                10,
                11,
                12
            ]
        ],
        "englishText": "The library has a number of collections of historical and social statistical publications.",
        "mediaURL": "/data/wfd-media/wfd1.mp3",
        "audioStopTimes": [
            0.653111,
            1.932013,
            2.780301,
            5.13771
        ],
        "wordChunks": [
            "The library",
            "has a number of collections",
            "of historical",
            "and social statistical publications."
        ]
    },
    {
        "sentenceId": "wfd_2",
        "wordIndexChunks": [
            [
                0,
                1,
                2,
                3,
                4
            ],
            [
                5,
                6
            ],
            [
                7,
                8,
                9,
                10
            ],
            [
                11,
                12
            ]
        ],
        "englishText": "Foods containing too much sugar and calories have little or no nutritional value.",
        "mediaURL": "/data/wfd-media/wfd2.mp3",
        "audioStopTimes": [
            1.50127,
            2.147021,
            3.055633,
            4.205625
        ],
        "wordChunks": [
            "Foods containing too much sugar",
            "and calories",
            "have little or no",
            "nutritional value."
        ]
    }
]

export default globalVar;

