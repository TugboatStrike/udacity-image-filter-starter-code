import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get('/filteredimage', async function(req, res) {
    const page_url = req.query.image_url;
    if (!page_url) {
      return res.status(400).send({message: 'page_url query missing'})
    }
    console.log('chopped url: ', page_url.substr(page_url.length -4));
    
    console.log('url: ', page_url);

    /*
    const testFilt = filterImageFromURL(page_url)
      .then((infoTest) => console.log('info success: ', infoTest))
      .catch(err => console.log('err: ', err))
    console.log('test info: ', testFilt);
    */

    try {
      const localImageRepo = await filterImageFromURL(page_url)
      console.log('local image repo: ', localImageRepo);
      //localImageRepo.replace(`\\`, '/')
      //console.log('replaced: ', localImageRepo);
      
      res.status(200).send({message: localImageRepo})
      //res.status(200).sendFile(localImageRepo)

      /*
      app.get('/user/:uid/photos/:file', function(req, res){
        var uid = req.params.uid
          , file = req.params.file;

        req.user.mayViewFilesFrom(uid, function(yes){
          if (yes) {
            res.sendFile('/uploads/' + uid + '/' + file);
          } else {
            res.send(403, 'Sorry! you cant see that.');
          }
        });
      });
      */

      //const localImageRepoArray = localImageRepo.split('/')
      //console.log('split repo: ', localImageRepoArray);
      try {
        deleteLocalFiles([localImageRepo])
        console.log('image deleted: ');
        
      } catch (error) {
        console.log('err deleting file');
        
      }
      
      
    } catch (error) {
      console.log('err of try: ', error);
      res.status(400).send({message: 'Image was not found!'})
      
    }
    
    //console.log('local image repo outside try', localImageRepo);
    
    //const testFilt = await filterImageFromURL(page_url)
    //  .then(infoTest => console.log('infoTest: ', infoTest))
    //  .catch(err => console.log('err: ', err))
    //console.log('filter image: ', testFilt)
    
    //res.status(200).send({ message: `got url: ${page_url}`})
    
  })


  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();