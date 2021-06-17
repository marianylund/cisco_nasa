import xapi from 'xapi';

function getJSON(){
const url = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY`;
return xapi.Command.HttpClient.Get({ Url: url })
  .then(r => JSON.parse(r.Body))
  .then(res => res)
}

async function init() {
  const JSON = await getJSON();
  const url = JSON.url;
  const title = JSON.title;
  const exp = JSON.explanation;
  const type = JSON.media_type;

  addManagerPanel(title, exp);

  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(async (event) => {
    if (event.PanelId === 'nasaPanel') {
      console.log("Clicked!");
        changePic(url);
        showText(exp);
    }});
  
  };

function changePic(url) {
  console.log("Changing pic");
  xapi.Command.Cameras.Background.Fetch({Image: 'User1', Url: url});
  xapi.Command.Cameras.Background.Set
    ({ Image: 'User1', Mode: 'Image'});
}

function showText(exp) {
  console.log("Showing text");

  const expSeparated = parts(exp);
  const throttleTime = 500;
  expSeparated.forEach(function (textLine, i){
    setTimeout(() => {
       xapi.Command.UserInterface.Message.TextLine.Display({ Duration: 2, Text: textLine, X: 5000, Y: 5000});

     }, throttleTime * (i + 1));
   });
   xapi.Command.UserInterface.Extensions.Clear
    ({ });
}

function parts(str) {
  const listOfStrings = str.match(/.{1,100}/g);
  console.log(listOfStrings);
  return listOfStrings;
}


async function addManagerPanel(title, exp) {
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

  // Update manager on layout change
  xapi.Event.UserInterface.Extensions.Widget.LayoutUpdated.once(addManagerPanel);

  xapi.Command.UserInterface.Extensions.Panel.Open
    ({ PanelId: 'nasaPanel'});
}

init();
