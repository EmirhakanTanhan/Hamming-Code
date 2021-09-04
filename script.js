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

    // console.log('createHammingCode() | conditionsArr (Indexes of redundant bits) 1+(size)\n', conditionsArr);
    // console.log('createHammingCode() | controller (indexes to be controlled) (size)\n', controller);
    // console.log('createHammingCode() | positionArr ((size) digit bits of indexes) 2^(size)\n', positionArr);
    // console.log('createHammingCode() | dataArrOriginal (Original data array) 2^(size)\n', dataArrOriginal);
    console.log('createHammingCode() | dataArr (Data array which redundant bits are updated, also this is the final product) 2^(size)\n', dataArr);
    console.log('createHammingCode() | controllerComparison (Comparison of data arrays) 1+(size)\n', controllerComparison);

    return dataArr;
};

const createNoiseInData = (data) => {
    const index = Math.floor(Math.random() * data.length); //Choose random index
    data[index] = data[index] ? 0 : 1; //Revert the binary digit in the choosen index

    console.log('createNoiseInData() | index (Index of corrupted bit)\n', index);

    return data;
};

const resolveHammingCode = (dataArr) => {
    const size = Math.log2(dataArr.length); //Calculate the size of data
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
        //Controler gets reversed in the process above, and we want it to be reversed
    }

    //Check redundant bits for evennes in their area
    let checker = [];
    for (let i = 0; i < controller.length; i++) {
        let evenOneDigitCheck = 0;
        for (let position of controller[i]) {
            if (dataArr[position] === 1) evenOneDigitCheck += 1;
        }
        //If redundant bit is correct, checker gets set to 0, if not, it gets set to 1
        evenOneDigitCheck % 2 ? checker[i] = 1 : checker[i] = 0
    }

    //Convert checker array into string EX:([0,1,1,0] => '0110')
    let corruptedBitIndex;
    corruptedBitIndex = checker.join('');
    //Turn binary to decimal, that 4 or more bit digit gives the index of the corrupted bit EX:('0110' => 6) index 6 bit is corrupted
    corruptedBitIndex = parseInt(corruptedBitIndex, 2);

    //Duplicate corrupted-or-not data into the fixedDataArr
    const fixedDataArr = [];
    dataArr.map(elem => fixedDataArr.push(elem));

    //Fix corrupted bit
    fixedDataArr[corruptedBitIndex] = fixedDataArr[corruptedBitIndex] ? 0 : 1;

    // console.log('resolveHammingCode() | conditionsArr (Indexes of redundant bits) 1+(size)\n', conditionsArr);
    // console.log('resolveHammingCode() | controller (Indexes to be controlled) (size)\n', controller);
    // console.log('resolveHammingCode() | positionArr ((size) digit bits of indexes) 2^(size)\n', positionArr);
    // console.log('resolveHammingCode() | dataArr (Data array which may be corrupted) 2^(size)\n', dataArr);
    console.log('resolveHammingCode() | fixedDataArr (Fixed data array, if the given data was not corrupted, it is the same data array. Also this is the final product) 2^(size)\n', fixedDataArr);

    return fixedDataArr;
}

let data = createHammingCode(5);
data = createNoiseInData(data);
data = resolveHammingCode(data);
