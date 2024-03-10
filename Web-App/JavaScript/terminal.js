/*//// Terminal Methods ////*/

print_T = (str, clr='#FFFFFF', input=false) => {
    Terminal.scrollTo(0, Terminal.scrollHeight);
    if (input) str = str.replace(/[<>]/g, '');
    str = str.replace(/\n/g, '<br>');

    console.log(str);

    if (clr == 'ERR') clr = '#a63d4f';
    Terminal.innerHTML += `${Terminal.innerHTML == '' ? '' : '<br>'}${input ? '>  ' : ''}<span class="line" style="color:${clr}">${str}</span>`;
}

clear = () => { Terminal.innerHTML = ''; }

/*//// Terminal Events ////*/
document.addEventListener('keyup', (event) => {
    if (event.key == 'Enter') {
        print_T(TerminalInput.value, '#bababa', true);
        Input_Buffer = TerminalInput.value;
        TerminalInput.value = '';
    }
});