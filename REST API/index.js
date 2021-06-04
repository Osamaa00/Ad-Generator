const express = require('express');
const multer = require('multer');
const {spawn} = require('child_process');
const stripe = require('stripe')('sk_test_51IuGGgHPVMu7FaWV7z0iAH3smkYIMpleISPKf04cLfw0JKOIse3GICvyaZPvc57Le3JBJEBavCVLwU48RB6jNPSP00muRF4pb9');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

const supportedImageExt = ['jpeg', 'png', 'jpg', 'svg'];
const path = require('path');
const { randomBytes, randomInt } = require('crypto');
var newFilename = [];
app.use(express.json());
app.use( '/assets', express.static('assets') );
app.use( '/navigate', express.static('navigate') );
// app.use( '/uploads', express.static('uploads') );
app.use('/static', express.static('templateImages'))
app.use('/static', express.static('templateMusic'))
app.use('/static',express.static('demoVideos'))
// app.use('/static',express.static('templateImages'))
// app.use('/static',express.static('css'))
// app.use('/static',express.static('js'))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, flag, access-control-allow-origin,Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


const checkTemplateName = ( template_name ) => {
    console.log("THISSS",template_name)
    switch ( template_name ){
        case "template1":
            return "Template_1.webM";
        case "template2":
            return "Template_2.webM";
        case "template3":
            return "Template_3.webM";
        case "template4":
            return "Template_4.webM";
        case "template5":
            return "Template_5.webM";
        case "template6":
            return "Template_6.webM";
        case "template7":
            return "Template_7.webM";
        case "template8":
            return "Template_8.webM";
        case "template9":
            return "Template_9.webM";
        case "template10":
            return "Template_10.webM";
        case "template11":
            return "Template_11.webM";
        case "template12":
            return "Template_12.webM";
        case "template13":
            return "Template_13.webM";
        case "template14":
            return "Template_14.webM";
        case "template15":
            return "Template_15.webM";
        case "template16":
            return "Template_16.webM";
        case "template17":
            return "Template_17.webM";
        case "template18":
            return "Template_18.webM";
        case "template19":
            return "Template_19.webM";
        case "template20":
            return "Template_20.webM";
    }
}
const store = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads');
    },
    filename: (req,file,cb)=>{
        var ext = file.originalname.split('.');
        console.log("i was ext", ext);
        newFilename.push( Date.now()+"--"+Math.floor(Math.random() * 2000000) + "." + ext[ext.length - 1] );
        console.log("error generated");
        cb(null,newFilename[newFilename.length - 1]);
    }
});

const modifyTextInput=(arr)=>{
    var st="";
    st += '['; 
    for(i=0;i<arr.length;i++){
        st+="'"+arr[i]+"'"+",";
    }
    st = st.slice(0,st.length-1);
    st += ']'
    console.log(st);
    return st
}

const upload = multer({  storage: store  });

// app.get('/getimage',(req,res)=>{
//     res.sendFile(path.join(__dirname, "/uploads/1620348016104--sample-mp4-file.mp4"));
// })

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "./index.html"));
})
app.get('/preview',(req,res)=>{
    res.sendFile(path.join(__dirname, `navigate.html`));    
})

// app.get('/navigation', ( req, res ) => {

//     const src = req.query.src;
//     const data = req.query.data;
//     const input_file = req.query.inputFile;
//     res.sendFile(path.join(__dirname, `./navigate.html`));
// })

app.post('/upload', upload.array('input_file', 2) ,(req, res) => {
    req.setTimeout(0);
    flag = false;
    if ( req.headers?.flag == "true" ){
        console.log("i was near a flag");
        flag = true;
    }
    console.log("done");
    // running python script
    console.log(newFilename);
    console.log("This the filenames array >>> ", newFilename);
    const data = req.body;
    console.log("raw----->>>>>>",data["input_file"])
    const temp = JSON.parse( data["inputs"] );
    console.log("Parsed-------->",temp);
    var uploadedFile=""; 
    var logoFile="";
    if(newFilename.length == 2){
        uploadedFile = 'uploads/' + newFilename[1];
        logoFile= 'uploads/' + newFilename[0];
    }
    else{
        console.log("i was in else ");
        uploadedFile = req.headers.video;
        logoFile= req.headers.logo;
    }
    newFilename=[];
    console.log("filename >>> ", uploadedFile);
    console.log("filename logo >>> ", logoFile);
    const templateName = checkTemplateName( temp.template_name );
    const templateMusic = 'templateMusic/' + temp.template_music;
    const textInputs = modifyTextInput( temp.text_inputs ); 
    const fontColor = temp.font_color;
    const fontStyle = temp.font_style;
    const fontFade = temp.font_fade;
    const fontSize = temp.font_size;
    // newFilename = Date.now()+"--"+file.originalname
    console.log( templateName, templateMusic, textInputs, fontColor, fontStyle, fontFade );

    console.log(temp);
    // console.log(JSON.parse(temp));
    // console.log(JSON.stringify(data["inputs"]));
    const outputFileName = Date.now()+"--ad"+'.mp4';
    var dataToSend;
    // // spawn new child process to call the python script
    if ( flag ){

        var python = spawn('python', ['testMoviepy.py', templateName, textInputs, uploadedFile, templateMusic, `${ fontSize },${ fontColor },${ fontFade },${ fontStyle },${ outputFileName },${ logoFile }`]);
    }

    else{

        var python = spawn('python', ['testMoviepy.py', templateName, textInputs, uploadedFile, templateMusic, `${ fontSize },${ fontColor },${ fontFade },${ fontStyle },${ outputFileName },${ logoFile }`, 1]);
    }

    // [["Text 1,,,,,,,"], ["Text 2"], ["Text 3"], ["TExt 4"], ["Text 5"]]

    // const python = spawn('python', ['--version'])
    // // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log("This is data >>> ", dataToSend);
    });
    // // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if ( code == 0 ){
            res.json( {
                status : "success",
                fileName : outputFileName,
                file_video: uploadedFile,
                file_logo: logoFile

                } );

                var ext = uploadedFile.split('.')
                if ( !supportedImageExt.includes(ext[ext.length - 1]) ){
                    
                    fs.unlink(uploadedFile.slice(8, uploadedFile.length), (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        else{
                            console.log(uploadedFile.slice(8, uploadedFile.length) ,"Successfully removed")
                        }
                    })
                }
            }
        
        else{
            res.json({
                status : "error"
            })
        }
    //     // send data to browser
        // res.json(dataToSend.slice(72, dataToSend.length - 72))
        // res.json(dataToSend)
    });
})

app.post('/payments', async (req, res) => {
    const { client_secret } = await stripe.paymentIntents.create({
      amount: 2500,
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.send(JSON.stringify({ clientSecret: client_secret }));
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))