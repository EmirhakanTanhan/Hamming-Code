const createHammingCode = (size) => {
    //Note: size must be bigger then 4 and be even number EX:(2^4 = 16), (2^6 = 64), (2^8 = 256)
    //[Actually Hamming Code works with an odd number of two, but with the algorithm I come up with it won't work]
    const dataArr = [];
    const conditionsArr = [];

    const positionArr = [];
    for (let index = 0; index < Math.pow(2, size); index++) {
        //Turn indexes of bits to 4 digit binary
        positionArr[index] = parseInt(index).toString(2).padStart(size, "0");

        //Define redundant bits [0,1,2,4,8...]
        if (positionArr[index].indexOf('1') === positionArr[index].lastIndexOf('1')) conditionsArr.push(index);
    }

    //Simulate a (2^size-(1+size)) bit data chunk inside dataArr (redundant bits are set to 0)
    for (let i = 0; i < Math.pow(2, size); i++) {
        if (conditionsArr.includes(i)) dataArr[i] = 0;
        else dataArr[i] = Math.floor(Math.random() * 2);
    }

    //duplicate dataArr to compare later
    const dataArrOriginal = [];
    dataArr.map(elem => dataArrOriginal.push(elem));

    //Set the positions that are going to be controlled into the controller
    const controller = [];
    for (let i = 1; i < conditionsArr.length; i++) {
        //Check the matching digits of a 4 digit binary e.g.[(0010, 0011, 0110, 0111, 1010, 1011, 1110, 1111) -> 3rd digits are 1]
        let positionBinaryArr = [];
        positionArr.map((values, index) => {
            if (values.substr(i - 1, 1) === '1') positionBinaryArr.push(index);
        });

        controller[i - 1] = positionBinaryArr; //Gather all of position arrays into one
    }
    controller.reverse(); //Controler gets reversed in the process above, here we reverse it back

    //Update redundant bits recording to evennes of 1 digits in their area
    for (let i = 0; i < controller.length; i++) {
        let evenOneDigitCheck = 0;
        for (let position of controller[i]) {
            if (dataArr[position] === 1) evenOneDigitCheck += 1;
        }
        evenOneDigitCheck % 2 ? dataArr[conditionsArr[i+1]] = 1 : dataArr[conditionsArr[i+1]] = 0 //if 1 digits are even, redundant bit is changed to 1
    }

    //Update index zero bit recording to evennes of 1 digits in all data
    let evenOneDigitCheck = 0;
    dataArr.forEach((digit) => {
        if (digit === 1) evenOneDigitCheck += 1;
    });
    evenOneDigitCheck % 2 ? dataArr[0] = 1 : dataArr[0] = 0;

    //Compare the initial redundant bits with the updated redundant bits
    const controllerComparison = [];
    for (let i = 0; i < conditionsArr.length; i++) {
        controllerComparison[conditionsArr[i]] = dataArrOriginal[conditionsArr[i]] + ' -> ' + dataArr[conditionsArr[i]];
    }

    // console.log('conditionsArr (Indexes of redundant bits) 1+(size)\n', conditionsArr);
    // console.log('controller (indexes to be controlled) (size)*1\n', controller);
    // console.log('positionArr (4 digit bits of indexes) (size)*4\n', positionArr);
    // console.log('dataArrOriginal (Original data array) (size)*4\n', dataArrOriginal);
    // console.log('dataArr (Data array which redundant bits are updated, also this is the final product) (size)*4\n', dataArr);
    // console.log('controllerComparison (Comparison of data arrays) (size)*4\n', controllerComparison);

    return dataArr;
};

const createNoiseInData = (data) => {
    const index = Math.floor(Math.random() * data.length); //Choose random index
    data[index] = data[index] ? 0 : 1; //Revert the binary digit in the choosen index

    return data;
};

const fixNoiseInData = (data) => {
    const size = Math.sqrt(data.length); //Calculate the size of data
    const conditionsArr = [];

    const positionArr = [];
    for (let index = 0; index < Math.pow(2, size); index++) {
        //Turn indexes of bits to 4 digit binary
        positionArr[index] = parseInt(index).toString(2).padStart(size, "0");

        //Define redundant bits [0,1,2,4,8...]
        if (positionArr[index].indexOf('1') === positionArr[index].lastIndexOf('1')) conditionsArr.push(index);
    }

    //Set the positions that are going to be controlled into the controller
    const controller = [];
    for (let i = 1; i < conditionsArr.length; i++) {
        //Check the matching digits of a 4 digit binary e.g.[(0010, 0011, 0110, 0111, 1010, 1011, 1110, 1111) -> 3rd digits are 1]
        let positionBinaryArr = [];
        positionArr.map((values, index) => {
            if (values.substr(i - 1, 1) === '1') positionBinaryArr.push(index);
        });

        controller[i - 1] = positionBinaryArr; //Gather all of position arrays into one
    }
    controller.reverse(); //Controler gets reversed in the process above, here we reverse it back

    console.log(data)
    console.log(positionArr)
    console.log(conditionsArr)
    console.log(controller)
}

let data = createHammingCode(4);
data = createNoiseInData(data);
data = fixNoiseInData(data);
