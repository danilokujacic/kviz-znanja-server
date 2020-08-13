import { RequestHandler } from 'express';

export const historyHandler: RequestHandler = (req, res, next) => {
    const questions = [
        {
            question: 'Koje godine je ubijen Franc Ferdinand',
            answers: [
                { answer: '1999.', correct: false },
                { answer: '1918.', correct: false },
                { answer: '1995.', correct: false },
                { answer: '1914.', correct: true },
            ],
        },
        {
            question: 'Koje godine je ubijen Galileo Galilej',
            answers: [
                { answer: '1999.', correct: false },
                { answer: '1918.', correct: false },
                { answer: '1995.', correct: false },
                { answer: '1914.', correct: true },
            ],
        },
    ];

    res.status(201).json({
        questions,
    });
};
export const geographicHandler: RequestHandler = (req, res, next) => {
    const questions = [
        {
            question: 'Dje se nalazi Podgorica',
            answers: [
                { answer: 'Crna Gora.', correct: false },
                { answer: 'Valjevo.', correct: false },
                { answer: 'Srbija.', correct: false },
                { answer: 'Zimbambwe.', correct: true },
            ],
        },
    ];

    res.status(200).json({
        questions,
    });
};
export const socialHandler: RequestHandler = (req, res, next) => {
    const questions = [
        {
            question: 'Koje godine je Milo postao presjednik',
            answers: [
                { answer: '1999.', correct: false },
                { answer: '1918.', correct: false },
                { answer: '1995.', correct: false },
                { answer: '1914.', correct: true },
            ],
        },
    ];

    res.status(201).json({
        questions,
    });
};
export const musicHandler: RequestHandler = (req, res, next) => {
    const questions = [
        {
            question: 'Kada se popularna grupa U2 povukla',
            answers: [
                { answer: '1999.', correct: false },
                { answer: '1918.', correct: false },
                { answer: '1995.', correct: false },
                { answer: '1914.', correct: true },
            ],
        },
    ];

    res.status(201).json({
        questions,
    });
};
