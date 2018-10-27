var http = require("http");
var url = require("url");
var mime = require("mime");
var fs = require("fs");
var os = require("os");

var serverStart = function(route)
{
	function onRequest(request, response)
	{
		var platform = os.platform();
		var STATIC_PATH = __dirname + (platform=="win32" ? "\\public" : "/public");
		var pathName = url.parse(request.url).pathname;
		var fullPath = STATIC_PATH + pathName;
		console.log(fullPath);
		var getMine = mime.getType(fullPath);

		if(pathName == (platform=="win32" ? "\\" : "/"))
		{
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write("Hello memeda");
			response.end();
		}
		else
		{
			fs.stat(fullPath,function (err, stat)
			{
				if(err)
				{
					console.log("fs.stat  err: "+err);
					response.writeHead(404);
					response.end("No Such File");
					return;
				}

				response.writeHead(200, {
					"content-type":getMine,
					"content-length":stat.size
				});

				fs.readFile(fullPath, function (err, data)
				{
					if(err)
					{
						throw err;
					}
					response.end(data);
				})
			})
		}
		console.log("Request for \"" + fullPath + "\" received");
		
		route(pathName);
	}
	
	http.createServer(onRequest).listen(8888);
	console.log("Server is running !!!");
}

exports.serverStart = serverStart;