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

  const expSeparated = parts(exp);
  // xapi.Command.UserInterface.Message.Prompt.Display
  //  ({ Duration: 10, FeedbackId: 0, "Option.1": expSeparated[1], "Option.2": expSeparated[2], "Option.3": expSeparated[3], "Option.4": expSeparated[4], "Option.5": expSeparated[5], Text: expSeparated[0], Title: title});
      xapi.Command.UserInterface.Message.TextLine.Display({ Duration: 10, Text: expSeparated[0], X: 1500, Y: 1500});
  
  const throttleTime = 500;
  // expSeparated.forEach(function (textLine, i){
  //   setTimeout(() => {
  //     console.log(textLine, i);
  //     xapi.Command.UserInterface.Message.TextLine.Display({ Duration: 2, Text: textLine, X: 500, Y: 500});

  //   }, throttleTime * (i + 1));
  // });

  console.log(url, title, exp, type);
  //addManagerPanel(title, exp)
  /*
  xapi.Command.Cameras.Background.Fetch({Image: 'User1', Url: url});
  xapi.Command.Cameras.Background.Set
    ({ Image: 'User1', Mode: 'Image'});
  */
}

function parts(str) {
  const listOfStrings = str.match(/.{1,100}/g);
  console.log(listOfStrings);
  return listOfStrings;
}
  


async function addManagerPanel(title, exp) {
  console.info('Adding panel');
  
  const xmlTextLines = exp.map((textLine) => {
    return `
      <Row>
        <Name>${textLine}</Name>
      </Row>
    `;
  }).join('\n');

  console.log(xmlTextLines);

  const xmlEnd = `</Page>
    </Panel>
  </Extensions> 
    `
  console.log(xmlEnd);

  const xmlStart = `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1000</Order>
    <Type>Global</Type>
    <Icon>Language</Icon>
    <Color>#07C1E4</Color> 
    <Name>Nasa Daily</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>${title}</Name>` + xmlTextLines;
      
  console.log(xmlStart);

  const xml = xmlStart + xmlEnd;
  console.log(xml);


  await xapi.Command.UserInterface.Extensions.Panel.Save({
    PanelId: 'nasaPanel',
  }, xml);

  // Update manager on layout change
  xapi.Event.UserInterface.Extensions.Widget.LayoutUpdated.once(addManagerPanel);

  xapi.Command.UserInterface.Extensions.Panel.Open
    ({ PanelId: 'nasaPanel'});
}


init();
