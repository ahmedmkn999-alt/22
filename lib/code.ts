export function generateCode() {

let code = "";

for (let i = 0; i < 9; i++) {

code += Math.floor(Math.random()*10);

}

return code;

}
