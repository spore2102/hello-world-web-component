import {covariance, Matrix} from 'ml-matrix';


// https://www.turing.com/kb/guide-to-principal-component-analysis
// https://www.kaggle.com/code/shrutimechlearn/step-by-step-pca-with-iris-dataset/notebook
export function getPcaResults(dataset) {
    // get last items, which should be names
    let datasetNames = dataset.map((el) => {
        return el[el.length-1];
    });

    // get all elements except the last one (which is name)
    let datasetValues = dataset.map((el) => {
        // alternative: change this column to a number representing title
        return el.slice(0,-1)
    });

    let matrixDataset = getMatrix(datasetValues);

    matrixDataset = standardise(matrixDataset)
    let covarianceMatrix = getCovarianceMatrix(matrixDataset);

    //Calculate the eigenvalues and eigenvectors for the covariance matrix


    let results = {x:[], y:[], z:[], k:[]};

    matrixDataset.to2DArray().forEach((el, index) => {
        results.x[index] = el[0];
        results.y[index] = el[1];
    })

    return results;
}

/**
 * The range of variables is calculated and standardized in this process to analyze the contribution of each variable equally.
 * Calculating the initial variables will help categorize the variables that are dominating the other variables of small ranges.
 * This will help attain biased results at the end of the analysis.
 * Formula to transform the variables of the same standard:
 * z = (value - mean) / standard deviation
 *
 * @param matrixDataset
 */

function standardise(matrixDataset) {
    // TODO: validate if matrixDataset is a Matrix
    if(!matrixDataset instanceof Matrix) {
        throw ("matrixDataset should be an instance of a Matrix");
    }

    // subtract each column's mean from each value of the column
    for(let colIndex = 0; colIndex < matrixDataset.columns; colIndex++) {
        let column = matrixDataset.getColumnVector(colIndex);
        console.log("mean: ", column.mean());
        column.sub(column.mean()) // subtract column's mean value from each element of the column
        console.log("std: ", column.standardDeviation());
        column.divide(column.standardDeviation()) // divide each column's element by standard deviation

        matrixDataset.setColumn(colIndex, column);
    }

    return matrixDataset;
}

/**
 *
 * @param standardizedMatrixDataset
 */
function getCovarianceMatrix(standardizedMatrixDataset) {
    return covariance(standardizedMatrixDataset);
}

function getMatrix(dataset) {
    return new Matrix(dataset)
}

