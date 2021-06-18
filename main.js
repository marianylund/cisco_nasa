import xapi from 'xapi';

function getJSON(){
const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
return xapi.Command.HttpClient.Get({ Url: url })
  .then(r => JSON.parse(r.Body))
  .then(res => res)
}

async function init() {

  addDailyPanel();

  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(async (event) => {
    if (event.PanelId === 'nasaPanel') {
      console.log("Clicked!");
      const JSON = await getJSON();
      const url = JSON.url;
      const title = JSON.title;
      const exp = JSON.explanation;
      console.log("Fetched from API.");
      changePic(url);
      showText(exp, title);
    }});
  
  };

function changePic(url) {
  console.log("Changing pic");
  xapi.Command.UserInterface.Branding.Fetch({Type: "HalfwakeBackground", URL: url});
  // TODO: if DX80 then do not
  xapi.Command.Cameras.Background.Fetch({Image: 'User1', Url: url});
  xapi.Command.Cameras.Background.Set({ Image: 'User1', Mode: 'Image'});
}

function showText(exp, title) {
  console.log("Showing text");
  const expSeparated = parts(exp);
  const throttleTime = 6000;
  xapi.Command.UserInterface.Message.TextLine.Display({ Duration: 6, Text: title, X: 5000, Y: 1000});
  console.log(title);
  expSeparated.forEach(function (textLine, i){
    setTimeout(() => {
       xapi.Command.UserInterface.Message.TextLine.Display({ Duration: 6, Text: textLine, X: 5000, Y: 1000});
      console.log(textLine);
     }, throttleTime * (i + 1));
   });

   xapi.Command.UserInterface.Extensions.Clear({ });
}

function parts(str) {
  //const listOfStrings = str.match(/.{1,100}/g);
  const listOfStrings = wordWrap(str, 100);
  return listOfStrings;
}

function wordWrap(str, charMax) {
    let arr = [];
    let space = /\s/;

    const words = str.split(space);
    // push first word into new array
    if (words[0].length) {
        arr.push(words[0]);
    }

    for (let i = 1; i < words.length; i++) {
        if (words[i].length + arr[arr.length - 1].length < charMax) {
            arr[arr.length - 1] = `${arr[arr.length - 1]} ${words[i
            ]}`;
        } else {
            arr.push(words[i]);
        }
    }

    //console.log('arr', arr);
    return arr;
}


async function addDailyPanel() {
  console.log('Adding panel');

  const xml = `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1000</Order>
    <Type>Global</Type>
    <Icon>Language</Icon>
    <Color>#07C1E4</Color> 
    <Name>Nasa Daily</Name>
    <ActivityType>Custom</ActivityType>
     </Panel>
  </Extensions> `

  await xapi.Command.UserInterface.Extensions.Panel.Save({
    PanelId: 'nasaPanel',
  }, xml);

  // Update on change
  xapi.Event.UserInterface.Extensions.Widget.LayoutUpdated.once(addDailyPanel);

  // xapi.Command.UserInterface.Extensions.Panel.Open
  //   ({ PanelId: 'nasaPanel'});
}

init();
