var expect = require('expect');

var {generateMessage} = require('./message.js');

describe('generateMessage', function() {
  it('should generate correct message object', function(){
    var from = "Jan";
    var text = 'A string';
    var message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});


  });
});
