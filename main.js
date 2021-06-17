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
  addManagerPanel(title, exp)
  /*
  xapi.Command.Cameras.Background.Fetch({Image: 'User1', Url: url});
  xapi.Command.Cameras.Background.Set
    ({ Image: 'User1', Mode: 'Image'});
  */
}

function parts() {
  const str = 'abcdefghijkl';
  console.log(str.match(/.{1,3}/g));
}
  


async function addManagerPanel(title,exp) {
  console.info('Adding panel');

  const xml = `<Extensions>
  <Version>1.7</Version>
  <Panel>
    <Order>1000</Order>
    <Type>Global</Type>
    <Icon>Language</Icon>
    <Color>#07C1E4</Color> 
    <Name>Nasa Daily</Name>
    <ActivityType>Custom</ActivityType>
    <Page>
      <style>
      <Name>${title}</Name>
      <Name>${exp}</Name>
      </style>
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
