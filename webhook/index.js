const http = require('http'), {
    exec
} = require('child_process');

const PORT = 8080, 
    PATH = '../';

const deployServer = http.createServer(function(request, response) {
  console.log(request.url.search(/deploy\/?$/i) > 0);
  if (request.url.search(/deploy\/?$/i) > 0) {

    // const commands = [
    //   'cd ' + PATH,
    //   'git pull'
    // ].join(' && ');
    const commands = 'git pull';
    exec(commands, function(err, out, code) {
      if (err) {
        console.log(err);
        response.writeHead(500);
        response.end('Server Internal Error.');
        return ;
      }
      // if (err instanceof Error) {
      //   response.writeHead(500);
      //   response.end('Server Internal Error.');
      //   throw err;
      // }
      console.log('---------- *** pull success *** ----------\n', out);
      // process.stderr.write(err);
      // process.stdout.write(out);
      response.writeHead(200);
      response.end('Deploy Done.');
    });

  } else {

    response.writeHead(404);
    response.end('Not Found.');

  }
});
console.log(`listen port at ${PORT}`);
deployServer.listen(PORT);