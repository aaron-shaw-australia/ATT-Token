import React from 'react';
import { Menu } from 'semantic-ui-react';


export default () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
        <a className="item">  <h1>ATT Tokens - Sample Token and ICO Contract</h1></a>
      <Menu.Menu position="right">
      <a className="item">Solidity, Web3 & React</a>
          <a className="item">Created By Aaron Shaw</a>
      </Menu.Menu>
    </Menu>
  );
};
