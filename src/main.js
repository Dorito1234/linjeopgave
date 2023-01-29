const sandbox = document.createElement('iframe');
sandbox.src = 'about:blank';
sandbox.credentialless = true;

document.addEventListener('DOMContentLoaded', () => {
    const calculatorHistory = document.getElementById('calculatorHistory');
    const calculatorInput = document.getElementById('calculatorInput');
    const calculatorButtons = document.getElementById('calculatorButtons');
    const backspaceButton = document.getElementById('backspaceButton');

    const calculateInput = (mathQuestion, historyElement) => {
        // - Create about:blank iframe
        // - Validate mathQuestion with RegEx condition (allow 0-9 () + - / * ^ . π √)
        // If condition is unmet, throw an Unknown Expression error to the user
        // Else,
            // - Replace all special signs with their JavaScript equivalents (^ > **, π > 3.1415926535, √ > Math.sqrt)
            // Run the condition in the previously made iframe (so it can't escape and create an attack vector) with eval()
            // Push mathQuestion and eval result to historyElement in new <p> tag
            // Return eval result

        if (/\*\*|[^0-9\(\)\+\-\/\*\^\.π√]/ug.test(mathQuestion)) {
            const parsed = mathQuestion.replaceAll('^', '**')
                .replaceAll('π', '3.1415926535')
                .replaceAll('√', 'Math.sqrt');
        } else {

        }
    }

    let shouldAllClear = false;
    const updateBackspaceButton = (evt, shouldAC) => {
        if (evt.shiftKey && shouldAC) {
            shouldAllClear = true;
            backspaceButton.innerText = 'AC';
        } else {
            shouldAllClear = false;
            backspaceButton.innerText = '⇐';
        }
    }

    document.addEventListener('keydown', evt => updateBackspaceButton(evt, true));
    document.addEventListener('keyup', evt => updateBackspaceButton(evt, false));

    calculatorInput.addEventListener('blur', () => {
        const selectionRange = [calculatorInput.selectionStart, calculatorInput.selectionEnd];
        calculatorInput.focus();
        calculatorInput.setSelectionRange(...selectionRange);
    });
    calculatorInput.focus();

    for (const calculatorButton of calculatorButtons.children) {
        calculatorButton.addEventListener('mouseup', evt => {
            const clickedButton = evt.target;
            const before = clickedButton.getAttribute('before') || '';
            const after = clickedButton.getAttribute('after') || '';

            switch (before) {
                case 'BACKSPACE':
                    if (shouldAllClear) calculateInput.value = '';
                    calculatorInput.value = calculatorInput.value.substring(0, calculatorInput.value.length - 1);
                    break;
                case 'ENTER':
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
