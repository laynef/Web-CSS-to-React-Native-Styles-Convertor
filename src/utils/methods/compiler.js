const fs = require('fs')
const path = require('path')
const { getJsonStrucutre } = require('./constants');


module.exports = {

    compileCssToJson: (cssPath) => {
        const cssString = fs.readFileSync(cssPath, { encoding: 'utf8' });
        const temp = getJsonStrucutre();
        const cssArray = cssString.split('}');
        const cssInnerArray = cssArray.map(str => {
            str += '}';

            const innerString = str.split('{');
            innerString[1] += '{';

            const object = {};
            object[innerString[0]] = JSON.parse(innerString[1].replace(/;/g, ',').split(':').map(e => `"${e}"`).join(':'));
            return object;
        });
        const objectFormat = cssInnerArray.reduce((acculum, item) => {
            acculum = { ...acculum, ...item };
            return acculum;
        }, {});
        temp.children = objectFormat;
        return temp;
    },

    compileJsonToCss: (jsonPath) => {
        const json = require(jsonPath);
        if (!json.attributes || !json.children) {
            console.error('Wrong JSON format');
            return;
        }

        let cssString = '';
        for (let cssTagName in json.children) {
            cssString += (cssTagName + ' {');
            const cssAttributes = json.children[cssTagName].attributes;
            for (let key in cssAttributes) {
                cssString += (key + ': ' + cssAttributes[key] + ';\n')
            }
            cssString += '}\n';
        }

        return cssString;
    },
    
};