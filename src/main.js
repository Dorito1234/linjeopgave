document.addEventListener('DOMContentLoaded', () => {
    const calculatorWrapper = document.getElementById('calculator');
    const calculatorHistory = document.getElementById('calculatorHistory');
    const calculatorInput = document.getElementById('calculatorInput');
    const calculatorButtons = document.getElementById('calculatorButtons');

    calculatorInput.addEventListener('blur', () => {
        setTimeout(() => calculatorInput.focus(), 10);
    });

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
                    calculatorInput.value += before;
                    const inputLength = calculatorInput.value.length;
                    calculatorInput.value += after;
                    calculatorInput.setSelectionRange(inputLength, inputLength);
                    break;
            }
        });
    }
}, { once: true });
