import React from 'react';
import { Offcanvas, OffcanvasHeader } from 'reactstrap';

import 'react-toastify/dist/ReactToastify.css';

const OffCanvas = (props) => {
  return (
    <React.Fragment>
      <Offcanvas
        isOpen={props.isOpen}
        direction={props.direction || 'end'}
        toggle={props.toggleFunction}
        id="offcanvasRight"
        className={`border-bottom ${props?.className}`}
      >
        <OffcanvasHeader toggle={props.toggleFunction} id="offcanvasRightLabel">
          {props.title}
        </OffcanvasHeader>
        {props.data}
      </Offcanvas>
    </React.Fragment>
  );
};

export default OffCanvas;
