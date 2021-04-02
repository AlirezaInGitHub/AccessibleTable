import React from 'react';
import ReactDOM from 'react-dom';
import {AccessibleTable} from './AccessibleTable';

const Wrapper = () => (
  <>
    <AccessibleTable />
  </>
);

ReactDOM.render(<Wrapper />, document.getElementById('root'));
