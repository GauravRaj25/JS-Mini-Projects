const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy-button]");
const copyMsg = document.querySelector("[data-copy-message]");

const inputSlider = document.querySelector("[data-length-slider]");
const lengthDsiplay = document.querySelector("[data-length]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const indicator = document.querySelector("[data-indicator]");const genrateButton = document.querySelector(".generateButton");
const symbols = "!@#$%^&*()_+[]{}|;:',.<>?/`~";


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

// set circle colour to grey by default 

// set password length 
 function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDsiplay.innerText = passwordLength;
 }

//  set indicator colour
function setIndicator(color){
    indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max){
   return  Math.floor(Math.random()*(max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
   return String.fromCharCode (getRandomInteger(97, 123));
}


function generateUpperCase(){
    return String.fromCharCode (getRandomInteger(65, 91));
}


function generateSymbols(){
    const randmNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randmNum);
}


function calStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true ;
    if(lowercaseCheck.checked) hasLower = true ;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSymbol = true;


    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
         (hasNum || hasSymbol) && 
         passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copy(){
   try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
   }
   catch(e){
      copyMsg.innerText = "failed";
   }
    // to make copy wala span visible   
    copyMsg.classList.add("active");

    setTimeout(() => {
     copyMsg.classList.remove("active");
    },2000);


}

function shufflePassword(array){
    // fishers yates method
    for(let i= array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array [j];
        array[j] = temp;
    }

    let str = " ";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copy();
});

genrateButton.addEventListener('click', () =>{
    if(checkCount == 0)
         return;
    if(passwordLength < checkCount){
         passwordLength = checkCount;
        handleSlider();
    }

    // lets start the journey to find the new password
    console.log("starting the journey");
    // remove old password
    password = "";

    // lets put the stuff mentioned in the checkboxes

    // if(uppercaseCheck.checked){
    //     password = generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password = generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password = generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password = generateSymbols();
    // }
    

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);


    // compulsory addition 

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("compulsory addition done");
    
    // reamining addition 

    for(let i=0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRandomInteger(0, funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("remaining addition done");

    // shufffle password
    
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    // show in th UI
    passwordDisplay.value = password;
    console.log("UI done");

    // calculate strength
    calStrength();
    

});
