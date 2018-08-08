import React from 'react';
import { Segment, Container, Grid, Header } from 'semantic-ui-react';

const Footer = () => (
  <div>
    <Container>
      <Grid>
        <Grid.Row style={{ marginTop: '3em' }} columns={3}>
          <Grid.Column>
            <strong>Step 1:</strong> Download a .csv of the campaigns from
            Facebook Ads Manager that you need UTM parameters for.
          </Grid.Column>
          <Grid.Column>
            <strong>Step 2:</strong> Upload the file to the parser above with
            the UTM parameters for source and medium that you use.
          </Grid.Column>
          <Grid.Column>
            <strong>Step 3:</strong> You'll get a .csv with only the 'URL Tags'
            column changed. Upload the new .csv file back to Facebook Ads
            Manager and your UTM parameters will magically appear!
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
    <Segment
      inverted
      vertical
      style={{
        padding: '.5em',
        position: 'fixed',
        left: '0',
        bottom: '0',
        width: '100%'
      }}
    >
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={16}>
              <Header as="h4" inverted textAlign="center">
                Made with{' '}
                <span role="img" aria-label="Beer">
                  🍺
                </span>
                &amp;
                <span
                  role="img"
                  aria-label="Coffee"
                  style={{ marginLeft: '.2em' }}
                >
                  ☕
                </span>
                by Grant Stoltz
                {/* by <a 
              href="https://www.grantstoltz.com"
              >Grant Stoltz</a> */}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  </div>
);

export default Footer;
