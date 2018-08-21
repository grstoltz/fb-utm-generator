import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

const Content = () => (
  <Container>
    <Grid>
      <Grid.Row style={{ marginTop: '3em' }} columns={3}>
        <Grid.Column>
          <strong>Step 1:</strong> Download a .csv of the campaigns from
          Facebook Ads Manager that you need UTM parameters for.
        </Grid.Column>
        <Grid.Column>
          <strong>Step 2:</strong> Upload the file to the parser above with the
          UTM parameters for source and medium that you use.
        </Grid.Column>
        <Grid.Column>
          <strong>Step 3:</strong> You'll get a .txt file with only the 'URL
          Tags' column changed. Upload the new .txt file back to Facebook Ads
          Manager and your UTM parameters will magically appear!
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

export default Content;
