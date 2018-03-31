import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import raffle from './icocontract';
import icocontract from './icocontract';
import icotoken from './icotoken';
import Layout from './Layout';
import { Form, Grid, Card, Progress, Button, Input } from 'semantic-ui-react';


/*

ICOtoken : 0xe48ed6849c7dd73a143a492c94d0f684ec617496
ATT 18
ICOContract : 0xf9824ce51c2d49ebb7036e70f4741b25bc845c8f
*/
class App extends Component {
  state = {
    manager: '',
    tokenBalance: 0,
    value: '',
    players: [],
    balance: '',
    message: '',
    loadingTransfer:false,
    loading:false,
    winner:'No Winner Chosen Yet',
    transferAmount: 0,
    transferAddress: '0x0',
    contractBalance: 0,
    creationCap:0,
    tokensRemaining:0

  };

  async componentDidMount() {
    //const manager = await raffle.methods.manager().call();
    //const players = await raffle.methods.getTickets().call();
    //const balance = await web3.eth.getBalance(raffle.options.address);

    const accounts = await web3.eth.getAccounts();
    let tokenBalance = 0;
    if(accounts && accounts[0]){
       tokenBalance = await icotoken.methods.balanceOf(accounts[0]).call();
    }

    let contractBalance = await icotoken.methods.totalSupply().call();
    let creationCap = await icocontract.methods.tokenCreationCap().call();
    let tokensRemaining =  contractBalance / creationCap;

    tokenBalance = web3.utils.fromWei(tokenBalance.toString(10), "ether");
    this.setState({tokenBalance,contractBalance,creationCap, tokensRemaining });
  }

  onSubmit = async event => {
    event.preventDefault();
    console.log('attempting to get accounts');
    const accounts = await web3.eth.getAccounts();
    if(accounts && accounts[0]){

      console.log('attempting to get accounts');
        const returned = await web3.eth.sendTransaction({from: accounts[0], to: '0xf9824ce51c2d49ebb7036e70f4741b25bc845c8f', value: web3.utils.toWei(this.state.value, 'ether') }, function (err, txhash) {
                console.log('error: ' + err);
                console.log('txhash: ' + txhash);
              });

              this.setState({ message: 'Waiting on transaction success...', loading:true });
              let tokenBalance = 0;
              if(accounts && accounts[0]){
                 tokenBalance = await icotoken.methods.balanceOf(accounts[0]).call();
              }

              tokenBalance = web3.utils.fromWei(tokenBalance.toString(10), "ether");
              this.setState({tokenBalance});



    /*0xe48ed6849c7dd73a143a492c94d0f684ec617496
    await raffle.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('.1', 'ether')
    });
    */
    this.setState({ message: 'You have successfully sent to the ATT tokensale contract!  Your tokens have been sent to your account.', loading:false });
  }else{
    this.setState({ message: 'You must be logged into Metamask on the Rinkby network to use this application.', loading:false });
  }
  };

  onTransfer = async event => {

    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Please wait on transaction to confirm ...', loadingTransfer:true });




    let transfer = 0;
    if(accounts && accounts[0]){
        transfer = await icotoken.methods.transfer(this.state.transferAddress,web3.utils.toWei(this.state.transferAmount, 'ether')).send({
        from: accounts[0]
      });
    }
    console.log(transfer);


    this.setState({ message: 'The token transfer has completed successfully' , loadingTransfer:false});
  };



  render() {

    return (
      <Layout>
      <div>
        <h2 style={{marginTop:'30px',marginBottom:'30px',textAlign:'center'}}><b>YOUR CURRENT TOKEN BALANCE : {this.state.tokenBalance} ATT</b></h2>

        <Grid>
                  <Grid.Row>
                    <Grid.Column width={8}>




        <form onSubmit={this.onSubmit}>
          <h5>Purchase Tokens via the form below and use metamask or send your Ether manually to 0xf9824ce51c2d49ebb7036e70f4741b25bc845c8f</h5>
          <div>
            <p>Enter the amount of Ether that you want to send to the contract, you will get 1000 ATT Tokens for every Ether.</p>
            <p> You will need to use MetaMask and switch to the Rinkby test network.  You can get Rinkby Ether here : <a href="https://faucet.rinkeby.io/" target="_BLANK">https://faucet.rinkeby.io</a> </p>
            <br />
            <Input
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })}
          label="ether"
          labelPosition="right"
        />
          </div>
          <br />
          <Button
                  loading={this.state.loading}
                  floated="left"
                  content="Purchase ATT Tokens"
                  icon="rocket"
                  primary
                />
                <br /><br />

                 <h4>A total of {this.state.tokensRemaining * 100}% of all ATT tokens have been sold from the contract</h4>
                  <Progress percent={this.state.tokensRemaining} indicating />
                 <h4>{this.state.contractBalance} of {this.state.creationCap} ATT tokens Sold</h4>


                  {this.state.message}
        </form>
</Grid.Column>

  <Grid.Column width={8}>
        <h5>Transfer your tokens to another account.</h5>
<Form onSubmit={this.onTransfer} error={!!this.state.errorMessage}>
        <Form.Field>
                  <label>Amount to Send</label>
        <Input
        value={this.state.transferAmount}
        onChange={event => this.setState({ transferAmount: event.target.value })}
          name='transferAmount'
          placeholder='Amount of ATT tokens'
        />
          </Form.Field>
          <Form.Field>
            <label>Address to Send to.</label>
        <Input
        value={this.state.transferAddress}
        onChange={event => this.setState({ transferAddress: event.target.value })}
          name='transferAddress'
          placeholder='Reciever Ethereum Address'
        />
        </Form.Field>
        <Button
                loading={this.state.loadingTransfer}
                content="Transfer Tokens Now"
                icon="sun"
                primary
              />

        </Form>

        </Grid.Column>
      </Grid.Row>
    </Grid>

      </div>
      </Layout>
    );
  }
}

export default App;
