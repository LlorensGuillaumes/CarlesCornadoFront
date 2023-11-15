const TreatyArray = {
alphabetical: (arrayToSort, sortCamp) => {
    const sortedArray = arrayToSort.sort((a, b) => a[sortCamp].localeCompare(b[sortCamp]));
    return sortedArray;
},

dropDuplicatesAndEmpty: (array) => {
    const uniqueArray = Array.from(new Set(array));
    const nonEmptyArray = uniqueArray.filter(item => item !== '');
    return nonEmptyArray;
},
};


export default TreatyArray;
