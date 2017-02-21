var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {

    it('should generate message object', () => {
        var text ='asdasd';
        var from = 'asd@asd.com';
        var messageObj = generateMessage(from, text);
        expect(messageObj).toBeA(Object);
        expect(messageObj.text).toBe(text);
        expect(messageObj.from).toBe(from);
        expect(messageObj.createdAt).toBeA('number');
    });
});