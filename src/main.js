const sandbox = document.createElement('iframe');
sandbox.src = 'about:blank';

document.addEventListener('DOMContentLoaded', () => {
    document.body.append(sandbox);

    const calculatorHistory = document.getElementById('calculatorHistory');
    const calculatorInput = document.getElementById('calculatorInput');
    const calculatorButtons = document.getElementById('calculatorButtons');
    const backspaceButton = document.getElementById('backspaceButton');

    const handleMathError = errorEvent => {
        console.warn(errorEvent);
    }

    const calculateInput = (mathQuestion, pushToHistory) => {
        if (!/\*\*|[^0-9\(\)\+\-\/\*\^\.π√⌊⌋⌈⌉ ]/ug.test(mathQuestion)) {
            const parsed = mathQuestion.replaceAll('^', '**')
                .replaceAll('π', Math.PI)
                .replaceAll('√', 'Math.sqrt')
                .replaceAll('⌊', 'Math.floor(')
                .replaceAll('⌈', 'Math.ceil(')
                .replaceAll(/⌋|⌉/gu, ')')

            let mathResult;
            try {
                mathResult = sandbox.contentWindow.eval?.(`"use strict";${parsed}`);
            } catch {
                handleMathError('Invalid arithmetic operators');
                return mathQuestion;
            }
            
            mathResult = Number(mathResult.toFixed(6));

            if (pushToHistory) {
                const resultWrapper = document.createElement('div');
                resultWrapper.className = 'historyLine';
    
                const questionElement = document.createElement('span');
                const resultElement = document.createElement('span');
    
                questionElement.innerText = mathQuestion;
                resultElement.innerText = mathResult;
    
                resultWrapper.append(questionElement, resultElement);

                calculatorHistory.append(resultWrapper);

                calculatorHistory.scrollTop = calculatorHistory.scrollHeight;
            }

            return mathResult;
        }

        handleMathError('Unknown expression');
        return innerText= "Syntax Error";
    }

    const updateBackspaceButton = (evt, shouldAC) => {
        if (evt.shiftKey && shouldAC) backspaceButton.innerText = 'AC';
        else backspaceButton.innerText = '⇐';
    }

    document.addEventListener('keydown', evt => updateBackspaceButton(evt, true));
    document.addEventListener('keyup', evt => updateBackspaceButton(evt, false));

    calculatorInput.addEventListener('blur', () => {
        const selectionRange = [calculatorInput.selectionStart, calculatorInput.selectionEnd];
        calculatorInput.focus();
        calculatorInput.setSelectionRange(...selectionRange);
    });
    calculatorInput.focus();

    calculatorInput.addEventListener('keydown', evt => {
        if (evt.key === 'Enter') calculatorInput.value = calculateInput(calculatorInput.value, true);
    });

    for (const calculatorButton of calculatorButtons.children) {
        calculatorButton.addEventListener('mouseup', evt => {
            const clickedButton = evt.target;
            const before = clickedButton.getAttribute('before') || '';
            const after = clickedButton.getAttribute('after') || '';

            switch (before) {
                case 'BACKSPACE':
                    if (backspaceButton.innerText === 'AC') calculatorInput.value = '';
                    // FIXME: Remove value from selectionEnd, not value end
                    else calculatorInput.value = calculatorInput.value.substring(0, calculatorInput.value.length - 1);
                    break;
                case 'ENTER':
                    calculatorInput.value = calculateInput(calculatorInput.value, true);
                    break;
                default:
                    const selectionRange = [calculatorInput.selectionStart, calculatorInput.selectionEnd];
                    const { selectionStart } = calculatorInput;
                    calculatorInput.value = [
                        calculatorInput.value.substring(0, selectionStart),
                        before,
                        after,
                        calculatorInput.value.substring(selectionStart)
                    ].join('');

                    if (after) {
                        calculatorInput.setSelectionRange(...new Array(2).fill(selectionRange[0] + before.length));
                    } else {
                        calculatorInput.setSelectionRange(...selectionRange.map(num => num + before.length));
                    }
                    break;
            }
        });
    }
}, { once: true });
