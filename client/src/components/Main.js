import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import {
  Button,
  Container,
  Grid,
  Header,
  Dimmer,
  Loader,
  Message,
  Menu,
  Form,
  Input
} from 'semantic-ui-react';

class Main extends React.Component {
  state = {
    file: null,
    status: null,
    source: 'facebook.com',
    medium: 'cpc'
  };

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({
      file: acceptedFiles[0],
      status: 'ready'
    });
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClick = event => {
    event.preventDefault();
    this.setState({ status: 'loading' });
    const fileName = this.state.file.name
      .split('/')
      .pop()
      .replace(/(\.[\w\d_-]+)$/i, '_parsed.csv');
    const url = 'http://localhost:3001/upload';
    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('source', this.state.source);
    formData.append('medium', this.state.medium);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios
      .post(url, formData, config)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        this.setState({ file: null, status: null });
      })
      .catch(err =>
        this.setState({
          status: `There was an error of ${err}, please try again later`
        })
      );
  };

  render() {
    const dropzoneStyle = {
      margin: '15px auto 15px auto',
      width: '100%',
      height: '400px',
      borderWidth: '2px',
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRadius: '5px'
    };

    return (
      <div>
        <div>
          <Menu color="blue">
            <Container>
              <Menu.Item as="a" header>
                Facebook Ads UTM Generator
              </Menu.Item>
            </Container>
          </Menu>
        </div>
        <div className="upload-form">
          <Container style={{ marginTop: '5em' }}>
            <Grid
              textAlign="center"
              style={{ height: '100%' }}
              verticalAlign="middle"
            >
              <Grid.Row columns={1}>
                <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="blue" textAlign="center">
                    Facebook UTM Generator
                  </Header>
                  {this.state.message ? (
                    <Message>{this.state.message}</Message>
                  ) : (
                    <div />
                  )}
                  <Form>
                    <Form.Group widths="equal">
                      <Form.Field required>
                        <label>UTM Source</label>
                        <Input
                          fluid
                          name="source"
                          value={this.state.source}
                          onChange={this.onChange}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>UTM Medium</label>
                        <Input
                          fluid
                          name="medium"
                          value={this.state.medium}
                          onChange={this.onChange}
                        />
                      </Form.Field>
                    </Form.Group>
                  </Form>
                  <Dropzone
                    style={dropzoneStyle}
                    activeStyle={{ ...dropzoneStyle, borderColor: '#2185d0' }}
                    accept="text/csv, text/txt"
                    onDrop={files => this.onDrop(files)}
                  >
                    {this.state.status === 'loading' ? (
                      <Dimmer active inverted>
                        <Loader />
                      </Dimmer>
                    ) : (
                      <div>
                        <p style={{ marginTop: '100px' }}>
                          Start by dropping some files here, or click to select
                          files to upload.
                        </p>
                        <p>Only .csv files are accepted</p>
                        {this.state.file ? (
                          <p>
                            <strong>File to parse: </strong>
                            {this.state.file.name}
                          </p>
                        ) : (
                          <p />
                        )}
                      </div>
                    )}
                  </Dropzone>
                  <Button
                    fluid
                    color="blue"
                    type="submit"
                    onClick={this.handleClick}
                    disabled={!this.state.file}
                  >
                    Upload
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
          <Container>
            <Grid>
              <Grid.Row style={{ marginTop: '3em' }} columns={3}>
                <Grid.Column>
                  <strong>Step 1:</strong> Download a .csv of the campaigns from
                  Facebook Ads Manager that you need UTM parameters for.
                </Grid.Column>
                <Grid.Column>
                  <strong>Step 2:</strong> Upload the file to the parser above
                  with the UTM parameters for source and medium that you use.
                </Grid.Column>
                <Grid.Column>
                  <strong>Step 3:</strong> You'll get a .csv with only the 'URL
                  Tags' column changed. Upload the new .csv file back to
                  Facebook Ads Manager and your UTM parameters will magically
                  appear!
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>
      </div>
    );
  }
}

export default Main;
