
const arr=[];
const data=location.search;
const urlParams = new URLSearchParams(data);
for (const [key, value] of urlParams) {
    console.log(`${key}:${value}`);
    const obj = {}
    obj[key] = value;
    arr.push(obj)
}
var temp = JSON.parse(arr[1].data);
var file = arr[2].inputFile;
console.log("ISKO DEKHO >>>", temp);
console.log("this is data sent >>>", file);

document.onload = document.getElementById("preview-src").src = "http://localhost:8080/static/"+arr[0].src;

const upload = async () => {
    var data = new FormData()
    data.append('input_file', file);
    data.append('inputs', JSON.stringify(temp));
    console.log(data);
    const result = await fetch( "http://localhost:8080/upload", {
        method: 'POST',
        headers:{
            flag : "true"
        },
        body: data
    })
    .then( res => res.json() )
    .then( res => {
        if( res.status == "success" ){

            // var element = document.getElementById("outputVid");
            console.log(res.fileName);
            return res.fileName;
            // element.setAttribute('href', "http://localhost:8080/static/" + res.fileName);
            // element.style.display = 'none';
            // element.click();
        };
    })
    console.log(result);
    return result
}

const insertLink = async () => {
    var finalDiv = document.getElementById("finalDiv");
    var vid = document.getElementById("videoGenerated");
    var h1Tag = document.createElement("h1");
    var h4Tag = document.createElement("h4");
    h1Tag.innerHTML = "Your video is being generated";
    h4Tag.innerHTML = "Please wait for 2-3 mins ...";
    vid.before( h1Tag );
    vid.before( h4Tag );

    var videoLink = document.createElement("a");
    videoLink.setAttribute('download', "download");
    var gifSpinner = document.createElement("img");
    gifSpinner.src = "http://localhost:8080/assets/loading.gif";
    gifSpinner.style.height = "100px";
    gifSpinner.style.width = "300px";
    vid.appendChild(gifSpinner);
    const link = async () => {
        const result = await upload()
        console.log(result);
        return result
    }
    (async () => {
        const videoName = await link();
        console.log(videoName);
        videoLink.setAttribute('href', "http://localhost:8080/static/" + videoName);
        videoLink.textContent = "here"
        finalDiv.innerHTML = "";
        h1Tag.innerHTML = "Download your ad ";
        vid.appendChild(h1Tag);
        vid.appendChild(videoLink);
        finalDiv.appendChild(vid);
        // vid.click();
    })();






    // link().then(response => console.log(response));
    // console.log(link);
    // setTimeout( () => {
    //     vid.innerHTML = "";

    //     vid.appendChild( videoLink );
    // }, 180000);

}

const stripe = Stripe('pk_test_51IuGGgHPVMu7FaWVTs3zB5xP5jQa1vSjifJMIsJ2LrjHhKQivQM1a0zuiOGlzumm23u6TBVZKrw7U1xO7LvOC4KP00FcfpRmxJ');
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element');

function initializePayment() {
    return fetch('/payments', { method: 'POST' })
        .then(res => res.text())
        .then(JSON.parse);
    }

async function confirmPayment(clientSecret) {
    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
        card: cardElement,
        },
    });
    if (result.error) {
        console.error(result.error);
    } else {
        console.log(result);
        insertLink();
    }
}

document.getElementById('pay-button')
.addEventListener('click', async () => {
    const { clientSecret } = await initializePayment();
    confirmPayment(clientSecret);
});
