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

  console.log(url, title, exp, type);

  /*
  xapi.Command.Cameras.Background.Fetch({Image: 'User1', Url: url});
  xapi.Command.Cameras.Background.Set
    ({ Image: 'User1', Mode: 'Image'});
  */
}

async function addManagerPanel() {
  console.info('Adding panel');

  const xml = `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1000</Order>
    <Type>Global</Type>
    <Icon>Language</Icon>
    <Color>#07C1E4</Color> 
    <Name>Web apps</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <Name>Nasa Daily</Name>
      <Row>
        <Name>Hei Elise, Du er flott!</Name>
      </Row>
    </Page>
  </Panel>
</Extensions> 
  `

  await xapi.Command.UserInterface.Extensions.Panel.Save({
    PanelId: 'nasaPanel',
  }, xml);

  // Update manager on layout change
  xapi.Event.UserInterface.Extensions.Widget.LayoutUpdated.once(addManagerPanel);

  xapi.Command.UserInterface.Extensions.Panel.Open
    ({ PanelId: 'nasaPanel'});
}


init();
addManagerPanel();
