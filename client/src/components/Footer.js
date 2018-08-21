import React from 'react';
import { Segment, Container, Grid, Header } from 'semantic-ui-react';

const Footer = () => (
  <Segment
    style={{
      marginTop: '190px',
      width: '100%'
    }}
    inverted
    vertical
  >
    <Container>
      <Grid divided inverted stackable>
        <Grid.Row>
          <Grid.Column>
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
              {/* <a href="https://www.grantstoltz.com">Grant Stoltz</a> */}
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Segment>
);

export default Footer;
