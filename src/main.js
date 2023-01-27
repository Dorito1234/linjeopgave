document.addEventListener('DOMContentLoaded', () => {
    const calculatorWrapper = document.getElementById('calculator');
    const calculatorHistory = document.getElementById('calculatorHistory');
    const calculatorInput = document.getElementById('calculatorInput');
    const calculatorButtons = document.getElementById('calculatorButtons');

    const calculateInput = stringInput => {
        
    }

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
